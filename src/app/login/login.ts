import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {Router} from '@angular/router';
import {Usuario} from '../models/usuario';
import {ToastService} from '../services/toast-service';

/**
 * Componente encargado de autenticar usuarios
 * mediante nombre de usuario y contraseña.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

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
    correo: '',
    contrasenia: '',
  }

  /** Indica si el proceso de autenticación está en curso. */
  cargando = false;

  /**
   * Realiza el proceso de autenticación del usuario.
   * Si las credenciales son válidas, almacena el token
   * y redirige a la página principal.
   */
  login(){
    if(this.cargando) return;
    this.cargando = true;

    this.authService.logIn(this.usuario).subscribe({
      next: (response) => {
        this.cargando = false;
        localStorage.setItem('token', response.token.toString());
        this.toast.mostrar('¡Bienvenido!', true);
        setTimeout(() => this.router.navigate(['/principal']), 2000);
      },
      error: () => {
        this.cargando = false;
        this.toast.mostrar('El nombre de usuario o la contraseña son incorrectos', false);
      }
    });
  }

}
