import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {AvionService} from '../services/avion-service';
import {Avion} from '../models/avion';
import {ToastService} from '../services/toast-service';
import {ActivatedRoute} from '@angular/router';
import {TipoBusqueda} from '../enums/tipo-busqueda';
import {finalize, Observable} from 'rxjs';
import {HistorialService} from '../services/historial-service';
import {JwtService} from '../services/jwt-service';
import {Historial} from '../models/historial';

@Component({
  selector: 'app-busqueda',
  standalone: false,
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {

  private avionService = inject(AvionService);

  private toast = inject(ToastService);

  private route = inject(ActivatedRoute);

  private historialService = inject(HistorialService);

  private jwt = inject(JwtService);

  /** Servicio para forzar la detección de cambios */
  private cdr = inject(ChangeDetectorRef);

  private readonly rutas: Record<TipoBusqueda, (codigo: string) => Observable<Avion[]>> = {
    [TipoBusqueda.IATA]:        (codigo) => this.avionService.buscarPorArrIata(codigo),
    [TipoBusqueda.ICAO]:        (codigo) => this.avionService.buscarPorArrIcao(codigo),
    [TipoBusqueda.FLIGHT_IATA]: (codigo) => this.avionService.buscarPorFlightIata(codigo),
    [TipoBusqueda.FLIGHT_ICAO]: (codigo) => this.avionService.buscarPorFlightIcao(codigo),
  };

  /** Lista completa de auditorías */
  aviones: Avion[] = [];

  /** Indica si los datos están cargando */
  cargando = true;

  /** Mensaje de error mostrado en pantalla */
  mensajeError = '';

  cargaExitosa = false;

  codigo = '';

  tipoBusqueda = 1;

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('codigo') ?? '';
    this.tipoBusqueda = parseInt(this.route.snapshot.paramMap.get('tipo') ?? '');
    this.cargarAviones(this.codigo, this.definirTipoBusqueda(this.codigo, this.tipoBusqueda));
  }

  definirTipoBusqueda(codigo:string, tipoBusqueda:number){
    if (tipoBusqueda == 1) {
      if(codigo.length == 3) return TipoBusqueda.IATA;
      else return TipoBusqueda.ICAO;
    } else {
      if(codigo.length == 5) return TipoBusqueda.FLIGHT_IATA;
      else return TipoBusqueda.FLIGHT_ICAO;
    }
  }

  cargarAviones(codigo:string, tipoBusqueda:TipoBusqueda) {
    this.rutas[tipoBusqueda](codigo).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response: any) => {
          if(response == null || response.length == 0){
            this.mensajeError = 'No se han encontrado aviones que coincidan con tu busqueda';
          } else {
            this.aviones = response;
            this.cargaExitosa = true;
          }
          this.guardarHistorial(codigo, tipoBusqueda);
      }, error: (error: any) => {
          this.toast.mostrar('Error al realizar la busqueda',false);
      }
    });
  }

  historial!: Historial;

  guardarHistorial(codigo:string, tipoBusqueda:TipoBusqueda) {
    const idUsuario = this.jwt.getIdUsuario();
    if (!idUsuario) return;

    this.historial = {
      idUsuario: idUsuario,
      busqueda: codigo,
      tipoBusqueda: tipoBusqueda,
    };

    this.historialService.crear(this.historial).subscribe({
      next: (response: any) => {
        this.toast.mostrar('La busqueda ha sido agregada a tu hsitorial exitosamente', true);
      }, error: (error: any) => {
        this.toast.mostrar('Error al agregar tu busqueda a tu historial', false);
      }
    });

  }
}
