import {Rol} from '../enums/rol';

/**
 * Representa la información de un usuario
 * dentro del sistema.
 */
export interface Usuario {
  /** Identificador único del usuario. */
  id?: number;

  /** Nombre de usuario utilizado para la autenticación. */
  nombreUsuario: string;

  /** Dirección de correo electrónico del usuario. */
  correo?: string;

  /** Contraseña asociada a la cuenta. */
  contrasenia?: string;

  /** Rol asignado al usuario. */
  rol?: Rol;
}
