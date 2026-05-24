import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UsuarioService } from '../services/usuario-service';
import { Usuario } from '../models/usuario';
import { JwtService } from '../services/jwt-service';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import {ToastService} from '../services/toast-service';

/**
 * Componente encargado de visualizar y actualizar
 * la información del perfil del usuario autenticado.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  /** Servicio para forzar la detección manual de cambios. */
  private cdr = inject(ChangeDetectorRef);

  /** Servicio para la gestión de usuarios. */
  private usuarioService = inject(UsuarioService);

  /** Servicio para acceder a la información del JWT. */
  private jwt = inject(JwtService);

  /** Servicio de navegación entre rutas. */
  private router = inject(Router);

  /** Servicio para mostrar notificaciones al usuario. */
  private toast = inject(ToastService);

  /** Información del usuario autenticado. */
  usuario: Usuario = {
    id: undefined,
    nombreUsuario: '',
    contrasenia: ''
  };

  /** Confirmación de contraseña ingresada por el usuario. */
  confirmarContrasenia = '';

  /** Mensaje de error mostrado en pantalla. */
  mensajeError = '';

  /** Indica si ocurrió un error durante la carga. */
  errorCarga = false;

  /** Indica si los datos se encuentran cargando. */
  cargando = true;

  /** Indica si se está realizando una actualización. */
  guardando = false;

  /**
   * Inicializa el componente cargando los datos
   * del usuario autenticado.
   */
  ngOnInit() {
    this.cargarDatos();
  }

  /**
   * Obtiene la información del usuario autenticado
   * desde el servidor.
   */
  cargarDatos() {
    const idUsuario = this.jwt.getIdUsuario();

    if (!idUsuario) {
      this.mensajeError = 'No se encontró sesión activa o el token expiró';
      this.cargando = false;
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }

    this.usuarioService.getById(idUsuario).pipe(
      timeout(10000),
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (usuario) => {
        if (!usuario) {
          this.mensajeError = 'No se encontró el usuario';
          return;
        }
        this.usuario = {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario ?? '',
          correo: usuario.correo ?? '',
          rol: usuario.rol,
          contrasenia: ''
        };
      },
      error: (err) => {
        if (err.status === 403) {
          this.mensajeError = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
          this.jwt.removerToken();
        } else {
          this.mensajeError = 'Error al cargar el perfil. Intente nuevamente.';
        }
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }

  /**
   * Valida y guarda los cambios realizados
   * en el perfil del usuario.
   */
  guardarCambios() {
    const hayContrasenia = this.usuario.contrasenia && this.usuario.contrasenia.length > 0;
    const hayConfirmacion = this.confirmarContrasenia && this.confirmarContrasenia.length > 0;

    if (hayContrasenia || hayConfirmacion) {
      if (this.usuario.contrasenia !== this.confirmarContrasenia) {
        this.toast.mostrar('Las contraseñas no coinciden', false);
        return;
      }
      if (this.usuario.contrasenia.length < 8) {
        this.toast.mostrar('La contraseña debe tener al menos 8 caracteres', false);
        return;
      }
    }

    this.guardando = true;

    const payload: Usuario = {
      id: this.usuario.id,
      nombreUsuario: this.usuario.nombreUsuario,
      correo: this.usuario.correo
    };

    if (hayContrasenia) payload.contrasenia = this.usuario.contrasenia;

    if(!this.usuario.id) return;

    this.usuarioService.actualizar(payload as Usuario, this.usuario.id).pipe(
      finalize(() => {
        this.guardando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (respuesta) => {
        this.usuario.contrasenia = '';
        this.confirmarContrasenia = '';

        // Guardar nuevo token
        if (respuesta.trim()) {
          this.jwt.setToken(respuesta.trim());
        }

        this.toast.mostrar('Cambios guardados correctamente', true);
      },
      error: (err) => {
        if (err.status === 403) {
          this.toast.mostrar('Sesión expirada. Inicie sesión nuevamente', false);
          localStorage.removeItem('token');
          setTimeout(() => this.router.navigate(['/login']), 2000);

        } else {
          this.toast.mostrar('Error al guardar los cambios', false);
        }
      }
    });
  }

  /**
   * Cancela la edición del perfil y regresa
   * a la página principal.
   */
  cancelar() {
    this.router.navigate(['/principal']);
  }
}
