import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { map as leafletMap, tileLayer, marker, latLng, divIcon, DivIcon } from 'leaflet';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { Avion } from '../models/avion';
import { AvionService } from '../services/avion-service';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css'],
  standalone: false
})
export class Mapa implements AfterViewInit, OnDestroy {
  private toast = inject(ToastService);
  private avionService = inject(AvionService);

  private map!: LeafletMap;
  private marcadores = new Map<string, LeafletMarker>();
  private datosAviones = new Map<string, {
    lat: number;
    lng: number;
    velocidad: number;
    direccion: number;
    altitud: number;
  }>();
  private intervaloAnimacion?: number;
  private suscripcion!: Subscription;

  private readonly INTERVALO_MS = 5 * 60 * 1000;
  private readonly FPS = 30;
  private readonly FACTOR_VELOCIDAD = 0.1;

  ngAfterViewInit(): void {
    this.initMap();
    this.iniciarTracking();
    this.iniciarLoopAnimacion();
  }

  private initMap(): void {
    this.map = leafletMap('map', {
      center: [-14.235, -51.925],
      zoom: 4,
      minZoom: 4,
      maxZoom: 18,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
      noWrap: true
    }).addTo(this.map);
  }

  private iniciarTracking(): void {
    this.suscripcion = interval(this.INTERVALO_MS).pipe(
      startWith(0),
      switchMap(() => this.avionService.obtenerTodos())
    ).subscribe({
      next: (aviones) => this.actualizarAviones(aviones),
      error: () => this.toast.mostrar("Error al cargar los aviones", false)
    });
  }

  private iniciarLoopAnimacion(): void {
    const intervaloFrame = 1000 / this.FPS;

    this.intervaloAnimacion = window.setInterval(() => {
      this.datosAviones.forEach((datos, icao) => {
        const markerRef = this.marcadores.get(icao);
        if (!markerRef) return;

        const nuevaPos = this.calcularPosicionFutura(
          datos.lat,
          datos.lng,
          datos.velocidad,
          datos.direccion,
          intervaloFrame / 1000
        );

        datos.lat = nuevaPos.lat;
        datos.lng = nuevaPos.lng;

        markerRef.setLatLng([datos.lat, datos.lng]);
      });
    }, intervaloFrame);
  }

  private calcularPosicionFutura(
    lat: number,
    lng: number,
    velocidadKnots: number,
    direccionGrados: number,
    segundos: number
  ): { lat: number; lng: number } {
    const velocidadReal = velocidadKnots * this.FACTOR_VELOCIDAD;
    const velocidadKmS = velocidadReal * 0.000514444;
    const distanciaKm = velocidadKmS * segundos;
    const rad = (direccionGrados * Math.PI) / 180;

    const deltaNorteKm = distanciaKm * Math.cos(rad);
    const deltaEsteKm = distanciaKm * Math.sin(rad);

    const deltaLat = deltaNorteKm / 111;
    const deltaLng = deltaEsteKm / (111 * Math.cos((lat * Math.PI) / 180));

    return {
      lat: lat + deltaLat,
      lng: lng + deltaLng
    };
  }

  private actualizarAviones(aviones: Avion[]): void {
    const icaosActivos = new Set(
      aviones
        .filter(a => a.flight?.icaoNumber)
        .map(a => a.flight.icaoNumber)
    );

    this.marcadores.forEach((markerRef, icao) => {
      if (!icaosActivos.has(icao)) {
        this.map.removeLayer(markerRef);
        this.marcadores.delete(icao);
        this.datosAviones.delete(icao);
      }
    });

    aviones.forEach(avion => {
      const geo = avion.geography;
      if (!geo?.latitude || !geo?.longitude) return;

      const id = avion.flight?.icaoNumber;
      if (!id) return;

      const latlng = latLng(geo.latitude, geo.longitude);
      const icono = this.crearIconoAvion(geo.direction ?? 0);
      const popup = this.crearPopup(avion);

      if (this.marcadores.has(id)) {
        const datos = this.datosAviones.get(id);
        if (!datos) return;

        datos.lat = geo.latitude;
        datos.lng = geo.longitude;
        datos.velocidad = avion.speed?.horizontal ?? 0;
        datos.direccion = geo.direction ?? 0;
        datos.altitud = geo.altitude ?? 0;

        const markerRef = this.marcadores.get(id);
        markerRef?.setLatLng(latlng);
        markerRef?.setIcon(icono);
        markerRef?.setPopupContent(popup);
      } else {
        this.datosAviones.set(id, {
          lat: geo.latitude,
          lng: geo.longitude,
          velocidad: avion.speed?.horizontal ?? 0,
          direccion: geo.direction ?? 0,
          altitud: geo.altitude ?? 0
        });

        const newMarker = marker(latlng, { icon: icono })
          .addTo(this.map)
          .bindPopup(popup);
        this.marcadores.set(id, newMarker);
      }
    });
  }

  private crearIconoAvion(heading: number): DivIcon {
    return divIcon({
      className: '',
      html: `<div style="
      transform: rotate(${heading}deg);
      font-size: 22px;
      line-height: 1;
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.6));
    ">✈️</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  }

  private crearPopup(a: Avion): string {
    const datos = this.datosAviones.get(a.flight?.icaoNumber || '');
    return `
      <div style="font-family: sans-serif; font-size: 13px; min-width: 180px;">
        <b style="font-size:15px;">✈ ${a.airline?.name ?? 'N/A'} ${a.flight?.iataNumber ?? ''}</b>
        <hr style="margin: 4px 0"/>
        🛫 Origen: <b>${a.departure?.iataCode ?? 'N/A'}</b><br>
        🛬 Destino: <b>${a.arrival?.iataCode ?? 'N/A'}</b><br>
        <hr style="margin: 4px 0"/>
        📍 Lat: ${datos?.lat.toFixed(4) ?? 'N/A'}, Lng: ${datos?.lng.toFixed(4) ?? 'N/A'}<br>
        🔼 Altitud: ${a.geography?.altitude ?? 'N/A'} ft<br>
        💨 Velocidad: ${a.speed?.horizontal ?? 'N/A'} kt<br>
        🧭 Heading: ${a.geography?.direction ?? 'N/A'}°<br>
        📡 Estado: <b>${a.status ?? 'N/A'}</b>
      </div>
    `;
  }

  ngOnDestroy(): void {
    if (this.suscripcion) this.suscripcion.unsubscribe();
    if (this.intervaloAnimacion) clearInterval(this.intervaloAnimacion);

    this.marcadores.forEach((markerRef) => this.map.removeLayer(markerRef));
    this.marcadores.clear();
    this.datosAviones.clear();

    if (this.map) this.map.remove();
  }
}
