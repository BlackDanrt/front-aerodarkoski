import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../models/usuario';
import {map} from 'rxjs';

/**
 * Servicio encargado de la gestión de usuarios.
 *
 * Permite crear, actualizar, eliminar, consultar
 * y contabilizar usuarios registrados en el sistema.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  /** Cliente HTTP utilizado para realizar peticiones al backend. */
  private cliente = inject(HttpClient);

  /** URL base del endpoint de auditoría. */
  private  readonly urlBase = 'http://localhost:8080/usuario';

  /**
   * Crea un nuevo usuario en el sistema.
   *
   * @param usuario Información del usuario a registrar.
   * @returns Mensaje de confirmación enviado por el servidor.
   */
  crear(usuario: Usuario){
    return this.cliente.post(`${this.urlBase}/crear`, usuario, {responseType: "text"});
  }

  /**
   * Actualiza la información de un usuario existente.
   *
   * @param usuario Nuevos datos del usuario.
   * @param idUsuario Identificador del usuario a actualizar.
   * @returns Mensaje de confirmación enviado por el servidor.
   */
  actualizar(usuario: Usuario, idUsuario: number){
    return this.cliente.put(`${this.urlBase}/actualizar/${idUsuario}`, usuario, {responseType: "text"});
  }

  /**
   * Elimina un usuario del sistema.
   *
   * @param idUsuario Identificador del usuario.
   * @returns Mensaje de confirmación enviado por el servidor.
   */
  eliminar(idUsuario: number){
    return this.cliente.delete(`${this.urlBase}/eliminar/${idUsuario}`, {responseType: "text"});
  }

  /**
   * Obtiene la lista completa de usuarios.
   *
   * @returns Respuesta HTTP con la lista de usuarios.
   */
  mostrar() {
    return this.cliente.get<Usuario[]>(`${this.urlBase}/mostrar`, { observe: 'response'});
  }

  /**
   * Obtiene la información de un usuario a partir de su identificador.
   *
   * @param idUsuario Identificador del usuario.
   * @returns Información del usuario o null si no existe contenido.
   */
  getById(idUsuario: number) {
    return this.cliente.get<Usuario>(`${this.urlBase}/getbyid/${idUsuario}`, { observe: 'response' })
  .pipe(map(response => response.body));
  }

  /**
   * Obtiene la cantidad total de usuarios registrados.
   *
   * @returns Respuesta HTTP con el número total de usuarios.
   */
  contar(){
    return this.cliente.get<{cantidad:number}>(`${this.urlBase}/contar`, { observe: 'response'});
  }
}
