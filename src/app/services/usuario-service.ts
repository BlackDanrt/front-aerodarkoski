import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../models/usuario';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private cliente = inject(HttpClient);
  private  readonly urlBase = 'http://localhost:8080/usuario';

  crear(usuario: Usuario){
    return this.cliente.post(this.urlBase+"/crear", usuario, {responseType: "text"});
  }

  actualizar(usuario: Usuario, idUsuario: number){
    return this.cliente.put<{token:string}>(this.urlBase+"/actualizar/"+idUsuario, usuario);
  }

  eliminar(idUsuario: number){
    return this.cliente.delete(this.urlBase+"/eliminar/"+idUsuario, {responseType: "text"});
  }

  mostrar() {
    return this.cliente.get<{usuarios:Usuario[]}>(this.urlBase+"/mostrar", { observe: 'response'});
  }

  getById(idUsuario: number) {
    return this.cliente.get<Usuario>( this.urlBase + "/getbyid/" + idUsuario, { observe: 'response' })
  .pipe(map(response => response.body));
  }

  contar(){
    return this.cliente.get<{cantidad:number}>(this.urlBase+"/contar", { observe: 'response'});
  }
}
