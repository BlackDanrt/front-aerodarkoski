import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Avion} from '../models/avion';

@Injectable({
  providedIn: 'root',
})
export class AvionService {

  private  readonly urlBase = 'http://localhost:8080/avion';
  private cliente = inject(HttpClient);

  obtenerTodos(){
    return this.cliente.get<Avion[]>(`${this.urlBase}/mostrar`);
  }

  buscarPorArrIata(iata: string) {
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyiata/${iata}`);
  }

  buscarPorArrIcao(icao: string) {
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyicao/${icao}`);
  }

  buscarPorFlightIata(iata: string){
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyflightiata/${iata}`);
  }

  buscarPorFlightIcao(icao: string){
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyflighticao/${icao}`);
  }
}
