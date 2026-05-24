/**
 * Servicios disponibles para registrar operaciones
 * y auditorías dentro del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
export enum Servicio {

  /** Operaciones relacionadas con la gestión de aviones. */
  AVION = 'AVION',

  /** Operaciones relacionadas con la consulta del clima. */
  CLIMA = 'CLIMA',

  /** Operaciones relacionadas con el envío de correos electrónicos. */
  CORREO = 'CORREO',

  /** Operaciones relacionadas con el historial de búsquedas. */
  HISTORIAL = 'HISTORIAL',

  /** Operaciones relacionadas con la administración de usuarios. */
  USUARIO = 'USUARIO',
}
