import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as bootstrap from 'bootstrap';
import {ToastService} from './services/toast-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyectofinal');
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  mensajeToast = '';
  toastExito = true;

  ngOnInit() {
    this.toastService.toast$.subscribe(({ mensaje, exito }) => {
      this.mostrarToast(mensaje, exito);
    });
  }

  private mostrarToast(mensaje: string, exito: boolean) {
    this.mensajeToast = mensaje;
    this.toastExito = exito;
    this.cdr.detectChanges();

    const toastEl = document.getElementById('miToast')!;
    const instanciaAnterior = bootstrap.Toast.getInstance(toastEl);
    if (instanciaAnterior) instanciaAnterior.dispose();

    new bootstrap.Toast(toastEl, { delay: 3000, autohide: true }).show();
  }
}
