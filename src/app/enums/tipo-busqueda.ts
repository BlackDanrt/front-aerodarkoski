/**
 * Tipos de búsqueda disponibles para consultar
 * información de vuelos y aeropuertos.
 * @author Juan Martinez
 * @version 1.0
 */
export enum TipoBusqueda {

  /** Búsqueda mediante el código ICAO de un aeropuerto. */
  ICAO = 'ICAO',

  /** Búsqueda mediante el código IATA de un aeropuerto. */
  IATA = 'IATA',

  /** Búsqueda mediante el código ICAO de un vuelo. */
  FLIGHT_ICAO = 'FLIGHT_ICAO',

  /** Búsqueda mediante el código IATA de un vuelo. */
  FLIGHT_IATA = 'FLIGHT_IATA',
}
