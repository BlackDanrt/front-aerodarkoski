import { Injectable } from '@angular/core';
import { Rol } from '../enums/rol';
import { TokenJwt } from '../models/token-jwt';

/**
 * Servicio encargado del manejo del JWT.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  /**
   * Obtiene el token JWT almacenado en localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Guarda el token JWT en localStorage
   * @param token El token JWT a almacenar
   */
  setToken(token: string): void {
    if (token?.trim()) {
      localStorage.setItem('token', token.trim());
    }
  }

  /**
   * Elimina el token JWT de localStorage
   */
  removerToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Decodifica un token JWT (sin verificar firma)
   * @param token El token JWT a decodificar
   */
  decodificarToken(token: string): TokenJwt | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );

      return JSON.parse(jsonPayload) as TokenJwt;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene el ID del usuario desde el token JWT
   * Busca en múltiples propiedades comunes: id, idUsuario, sub
   */
  getIdUsuario(): number | null {
    const token = this.getToken();
    if (!token) return null;

    return this.decodificarToken(token)?.id ?? null;
  }


  /**
   * Obtiene el rol del usuario desde el token JWT
   */
  getRolUsuario(): Rol | null {
    const token = this.getToken();
    if (!token) return null;

    return this.decodificarToken(token)?.role ?? null;
  }

  /**
   * Obtiene el nombre de usuario (subject) del token
   */
  getNombreUsuario(): string | null {
    const token = this.getToken();
    if (!token) return null;

    return this.decodificarToken(token)?.sub ?? null;
  }
}
