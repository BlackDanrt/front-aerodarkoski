import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {Router} from '@angular/router';
import {Usuario} from '../models/usuario';
import {ToastService} from '../services/toast-service';

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

  private toast = inject(ToastService);

  /** Datos del usuario a registrar */
  usuario: Usuario = {
    nombreUsuario: '',
    correo: '',
    contrasenia: '',
  }

  cargando = false;

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
      error: (err) => {
        this.cargando = false;
        this.toast.mostrar('El nombre de usuario o la contraseña son incorrectos', false);
      }
    });
  }

}
