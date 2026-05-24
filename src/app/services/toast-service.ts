import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

/**
 * Servicio encargado de la gestión centralizada
 * de notificaciones tipo Toast.
 *
 * Permite emitir mensajes de éxito o error para
 * ser mostrados en la interfaz de usuario.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Subject utilizado para emitir eventos de notificación.
   */
  private toastSubject = new Subject<{mensaje: string, exito: boolean}>();

  /**
   * Observable público utilizado por los componentes
   * para suscribirse a las notificaciones.
   */
  toast$ = this.toastSubject.asObservable();

  /**
   * Emite una nueva notificación para ser mostrada
   * al usuario.
   *
   * @param mensaje Texto de la notificación.
   * @param exito Indica si la notificación representa
   * una operación exitosa o un error.
   */
  mostrar(mensaje: string, exito: boolean) {
    this.toastSubject.next({ mensaje, exito });
  }
}
