import {TipoBusqueda} from '../enums/tipo-busqueda';

export interface Historial {
  id?: number;
  idUsuario: number;
  busqueda: string;
  tipoBusqueda: TipoBusqueda;
}
