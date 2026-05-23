import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {HistorialService} from '../services/historial-service';
import {Historial} from '../models/historial';
import {JwtService} from '../services/jwt-service';
import {ToastService} from '../services/toast-service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';
import {TipoBusqueda} from '../enums/tipo-busqueda';

@Component({
  selector: 'app-historial-component',
  standalone: false,
  templateUrl: './historial-component.html',
  styleUrl: './historial-component.css',
})
export class HistorialComponent {
  private historialService = inject(HistorialService);
  private jwt = inject(JwtService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef)

  historiales: Historial[] = [];

  /** Indica si los datos están cargando */
  cargando = true;

  /** Mensaje de error mostrado en pantalla */
  mensajeError = '';

  nombreUsuario = this.jwt.getNombreUsuario();


  ngOnInit(){
    let idUsuario = this.jwt.getIdUsuario();
    if(idUsuario == null) {
      this.toast.mostrar('Error al cargar el historial de usuario', false);
      this.jwt.removerToken();
      this.router.navigate(['login']);
    } else {
      this.cargarHistorial(idUsuario);
    }
  }

  cargarHistorial(idUsuario:number){
    this.historialService.mostrar(idUsuario).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
    })
    ).subscribe({
      next: (response: any) => {
          this.historiales = response.body.reverse();
      }, error: (error: any) => {
          this.mensajeError = 'Error al cargar los historiales, intente nuevamente';
          this.historiales = [];
      }
      }
    );
  }

  definirValor(tipoBusqueda:TipoBusqueda){
    if(tipoBusqueda == 'IATA' || tipoBusqueda == 'ICAO') return 1
    else return 2;
  }

  buscar(historial:Historial){
      let valor = this.definirValor(historial.tipoBusqueda,);
      this.router.navigate(['/busqueda/'+historial.busqueda+'/'+valor]);
  }

}
