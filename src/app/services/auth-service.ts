import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Rol } from '../enums/rol';
import { jwtDecode } from 'jwt-decode';
import { TokenJwt } from '../models/token-jwt';

/**
 * Servicio encargado de la autenticación de usuarios.
 *
 * Proporciona métodos para registrar usuarios,
 * iniciar sesión y obtener la información del
 * usuario almacenada en el token JWT.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Cliente HTTP utilizado para realizar peticiones al backend. */
  private cliente = inject(HttpClient);

  /** URL base del endpoint de auditoría. */
  private readonly urlBase = 'http://localhost:8080/auth';

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @param usuario Datos del usuario a registrar.
   * @returns Respuesta del servidor con el resultado del registro.
   */
  registrar(usuario: Usuario) {
    return this.cliente.post(`${this.urlBase}/register`, usuario, { responseType: 'text' });
  }

  /**
   * Autentica un usuario y obtiene un token JWT.
   *
   * @param usuario Credenciales del usuario.
   * @returns Token JWT generado por el servidor.
   */
  logIn(usuario: Usuario) {
    return this.cliente.post<{ token: string }>(`${this.urlBase}/login`, usuario);
  }

  /**
   * Obtiene y decodifica el token JWT almacenado.
   *
   * @returns Información contenida en el token o null
   * si no existe una sesión activa.
   */
  getUsuarioToken(): TokenJwt | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return jwtDecode<TokenJwt>(token);
  }

  /**
   * Obtiene el identificador del usuario autenticado.
   *
   * @returns ID del usuario o null si no existe sesión.
   */
  getIdUsuario(): number | null {
    const token = this.getUsuarioToken();
    return token?.id ?? null;
  }

  /**
   * Obtiene el rol del usuario autenticado.
   *
   * @returns Rol del usuario o null si no existe sesión.
   */
  getRolUsuario(): Rol | null {
    const token = this.getUsuarioToken();
    return token?.role ?? null;
  }
}
