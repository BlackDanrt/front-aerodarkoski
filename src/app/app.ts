import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { Toast} from 'bootstrap';
import {ToastService} from './services/toast-service';

/**
 * Componente raíz de la aplicación.
 *
 * Se encarga de inicializar la interfaz principal
 * y gestionar la visualización global de notificaciones
 * mediante mensajes tipo Toast.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  /** Título principal de la aplicación. */
  protected readonly title = signal('AeroDarkoski');

  /** Servicio para forzar la detección manual de cambios. */
  private cdr = inject(ChangeDetectorRef);

  /** Servicio para la gestión de notificaciones Toast. */
  private toastService = inject(ToastService);

  /** Mensaje mostrado en la notificación. */
  mensajeToast = '';

  /** Indica si la notificación representa una operación exitosa. */
  toastExito = true;

  /**
   * Inicializa la suscripción al servicio de notificaciones
   * para mostrar mensajes Toast en la interfaz.
   */
  ngOnInit() {
    this.toastService.toast$.subscribe(({ mensaje, exito }) => {
      this.mostrarToast(mensaje, exito);
    });
  }

  /**
   * Muestra una notificación Toast con el mensaje indicado.
   *
   * @param mensaje Texto que se mostrará al usuario.
   * @param exito Indica si la notificación es de éxito o error.
   */
  private mostrarToast(mensaje: string, exito: boolean):void {
    this.mensajeToast = mensaje;
    this.toastExito = exito;
    this.cdr.detectChanges();

    if(!document.getElementById('miToast')) return;
    const toastEl = document.getElementById('miToast');

    if(!toastEl) return;

    const instanciaAnterior = Toast.getInstance(toastEl);
    if (instanciaAnterior) {
      instanciaAnterior.dispose();
    }

    new Toast(toastEl, {
      delay: 3000,
      autohide: true,
    }).show();
  }
}
