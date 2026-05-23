import {Component, inject} from '@angular/core';
import {JwtService} from '../services/jwt-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private jwt = inject(JwtService);
  private router = inject(Router);

  isAutenticado() {
    return this.jwt.getToken() !== null;
  }

  cerrarSesion() {
    this.jwt.removerToken();
    this.router.navigate(['login']);
  }

  isAdministrador(){
    return this.jwt.administrador === 'ADMINISTRADOR';
  }

  navegarAHistorial(){
    const idUsuario = this.jwt.getIdUsuario();
    this.router.navigate([`/historial/${idUsuario}`]);
  }
}
