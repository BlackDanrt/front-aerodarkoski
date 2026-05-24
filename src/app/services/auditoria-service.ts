import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Auditoria} from '../models/auditoria';

/**
 * Servicio encargado de la consulta de registros
 * de auditoría desde el backend.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  /** Cliente HTTP utilizado para realizar peticiones al backend. */
  private cliente = inject(HttpClient);

  /** URL base del endpoint de auditoría. */
  private readonly urlBase = 'http://localhost:8080/auditoria/mostrar';

  /**
   * Obtiene la lista completa de auditorías registradas.
   *
   * @returns Respuesta HTTP con los registros de auditoría.
   */
  mostrar(){
      return this.cliente.get<Auditoria[]>(this.urlBase, { observe: 'response'} );
  }
}
