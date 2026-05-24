/**
 * Roles disponibles dentro del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
export enum Rol {

  /** Usuario estándar con acceso básico. */
  USUARIO = 'USUARIO',

  /** Usuario con permisos administrativos. */
  ADMINISTRADOR = 'ADMINISTRADOR',

  /** Estado utilizado cuando no existe una sesión autenticada. */
  SIN_AUTENTICAR = 'SIN_AUTENTICAR',
}
