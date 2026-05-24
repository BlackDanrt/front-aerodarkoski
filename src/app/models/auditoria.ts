import {Rol} from '../enums/rol';
import {TipoAccion} from '../enums/tipo-accion';
import {Servicio} from '../enums/servicio';
/**
 * Representa un registro de auditoría generado
 * por una acción realizada dentro del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
export interface Auditoria {

  /** Identificador único del registro de auditoría. */
  id: number;

  /** Identificador del usuario que realizó la acción. */
  idUsuario: number | null;

  /** Nombre del usuario que realizó la acción. */
  nombreUsuario: string | null;

  /** Tipo de acción ejecutada. */
  accion: TipoAccion;

  /** Rol del usuario que realizó la acción. */
  rolUsuario: Rol;

  /** Servicio o módulo sobre el que se realizó la acción. */
  servicioUsado: Servicio;

  /** Fecha y hora en que se registró el evento. */
  fecha: string;
}
