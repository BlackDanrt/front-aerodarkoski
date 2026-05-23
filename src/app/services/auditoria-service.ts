import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Auditoria} from '../models/auditoria';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private cliente = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/auditoria/mostrar';

  mostrar(){
      return this.cliente.get<{auditorias:Auditoria[]}>(this.urlBase, { observe: 'response'} );
  }
}
