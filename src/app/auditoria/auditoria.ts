import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, Subject} from 'rxjs';
import {AuditoriaService} from '../services/auditoria-service';
import {Auditoria} from '../models/auditoria';
import {HistorialService} from '../services/historial-service';

/**
 * Componente encargado de visualizar y filtrar
 * los registros de auditoría del sistema.
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-auditoria-component',
  standalone: false,
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class AuditoriaComponent implements OnInit {

  /** Servicio para la gestión de auditorías */
  private auditoriaService = inject(AuditoriaService);

  /** Servicio para la gestión de historiales */
  private historialService = inject(HistorialService);

  /** Servicio para forzar la detección de cambios */
  private cdr = inject(ChangeDetectorRef);

  /** Lista completa de auditorías */
  auditorias: Auditoria[] = [];

  /** Lista de auditorías filtradas */
  auditoriasFiltradasCache: Auditoria[] = [];

  /** Indica si los datos están cargando */
  cargando = true;

  /** Mensaje de error mostrado en pantalla */
  mensajeError = '';

  /** Mensaje de éxito mostrado en pantalla */
  mensajeExito = '';

  /** Texto utilizado para filtrar auditorías */
  filtroTexto = '';

  /** Subject utilizado para aplicar debounce al filtro */
  private filtroSubject = new Subject<string>();

  /**
   * Inicializa el componente y configura el filtro con debounce.
   */
  ngOnInit(): void {
    this.filtroSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.aplicarFiltro();
      this.cdr.detectChanges();
    });

    this.cargarAuditorias();
  }

  /**
   * Carga la lista de auditorías desde el servidor.
   */
  cargarAuditorias(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    this.auditoriaService.mostrar().pipe(
      finalize(() => {
        this.cargando = false;
        this.aplicarFiltro();
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        let lista: Auditoria[] = [];

        if (response.body) {
          lista = response.body.reverse();
        }
        this.auditorias = lista;
      },
      error: () => {
        this.mensajeError = 'Error al cargar las auditorías. Intente nuevamente.';
        this.auditorias = [];
      }
    });
  }

  /**
   * Retorna el identificador de una auditoría para optimizar el renderizado.
   *
   * @param index Índice del elemento en la lista.
   * @param auditoria Auditoría actual.
   * @returns ID de la auditoría o el índice si no existe.
   */
  trackByAuditoria(index: number, auditoria: Auditoria): number {
    return auditoria.id ?? index;
  }

  /**
   * Actualiza el valor del filtro y emite el cambio.
   *
   * @param valor Texto ingresado por el usuario.
   */
  onFiltroChange(valor: string): void {
    this.filtroTexto = valor;
    this.filtroSubject.next(valor);
  }

  /**
   * Filtra la lista de auditorías según el texto ingresado.
   */
  aplicarFiltro(): void {
    if (!this.filtroTexto.trim()) {
      this.auditoriasFiltradasCache = [...this.auditorias];
      return;
    }

    const texto = this.filtroTexto.toLowerCase().trim();
    this.auditoriasFiltradasCache = this.auditorias.filter(a =>
      a.nombreUsuario?.toLowerCase().includes(texto) ||
      a.accion?.toLowerCase().includes(texto)
    );
  }

}
