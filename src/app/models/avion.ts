export interface AircraftDTO {
  regNumber: string;
  icaoCode: string;
  icao24: string;
}

export interface AirlineDTO {
  name: string;
  iataCode: string;
  icaoCode: string;
}

export interface ArrivalDTO {
  iataCode: string;
  icaoCode: string;
}

export interface DepartureDTO {
  iataCode: string;
  icaoCode: string;
}

export interface FlightDTO {
  iataNumber: string;
  icaoNumber: string;
  number: string;
}

export interface GeographyDTO {
  latitude: number;
  longitude: number;
  altitude: number;
  direction: number;
}

export interface SpeedDTO {
  horizontal: number;
  vertical: number;
  isGround: number;
}

export interface Avion {
  aircraft: AircraftDTO;
  airline: AirlineDTO;
  arrival: ArrivalDTO;
  departure: DepartureDTO;
  flight: FlightDTO;
  geography: GeographyDTO;
  speed: SpeedDTO;
  status: string;
}
