import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.html',
  styleUrls: ['./principal.css'],
  standalone: false
})
export class Principal {

  private router = inject(Router);

  buscar(codigo:string, valor:string){
    let num = parseInt(valor);
    setTimeout(() => this.router.navigate(['/busqueda/'+codigo+'/'+num]), 2000);
  }

}
