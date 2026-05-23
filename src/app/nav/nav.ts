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
    if(this.jwt.getToken()) return true;
    else return false;
  }

  cerrarSesion() {
    this.jwt.removerToken();
  this.router.navigate(['login']);
  }

  isAdministrador(){
    if(this.jwt.getRolUsuario() == 'ADMINISTRADOR') return true;
    else return false;
  }

  navegarAHistorial(){
    let idUsuario = this.jwt.getIdUsuario();
    this.router.navigate(['/historial/'+idUsuario]);
  }
}
