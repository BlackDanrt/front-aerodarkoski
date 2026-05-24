/**
 * Tipos de acciones que pueden ser registradas
 * en el sistema de auditoría.
 * @author Juan Martinez
 * @version 1.0
 */
export enum TipoAccion {

  /** Creación de un recurso o registro. */
  CREATE = 'CREATE',

  /** Eliminación de un recurso o registro. */
  DELETE = 'DELETE',

  /** Modificación de un recurso o registro existente. */
  UPDATE = 'UPDATE',

  /** Consulta o lectura de información. */
  READ = 'READ',

  /** Envío de información o notificaciones. */
  SEND = 'SEND',
}
