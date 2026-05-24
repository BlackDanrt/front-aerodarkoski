import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {Usuario} from '../models/usuario';
import {AuthService} from '../services/auth-service';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast-service';

/**
 * Componente encargado del registro de nuevos usuarios
 * dentro del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  /** Servicio de autenticación */
  public authService = inject(AuthService);

  /** Servicio para forzar la detección manual de cambios */
  public cdr = inject(ChangeDetectorRef);

  /** Servicio de navegación entre rutas */
  private router = inject(Router);

  /** Servicio para mostrar notificaciones al usuario. */
  private toast = inject(ToastService);

  /** Datos del usuario a registrar */
  usuario: Usuario = {
    nombreUsuario: '',
    contrasenia: '',
  }

  /** Confirmación del correo electrónico. */
  confirmarCorreo = '';

  /** Confirmación de la contraseña. */
  confirmarContrasenia = '';

  /** Indica si el proceso de registro está en ejecución. */
  cargando = false;

  /**
   * Valida la información ingresada y realiza
   * el registro de un nuevo usuario.
   */
  registrarse() {
    if(this.cargando) return;
    else this.cargando = true;

    if(this.usuario.contrasenia !== this.confirmarContrasenia) {
      this.cargando = false;
      this.toast.mostrar('Las contraseñas no coinciden', false)
      return;
    }
    if(this.usuario.correo !== this.confirmarCorreo) {
      this.cargando = false;
      this.toast.mostrar('Las direcciones de corrreo no coinciden', false)
      return;
    }
    if(this.usuario.contrasenia.length < 8) {
      this.cargando = false;
      this.toast.mostrar('La contraseña debe tener al menos 8 caracteres', false)
      return;
    }
      this.authService.registrar(this.usuario).subscribe({
        next: (response) => {
          this.cargando = false
          this.toast.mostrar(response, true);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          let mensaje: string;
          if (err.error instanceof ProgressEvent || typeof err.error !== 'string') {
            mensaje = 'Error interno del servidor';
          } else {
            mensaje = err.error;
          }
          this.cargando = false
          this.toast.mostrar(mensaje, false);
        }
      });
  }

}
