import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UsuarioService } from '../services/usuario-service';
import { Usuario } from '../models/usuario';
import { JwtService } from '../services/jwt-service';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import {ToastService} from '../services/toast-service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private cdr = inject(ChangeDetectorRef);
  private usuarioService = inject(UsuarioService);
  private jwt = inject(JwtService);
  private router = inject(Router);
  private toast = inject(ToastService);

  usuario: Usuario = {
    id: undefined,
    nombreUsuario: '',
    contrasenia: ''
  };

  confirmarContrasenia = '';

  mensajeError = '';
  errorCarga = false;
  cargando = true;
  guardando = false;

  ngOnInit() {
    this.cargarDatos();
  }

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

    if(this.usuario.id === null) return;

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
        if (respuesta?.token) {
          this.jwt.setToken(respuesta.token);
        }

        this.toast.mostrar('Cambios guardados correctamente', true);
      },
      error: (err) => {
        if (err.status === 403) {
          this.toast.mostrar('Sesión expirada. Inicie sesión nuevamente', false);
          this.jwt.removerToken();
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.toast.mostrar('Error al guardar los cambios', false);
        }
      }
    });
  }

  cancelar() {
    this.router.navigate(['/principal']);
  }
}
