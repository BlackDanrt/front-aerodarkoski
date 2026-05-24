import { ChangeDetectorRef, Component, inject} from '@angular/core';
import {JwtService} from '../services/jwt-service';
import {Router} from '@angular/router';

/**
 * Componente encargado de gestionar la barra de navegación
 * de la aplicación, incluyendo la autenticación, el acceso
 * al historial y el menú responsive.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  /** Servicio para forzar la detección manual de cambios. */
  private cdr = inject(ChangeDetectorRef);

  /** Servicio para gestionar la información del JWT. */
  private jwt = inject(JwtService);

  /** Servicio de navegación entre rutas. */
  private router = inject(Router);

  /** Indica si el menú de navegación se encuentra desplegado. */
  menuAbierto = false;

  /**
   * Alterna el estado de visibilidad del menú.
   */
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  /**
   * Cierra el menú de navegación.
   */

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  /**
   * Verifica si existe una sesión activa.
   *
   * @returns true si el usuario está autenticado.
   */
  isAutenticado() {
    return this.jwt.getToken() !== null;
  }

  /**
   * Finaliza la sesión del usuario actual
   * y redirige a la página de inicio de sesión.
   */
  cerrarSesion() {
    this.jwt.removerToken();
    this.router.navigate(['login']);
  }

  /**
   * Verifica si el usuario autenticado
   * posee privilegios de administrador.
   *
   * @returns true si el usuario es administrador.
   */
  isAdministrador(){
    return this.jwt.getRolUsuario() === 'ADMINISTRADOR';
  }

  /**
   * Navega hacia la página de historial
   * del usuario autenticado.
   */
  navegarAHistorial(){
    const idUsuario = this.jwt.getIdUsuario();
    this.router.navigate([`/historial/${idUsuario}`]);
  }

  /**
   * Fuerza la actualización de la vista
   * para reflejar cambios en la sesión.
   */
  verificarSesion(){
    this.cdr.detectChanges();
  }
}
