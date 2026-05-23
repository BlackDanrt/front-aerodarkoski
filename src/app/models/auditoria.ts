import {Rol} from '../enums/rol';
import {TipoAccion} from '../enums/tipo-accion';
import {Servicio} from '../enums/servicio';

export interface Auditoria {
    id:number;
    idUsuario:number | null;
    nombreUsuario: string | null;
    accion: TipoAccion;
    rolUsuario: Rol;
    servicioUsado: Servicio;
    fecha: string;
}
