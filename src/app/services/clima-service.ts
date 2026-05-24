import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Clima } from '../models/clima';

/**
 * Servicio encargado de consultar y procesar
 * los reportes meteorológicos obtenidos desde el backend.
 *
 * Incluye manejo centralizado de errores HTTP.
 * @author Juan Martinez
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  /** Cliente HTTP utilizado para realizar peticiones al backend. */
  private http = inject(HttpClient);

  /** URL base del endpoint de auditoría. */
  private readonly apiUrl = 'http://localhost:8080';

  /**
   * Obtiene los reportes meteorológicos disponibles.
   *
   * @returns Lista de reportes meteorológicos.
   */
  obtenerReportesClima(): Observable<Clima[]> {
    return this.http.get<Clima[]>(`${this.apiUrl}/clima/mostrar`).pipe(
      map((response) => response || []),
      catchError(this.manejarErrorHttp)
    );
  }

  /**
   * Procesa los errores generados durante las peticiones HTTP.
   *
   * @param error Error recibido desde el servidor o la red.
   * @returns Observable que propaga una excepción con un mensaje descriptivo.
   */
  private manejarErrorHttp(error: HttpErrorResponse): Observable<never> {
    const mensaje = error.error instanceof ErrorEvent
      ? `Error de red: ${error.error.message}`
      : `Error del servidor: ${error.status} - ${error.message}`;

    console.error('ClimaService - Error:', mensaje);
    return throwError(() => new Error(mensaje));
  }
}
