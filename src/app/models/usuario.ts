import {Rol} from '../enums/rol';

export interface Usuario {
  id?: number;
  nombreUsuario: string;
  correo?: string;
  contrasenia?: string;
  rol?: Rol;
}
