import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Historial} from '../models/historial';

/**
 * Servicio encargado de la gestión del historial
 * de búsquedas de los usuarios.
 *
 * Permite registrar nuevas búsquedas y consultar
 * el historial asociado a un usuario.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  /** Cliente HTTP utilizado para realizar peticiones al backend. */
  private cliente = inject(HttpClient);

  /** URL base del endpoint de auditoría. */
  private readonly urlBase = 'http://localhost:8080/historial';

  /**
   * Registra una nueva búsqueda en el historial del usuario.
   *
   * @param historial Información de la búsqueda realizada.
   * @returns Mensaje de confirmación enviado por el servidor.
   */
  crear(historial:Historial){
    return this.cliente.post(`${this.urlBase}/crear`, historial, {responseType: "text"});
  }

  /**
   * Obtiene el historial de búsquedas de un usuario.
   *
   * @param idUsuario Identificador del usuario.
   * @returns Respuesta HTTP con la lista de búsquedas realizadas.
   */
  mostrar(idUsuario:number){
    return this.cliente.get<Historial[]>(`${this.urlBase}/findbyidusuario/${idUsuario}`, { observe: 'response'});
  }
}
