import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Componente principal encargado de recibir los criterios
 * de búsqueda ingresados por el usuario y redirigir a la
 * página de resultados.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-principal',
  templateUrl: './principal.html',
  styleUrls: ['./principal.css'],
  standalone: false
})
export class Principal {

  /** Servicio de navegación entre rutas. */
  private router = inject(Router);

  /**
   * Redirige al componente de búsqueda utilizando
   * el código y el tipo de búsqueda seleccionados.
   *
   * @param codigo Código IATA o ICAO ingresado.
   * @param valor Tipo de búsqueda seleccionado.
   */
  buscar(codigo:string, valor:string){
    const num = parseInt(valor);
    setTimeout(() => this.router.navigate([`/busqueda/${codigo}/${num}`]), 2000);
  }

}
