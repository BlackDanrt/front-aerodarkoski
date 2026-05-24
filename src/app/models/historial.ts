import {TipoBusqueda} from '../enums/tipo-busqueda';

/**
 * Representa un registro de búsqueda realizado
 * por un usuario dentro del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
export interface Historial {
  /** Identificador único del registro de historial. */
  id?: number;

  /** Identificador del usuario que realizó la búsqueda. */
  idUsuario: number;

  /** Código o valor utilizado en la búsqueda. */
  busqueda: string;

  /** Tipo de búsqueda realizada. */
  tipoBusqueda: TipoBusqueda;
}
