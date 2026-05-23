import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Rol } from '../enums/rol';
import { jwtDecode } from 'jwt-decode';
import { TokenJwt } from '../models/token-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cliente = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/auth';

  registrar(usuario: Usuario) {
    return this.cliente.post(`${this.urlBase}/register`, usuario, { responseType: 'text' });
  }

  logIn(usuario: Usuario) {
    return this.cliente.post<{ token: string }>(`${this.urlBase}/login`, usuario);
  }

  getUsuarioToken(): TokenJwt | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return jwtDecode<TokenJwt>(token);
  }

  getIdUsuario(): number | null {
    const token = this.getUsuarioToken();
    return token?.id ?? null;
  }

  getRolUsuario(): Rol | null {
    const token = this.getUsuarioToken();
    return token?.role ?? null;
  }
}
