import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<{mensaje: string, exito: boolean}>();
  toast$ = this.toastSubject.asObservable();

  mostrar(mensaje: string, exito: boolean) {
    this.toastSubject.next({ mensaje, exito });
  }
}
