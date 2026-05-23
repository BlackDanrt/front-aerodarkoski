import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Historial} from '../models/historial';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private cliente = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/historial';

  crear(hsitorial:Historial){
    return this.cliente.post(this.urlBase+"/crear", hsitorial, {responseType: "text"});
  }

  mostrar(idUsuario:number){
    return this.cliente.get<Historial[]>(this.urlBase+"/findbyidusuario/"+idUsuario, { observe: 'response'});
  }
}
