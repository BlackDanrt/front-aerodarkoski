import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {AvionService} from '../services/avion-service';
import {Avion} from '../models/avion';
import {ToastService} from '../services/toast-service';
import {ActivatedRoute} from '@angular/router';
import {TipoBusqueda} from '../enums/tipo-busqueda';
import {finalize, Observable} from 'rxjs';
import {HistorialService} from '../services/historial-service';
import {JwtService} from '../services/jwt-service';
import {Historial} from '../models/historial';

/**
 * Componente encargado de realizar búsquedas de vuelos
 * mediante códigos IATA o ICAO, tanto de aeropuertos
 * como de vuelos, y mostrar los resultados encontrados.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-busqueda',
  standalone: false,
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {

  /** Servicio para gestionar consultas de vuelos. */
  private avionService = inject(AvionService);

  /** Servicio para mostrar notificaciones. */
  private toast = inject(ToastService);

  /** Servicio para acceder a los parámetros de la ruta. */
  private route = inject(ActivatedRoute);

  /** Servicio para gestionar el historial de búsquedas. */
  private historialService = inject(HistorialService);

  /** Servicio para obtener información del JWT. */
  private jwt = inject(JwtService);


  /** Servicio para forzar la detección de cambios */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Mapa de tipos de búsqueda y sus respectivos métodos
   * de consulta en el servicio de aviones.
   */
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

  /** Indica si la carga de resultados fue exitosa. */
  cargaExitosa = false;

  /** Código utilizado para realizar la búsqueda. */
  codigo = '';

  /** Tipo de búsqueda seleccionado. */
  tipoBusqueda = 1;

  /**
   * Inicializa el componente obteniendo los parámetros
   * de la URL y ejecutando la búsqueda correspondiente.
   */
  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('codigo') ?? '';
    this.tipoBusqueda = parseInt(this.route.snapshot.paramMap.get('tipo') ?? '');
    this.cargarAviones(this.codigo, this.definirTipoBusqueda(this.codigo, this.tipoBusqueda));
  }

  /**
   * Determina el tipo de búsqueda a realizar
   * según el código recibido y el tipo seleccionado.
   *
   * @param codigo Código de aeropuerto o vuelo.
   * @param tipoBusqueda Tipo de búsqueda indicado en la ruta.
   * @returns Tipo de búsqueda que debe ejecutarse.
   */
  definirTipoBusqueda(codigo:string, tipoBusqueda:number){
    if (tipoBusqueda === 1) {
      if(codigo.length === 3) return TipoBusqueda.IATA;
      else return TipoBusqueda.ICAO;
    } else {
      if(codigo.length === 5) return TipoBusqueda.FLIGHT_IATA;
      else return TipoBusqueda.FLIGHT_ICAO;
    }
  }

  /**
   * Ejecuta la búsqueda de vuelos utilizando
   * el servicio correspondiente al tipo indicado.
   *
   * @param codigo Código de búsqueda.
   * @param tipoBusqueda Tipo de búsqueda a ejecutar.
   */
  cargarAviones(codigo:string, tipoBusqueda:TipoBusqueda) {
    this.rutas[tipoBusqueda](codigo).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
          if(response === null || response.length === 0){
            this.mensajeError = 'No se han encontrado aviones que coincidan con tu busqueda';
          } else {
            this.aviones = response;
            this.cargaExitosa = true;
          }
          this.guardarHistorial(codigo, tipoBusqueda);
      }, error: () => {
          this.toast.mostrar('Error al realizar la busqueda',false);
      }
    });
  }

  /**
   * Guarda la búsqueda realizada en el historial
   * del usuario autenticado.
   *
   * @param codigo Código buscado.
   * @param tipoBusqueda Tipo de búsqueda realizada.
   */
  guardarHistorial(codigo:string, tipoBusqueda:TipoBusqueda) {
    const idUsuario = this.jwt.getIdUsuario();
    if (!idUsuario) return;

    const historial: Historial = {
      idUsuario,
      busqueda: codigo,
      tipoBusqueda,
    };

    this.historialService.crear(historial).subscribe({
      next: () => {
        this.toast.mostrar('La busqueda ha sido agregada a tu historial exitosamente', true);
      }, error: () => {
        this.toast.mostrar('Error al agregar tu busqueda a tu historial', false);
      }
    });

  }
}
