import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {HistorialService} from '../services/historial-service';
import {Historial} from '../models/historial';
import {JwtService} from '../services/jwt-service';
import {ToastService} from '../services/toast-service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';
import {TipoBusqueda} from '../enums/tipo-busqueda';

/**
 * Componente encargado de mostrar el historial
 * de búsquedas realizadas por el usuario autenticado.
 * Permite volver a ejecutar búsquedas almacenadas.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-historial-component',
  standalone: false,
  templateUrl: './historial-component.html',
  styleUrl: './historial-component.css',
})
export class HistorialComponent {
  /** Servicio para gestionar los historiales de búsqueda. */
  private historialService = inject(HistorialService);

  /** Servicio para acceder a la información del JWT. */
  private jwt = inject(JwtService);

  /** Servicio para mostrar notificaciones al usuario. */
  private toast = inject(ToastService);

  /** Servicio de navegación entre rutas. */
  private router = inject(Router);

  /** Servicio para forzar la detección de cambios. */
  private cdr = inject(ChangeDetectorRef);

  /** Lista de búsquedas almacenadas en el historial. */
  historiales: Historial[] = [];

  /** Indica si los datos están cargando */
  cargando = true;

  /** Mensaje de error mostrado en pantalla */
  mensajeError = '';

  /** Nombre del usuario autenticado. */
  nombreUsuario = this.jwt.getNombreUsuario();

  /**
   * Inicializa el componente y carga el historial
   * del usuario autenticado.
   */
  ngOnInit(){
    const idUsuario = this.jwt.getIdUsuario();
    if(idUsuario == null) {
      this.toast.mostrar('Error al cargar el historial de usuario', false);
      this.jwt.removerToken();
      this.router.navigate(['login']);
    } else {
      this.cargarHistorial(idUsuario);
    }
  }

  /**
   * Obtiene el historial de búsquedas del usuario.
   *
   * @param idUsuario Identificador del usuario.
   */
  cargarHistorial(idUsuario:number){
    this.historialService.mostrar(idUsuario).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
    })
    ).subscribe({
      next: (response) => {
        if(response.body)
          this.historiales = response.body.reverse();
      }, error: () => {
          this.mensajeError = 'Error al cargar los historiales, intente nuevamente';
          this.historiales = [];
      }
      }
    );
  }

  /**
   * Determina el tipo de búsqueda utilizado
   * por la ruta de navegación.
   *
   * @param tipoBusqueda Tipo de búsqueda almacenado.
   * @returns 1 para búsquedas de aeropuerto, 2 para búsquedas de vuelo.
   */
  definirValor(tipoBusqueda:TipoBusqueda){
    if(tipoBusqueda === 'IATA' || tipoBusqueda === 'ICAO') return 1
    else return 2;
  }

  /**
   * Ejecuta nuevamente una búsqueda almacenada
   * en el historial del usuario.
   *
   * @param historial Registro de historial seleccionado.
   */
  buscar(historial:Historial){
      const valor = this.definirValor(historial.tipoBusqueda,);
      this.router.navigate([`/busqueda/${historial.busqueda}/${valor}`]);
  }

}
