import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Avion} from '../models/avion';

/**
 * Servicio encargado de consultar información
 * de aeronaves a través de la API del sistema.
 *
 * Permite obtener vuelos en tiempo real y realizar
 * búsquedas por códigos IATA e ICAO.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class AvionService {
  /** Cliente HTTP utilizado para realizar peticiones al backend. */
  private cliente = inject(HttpClient);

  /** URL base del endpoint de auditoría. */
  private  readonly urlBase = 'http://localhost:8080/avion';

  /**
   * Obtiene la lista de aeronaves disponibles.
   *
   * @returns Lista de aeronaves.
   */
  obtenerTodos(){
    return this.cliente.get<Avion[]>(`${this.urlBase}/mostrar`);
  }

  /**
   * Busca aeronaves por código IATA de destino.
   *
   * @param iata Código IATA del aeropuerto.
   * @returns Lista de aeronaves encontradas.
   */
  buscarPorArrIata(iata: string) {
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyiata/${iata}`);
  }

  /**
   * Busca aeronaves por código ICAO de destino.
   *
   * @param icao Código ICAO del aeropuerto.
   * @returns Lista de aeronaves encontradas.
   */
  buscarPorArrIcao(icao: string) {
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyicao/${icao}`);
  }

  /**
   * Busca aeronaves por código IATA del vuelo.
   *
   * @param iata Código IATA del vuelo.
   * @returns Lista de aeronaves encontradas.
   */
  buscarPorFlightIata(iata: string){
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyflightiata/${iata}`);
  }

  /**
   * Busca aeronaves por código ICAO del vuelo.
   *
   * @param icao Código ICAO del vuelo.
   * @returns Lista de aeronaves encontradas.
   */
  buscarPorFlightIcao(icao: string){
    return this.cliente.get<Avion[]>(`${this.urlBase}/findbyflighticao/${icao}`);
  }
}
