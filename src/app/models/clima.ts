/**
 * Representa un reporte meteorológico asociado
 * a un aeropuerto identificado por su código ICAO.
 * @autor Juan Martinez
 * @version 1.0
 */
export interface Clima {
  /** Código ICAO del aeropuerto. */
  icaoId: string;

  /** Temperatura del aire en grados Celsius. */
  temp: number;

  /** Punto de rocío en grados Celsius. */
  dewp: number;

  /** Dirección del viento en grados. */
  wdir: string;

  /** Velocidad del viento en nudos. */
  wspd: number;

  /** Visibilidad reportada. */
  visib: string;

  /** Presión atmosférica reportada. */
  altim: number;

  /** Capas de nubosidad observadas. */
  clouds: Nube[];

  /** Fecha y hora de emisión del reporte. */
  reportTime: string;
}

/**
 * Representa una capa de nubosidad
 * presente en un reporte meteorológico.
 * @autor Juan Martinez
 * @version 1.0
 */
export interface Nube {
  /** Tipo o cobertura de la nube. */
  cover: string;

  /** Altitud de la base de la nube en pies. */
  base: number;
}
