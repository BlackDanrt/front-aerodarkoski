import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { map as leafletMap, tileLayer, marker, latLng, divIcon, DivIcon } from 'leaflet';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { Avion } from '../models/avion';
import { AvionService } from '../services/avion-service';
import { ToastService } from '../services/toast-service';
import { ClimaService } from '../services/clima-service';
import { Clima } from '../models/clima';

/**
 * Componente encargado de visualizar en un mapa interactivo
 * la posición de los aviones en tiempo real y los reportes
 * meteorológicos asociados a distintos aeropuertos.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css'],
  standalone: false,
})
export class Mapa implements AfterViewInit, OnDestroy {

  /** Servicio para mostrar notificaciones al usuario. */
  private toast = inject(ToastService);

  /** Servicio para obtener información de vuelos. */
  private avionService = inject(AvionService);

  /** Servicio para obtener reportes meteorológicos. */
  private climaService = inject(ClimaService);

  /** Marcadores asociados a reportes meteorológicos. */
  private marcadoresClima = new Map<string, LeafletMarker>();

  /** Referencia al mapa de Leaflet. */
  private map!: LeafletMap;

  /** Marcadores de aviones activos en el mapa. */
  private marcadores = new Map<string, LeafletMarker>();

  /** Datos dinámicos utilizados para animarla posición de los aviones. */
  private datosAviones = new Map<
    string,
    {
      lat: number;
      lng: number;
      velocidad: number;
      direccion: number;
      altitud: number;
    }
  >();

  /** Identificador del intervalo utilizado para la animación. */
  private intervaloAnimacion?: number;

  /** Suscripción encargada de actualizar la información de vuelos. */
  private suscripcion!: Subscription;

  /** Coordenadas geográficas de aeropuertos utilizados para mostrar información meteorológica. */
  private readonly COORDENADAS_AEROPUERTOS: Record<string, [number, number]> = {
    SKBO: [4.702, -74.147],
    SKRG: [6.164, -75.428],
    SKCL: [3.543, -76.382],
    SKCG: [10.442, -75.513],
    SKBQ: [10.889, -74.781],
    SKSP: [13.356, -81.711],
    SBGR: [-23.435, -46.473],
    SBGL: [-22.809, -43.244],
    SBBR: [-15.871, -47.918],
    SBSA: [-2.585, -44.235],
    SBFZ: [-3.776, -38.532],
    SBRF: [-8.126, -34.924],
    SAEZ: [-34.822, -58.535],
    SABE: [-34.559, -58.416],
    SACO: [-31.323, -64.208],
    SAME: [-32.831, -68.793],
    SCEL: [-33.393, -70.786],
    SCTE: [-38.766, -72.637],
    SCFA: [-23.444, -70.445],
    SPJC: [-12.022, -77.114],
    SPZO: [-13.535, -71.939],
    SPQU: [-16.341, -71.583],
    SEQM: [-0.129, -78.358],
    SEGU: [-2.158, -79.884],
    SVMI: [10.601, -66.991],
    SVMC: [10.558, -71.728],
    SLVR: [-17.644, -63.135],
    SLLP: [-16.513, -68.192],
    SUMU: [-34.838, -56.03],
    SGAS: [-25.24, -57.519],
    SYCJ: [6.498, -58.254],
    SMJP: [5.453, -55.188],
  };

  /** Intervalo de actualización de vuelos en milisegundos. */
  private readonly INTERVALO_MS = 5 * 60 * 1000;

  /** Fotogramas por segundo utilizados en la animación. */
  private readonly FPS = 30;

  /** Factor utilizado para suavizar el movimiento de los aviones. */
  private readonly FACTOR_VELOCIDAD = 0.6;

  /**
   * Inicializa el mapa, el seguimiento de vuelos,
   * la animación y la carga de información meteorológica.
   */
  ngAfterViewInit(): void {
    this.initMap();
    this.iniciarTracking();
    this.iniciarLoopAnimacion();
    this.cargarClima();
  }

  /**
   * Configura e inicializa el mapa de Leaflet.
   */
  private initMap(): void {
    this.map = leafletMap('map', {
      center: [-14.235, -51.925],
      zoom: 4,
      minZoom: 4,
      maxZoom: 18,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      maxBoundsViscosity: 1.0,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    this.map.on('focus', () => this.map.scrollWheelZoom.enable());
    this.map.on('blur', () => this.map.scrollWheelZoom.disable());

    tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(this.map);
  }

  /**
   * Inicia la actualización periódica de los vuelos
   * mostrados en el mapa.
   */
  private iniciarTracking(): void {
    this.suscripcion = interval(this.INTERVALO_MS)
      .pipe(
        startWith(0),
        switchMap(() => this.avionService.obtenerTodos()),
      )
      .subscribe({
        next: (aviones) => this.actualizarAviones(aviones),
        error: () => this.toast.mostrar('Error al cargar los aviones', false),
      });
  }

  /**
   * Inicia el ciclo de animación encargado de
   * actualizar suavemente la posición de los aviones.
   */
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
          intervaloFrame / 1000,
        );

        datos.lat = nuevaPos.lat;
        datos.lng = nuevaPos.lng;

        markerRef.setLatLng([datos.lat, datos.lng]);
      });
    }, intervaloFrame);
  }

  /**
   * Calcula una posición futura a partir de la ubicación,
   * velocidad y rumbo actuales de una aeronave.
   *
   * @param lat Latitud actual.
   * @param lng Longitud actual.
   * @param velocidadKnots Velocidad en nudos.
   * @param direccionGrados Rumbo en grados.
   * @param segundos Tiempo transcurrido.
   * @returns Nueva posición calculada.
   */
  private calcularPosicionFutura(
    lat: number,
    lng: number,
    velocidadKnots: number,
    direccionGrados: number,
    segundos: number,
  ): { lat: number; lng: number } {
    const velocidadReal = velocidadKnots * this.FACTOR_VELOCIDAD;
    const velocidadKmS = velocidadReal * 0.00514444;
    const distanciaKm = velocidadKmS * segundos;
    const rad = (direccionGrados * Math.PI) / 180;

    const deltaNorteKm = distanciaKm * Math.cos(rad);
    const deltaEsteKm = distanciaKm * Math.sin(rad);

    const deltaLat = deltaNorteKm / 111;
    const deltaLng = deltaEsteKm / (111 * Math.cos((lat * Math.PI) / 180));

    return {
      lat: lat + deltaLat,
      lng: lng + deltaLng,
    };
  }

  /**
   * Actualiza los marcadores de los aviones
   * visibles en el mapa.
   *
   * @param aviones Lista de aeronaves obtenidas desde el servicio.
   */
  private actualizarAviones(aviones: Avion[]): void {
    const icaosActivos = new Set(
      aviones.filter((a) => a.flight?.icaoNumber).map((a) => a.flight.icaoNumber),
    );

    this.marcadores.forEach((markerRef, icao) => {
      if (!icaosActivos.has(icao)) {
        this.map.removeLayer(markerRef);
        this.marcadores.delete(icao);
        this.datosAviones.delete(icao);
      }
    });

    aviones.forEach((avion) => {
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
          altitud: geo.altitude ?? 0,
        });

        const newMarker = marker(latlng, { icon: icono }).addTo(this.map).bindPopup(popup);
        this.marcadores.set(id, newMarker);
      }
    });
  }

  /**
   * Genera el icono utilizado para representar
   * una aeronave en el mapa.
   *
   * @param heading Dirección de la aeronave.
   * @returns Icono configurado.
   */
  private crearIconoAvion(heading: number): DivIcon {
    return divIcon({
      className: '',
      html: `<img src="/assets/avion.png" style="
      transform: rotate(${heading}deg);
      width: 22px;
      height: 22px;
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.6));
    ">`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }

  /**
   * Genera el contenido HTML del popup
   * asociado a una aeronave.
   *
   * @param a Información del avión.
   * @returns Contenido HTML del popup.
   */
  private crearPopup(a: Avion): string {
    const datos = this.datosAviones.get(a.flight?.icaoNumber || '');
    return `
      <div style="font-family: sans-serif; font-size: 13px; min-width: 180px;">
        <b style="font-size:15px;">✈ ${a.airline?.name ?? 'N/A'} ${a.flight?.iataNumber ?? ''}</b>
        <hr style="margin: 4px 0"/>
        Origen: <b>${a.departure?.iataCode ?? 'N/A'}</b><br>
        Destino: <b>${a.arrival?.iataCode ?? 'N/A'}</b><br>
        <hr style="margin: 4px 0"/>
        Lat: ${datos?.lat.toFixed(4) ?? 'N/A'}, Lng: ${datos?.lng.toFixed(4) ?? 'N/A'}<br>
        Altitud: ${a.geography?.altitude ?? 'N/A'} ft<br>
        Velocidad: ${a.speed?.horizontal ?? 'N/A'} kt<br>
        Heading: ${a.geography?.direction ?? 'N/A'}°<br>
        Estado: <b>${a.status ?? 'N/A'}</b>
      </div>
    `;
  }

  /**
   * Obtiene y muestra los reportes meteorológicos.
   */
  private cargarClima(): void {
    this.climaService.obtenerReportesClima().subscribe({
      next: (climas) => this.mostrarMarcadoresClima(climas),
      error: () => this.toast.mostrar('Error al cargar el clima', false),
    });
  }

  /**
   * Crea los marcadores meteorológicos sobre el mapa.
   *
   * @param climas Reportes meteorológicos obtenidos.
   */
  private mostrarMarcadoresClima(climas: Clima[]): void {
    this.marcadoresClima.forEach((m) => this.map.removeLayer(m));
    this.marcadoresClima.clear();

    climas.forEach((clima) => {
      const coords = this.COORDENADAS_AEROPUERTOS[clima.icaoId];
      if (!coords) return;

      const icono = this.crearIconoClima(clima);
      const popup = this.crearPopupClima(clima);

      const m = marker(latLng(coords[0], coords[1]), { icon: icono })
        .addTo(this.map)
        .bindPopup(popup);

      this.marcadoresClima.set(clima.icaoId, m);
    });
  }

  /**
   * Genera el icono correspondiente a las condiciones
   * meteorológicas reportadas.
   *
   * @param clima Información meteorológica.
   * @returns Icono configurado.
   */
  private crearIconoClima(clima: Clima): DivIcon {
    const emoji = this.obtenerEmojiClima(clima);
    return divIcon({
      className: '',
      html: `<div style="
      font-size: 20px;
      line-height: 1;
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));
      cursor: pointer;
    ">${emoji}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14],
    });
  }

  /**
   * Determina el emoji representativo
   * de las condiciones de nubosidad.
   *
   * @param clima Información meteorológica.
   * @returns Emoji descriptivo.
   */
  private obtenerEmojiClima(clima: Clima): string {
    const cover = clima.clouds?.[0]?.cover ?? 'CLR';
    if (cover === 'CLR' || cover === 'SKC') return '☀️';
    if (cover === 'FEW') return '🌤️';
    if (cover === 'SCT') return '⛅';
    if (cover === 'BKN') return '🌥️';
    if (cover === 'OVC') return '☁️';
    return '🌡️';
  }

  /**
   * Genera el contenido HTML del popup
   * asociado a un reporte meteorológico.
   *
   * @param c Reporte meteorológico.
   * @returns Contenido HTML del popup.
   */
  private crearPopupClima(c: Clima): string {
    const nubes = c.clouds?.length
      ? c.clouds.map((n) => `${n.cover} a ${n.base} ft`).join(', ')
      : 'Sin datos';

    return `
    <div style="font-family: sans-serif; font-size: 13px; min-width: 190px;">
      <b style="font-size:15px;">${c.icaoId}</b>
      <hr style="margin: 4px 0"/>
      Temperatura: <b>${c.temp}°C</b><br>
      Punto de rocío: <b>${c.dewp}°C</b><br>
      <hr style="margin: 4px 0"/>
      Viento: <b>${c.wspd} kt</b> desde <b>${c.wdir}°</b><br>
      Visibilidad: <b>${c.visib}</b><br>
      Presión: <b>${c.altim} hPa</b><br>
      Nubes: <b>${nubes}</b><br>
      <hr style="margin: 4px 0"/>
      Reporte: ${c.reportTime}
    </div>
  `;
  }

  /**
   * Libera recursos, elimina marcadores y
   * cancela suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    if (this.suscripcion) this.suscripcion.unsubscribe();
    if (this.intervaloAnimacion) clearInterval(this.intervaloAnimacion);

    this.marcadores.forEach((markerRef) => this.map.removeLayer(markerRef));
    this.marcadores.clear();
    this.datosAviones.clear();

    this.marcadoresClima.forEach((m) => this.map.removeLayer(m));
    this.marcadoresClima.clear();
    if (this.map) this.map.remove();
  }
}
