/**
 * Información de identificación de una aeronave.
 * @autor Juan Martinez
 * @author 1.0
 */
export interface AircraftDTO {
  /** Matrícula o registro de la aeronave. */
  regNumber: string;

  /** Código ICAO de la aeronave. */
  icaoCode: string;

  /** Identificador ICAO24 único de la aeronave. */
  icao24: string;
}

/**
 * Información de la aerolínea operadora.
 * @author Juan Martinez
 * @version 1.0
 */
export interface AirlineDTO {
  /** Nombre de la aerolínea. */
  name: string;

  /** Código IATA de la aerolínea. */
  iataCode: string;

  /** Código ICAO de la aerolínea. */
  icaoCode: string;
}

/**
 * Información del aeropuerto de llegada.
 * @author Juan Martinez
 * @version 1.0
 */
export interface ArrivalDTO {
  /** Código IATA del aeropuerto. */
  iataCode: string;

  /** Código ICAO del aeropuerto. */
  icaoCode: string;
}

/**
 * Información del aeropuerto de salida.
 * @author Juan Martinez
 * @version 1.0
 */
export interface DepartureDTO {
  /** Código IATA del aeropuerto. */
  iataCode: string;

  /** Código ICAO del aeropuerto. */
  icaoCode: string;
}

/**
 * Información identificativa del vuelo.
 * @author Juan Martinez
 * @version 1.0
 */
export interface FlightDTO {
  /** Código IATA del vuelo. */
  iataNumber: string;

  /** Código ICAO del vuelo. */
  icaoNumber: string;

  /** Número comercial del vuelo. */
  number: string;
}

/**
 * Información geográfica de la aeronave.
 * @author Juan Martinez
 * @version 1.0
 */
export interface GeographyDTO {
  /** Latitud actual. */
  latitude: number;

  /** Longitud actual. */
  longitude: number;

  /** Altitud en pies. */
  altitude: number;

  /** Rumbo o dirección en grados. */
  direction: number;
}

/**
 * Información de velocidad de la aeronave.
 * @author Juan Martinez
 * @version 1.0
 */
export interface SpeedDTO {
  /** Velocidad horizontal en nudos. */
  horizontal: number;

  /** Velocidad vertical. */
  vertical: number;

  /** Indica si la aeronave se encuentra en tierra. */
  isGround: number;
}

/**
 * Modelo principal que representa la información
 * de una aeronave obtenida desde el servicio de seguimiento.
 * @author Juan Martinez
 * @version 1.0
 */
export interface Avion {
  /** Datos de identificación de la aeronave. */
  aircraft: AircraftDTO;

  /** Información de la aerolínea. */
  airline: AirlineDTO;

  /** Información del aeropuerto de llegada. */
  arrival: ArrivalDTO;

  /** Información del aeropuerto de salida. */
  departure: DepartureDTO;

  /** Información identificativa del vuelo. */
  flight: FlightDTO;

  /** Posición geográfica actual. */
  geography: GeographyDTO;

  /** Información de velocidad. */
  speed: SpeedDTO;

  /** Estado actual del vuelo. */
  status: string;
}
