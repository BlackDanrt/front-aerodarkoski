import { Rol } from '../enums/rol';

/**
 * Información contenida en el token JWT
 * utilizado para la autenticación y autorización
 * de los usuarios del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
export interface TokenJwt {
  /** Identificador único del usuario. */
  id: number;

  /** Nombre de usuario (subject del token). */
  sub: string;

  /** Rol asignado al usuario autenticado. */
  role: Rol;
}
