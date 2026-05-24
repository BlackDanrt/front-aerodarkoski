import {ChangeDetectorRef, Component, inject, NgZone} from '@angular/core';
import {Rol} from '../enums/rol';
import {Usuario} from '../models/usuario';
import {UsuarioService} from '../services/usuario-service';
import {JwtService} from '../services/jwt-service';
import {debounceTime, distinctUntilChanged, finalize, Subject} from 'rxjs';

/**
 * Componente encargado de la gestión de usuarios del sistema(CRUD).
 * @author Juan Martinez
 * @version 1.0
 */
@Component({
  selector: 'app-usuario-crud',
  standalone: false,
  templateUrl: './usuario-crud.html',
  styleUrl: './usuario-crud.css',
})
export class UsuarioCrud {

  /** Servicio para la gestión de usuarios */
  private usuarioService = inject(UsuarioService);

  /** Servicio para el manejo de tokens JWT */
  private jwtService = inject(JwtService);

  /** Zona de Angular para ejecutar cambios manuales */
  private ngZone = inject(NgZone);

  /** Servicio para forzar la detección de cambios */
  private cdr = inject(ChangeDetectorRef);

  /** Lista completa de usuarios */
  usuarios: Usuario[] = [];

  /** Lista de usuarios filtrados */
  usuariosFiltradosCache: Usuario[] = [];

  /** Indica si los datos están cargando */
  cargando = true;

  /** Mensaje de error mostrado en pantalla */
  mensajeError = '';

  /** Mensaje de éxito mostrado en pantalla */
  mensajeExito = '';

  /** Identificador del usuario autenticado */
  idUsuarioActual: number | null = null;

  /** Texto utilizado para filtrar usuarios */
  filtroTexto = '';

  /** Subject utilizado para aplicar debounce al filtro */
  private filtroSubject = new Subject<string>();

  /** Indica si el modal está visible */
  mostrarModal = false;

  /** Indica si el formulario está en modo edición */
  modoEdicion = false;

  /** Modelo utilizado en el formulario de usuarios */
  usuarioForm: Usuario = {
    id: undefined,
    nombreUsuario: '',
    correo: '',
    contrasenia: '',
    rol: Rol.ADMINISTRADOR
  };

  /** Confirmación de contraseña ingresada por el usuario */
  confirmarContrasenia = '';

  /** Confirmación de correo ingresada por el usuario */
  confirmarCorreo = '';

  /** Indica si se está realizando una operación de guardado */
  guardando = false;

  /** Usuario seleccionado para eliminar */
  usuarioAEliminar: Usuario | null = null;

  /** Indica si el modal de confirmación está visible */
  mostrarConfirmacion = false;

  /** Lista de roles disponibles */
  roles = Object.values(Rol);

  /**
   * Inicializa el componente y configura el filtro con debounce.
   */
  ngOnInit(): void {
    this.idUsuarioActual = this.jwtService.getIdUsuario();
    this.filtroSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.aplicarFiltro();
      this.cdr.detectChanges();
    });

    this.cargarUsuarios();
  }

  /**
   * Carga la lista de usuarios desde el servidor.
   */
  cargarUsuarios(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    this.usuarioService.mostrar().pipe(
      finalize(() => {
        this.cargando = false;
        this.aplicarFiltro();
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        let lista: Usuario[] = [];
        if (response.body) {
          lista = response.body;
        }
        this.usuarios = lista.filter(u => u.id !==this.idUsuarioActual);
        },
      error: () => {
        this.mensajeError = 'Error al cargar los usuarios. Intente nuevamente.';
        this.usuarios = [];
      }
    });
  }

  /**
   * Retorna el identificador de un usuario para optimizar el renderizado.
   *
   * @param index Índice del elemento
   * @param usuario Usuario evaluado
   * @returns Identificador del usuario
   */
  buscarPorUsuario(index: number, usuario: Usuario): number {
    return usuario.id || index;
  }

  /**
   * Actualiza el valor del filtro y emite el cambio.
   *
   * @param valor Texto ingresado en el filtro
   */
  onFiltroChange(valor: string): void {
    this.filtroTexto = valor;
    this.filtroSubject.next(valor);
  }

  /**
   * Filtra la lista de usuarios según el texto ingresado.
   */
  aplicarFiltro(): void {
    if (!this.filtroTexto.trim()) {
      this.usuariosFiltradosCache = [...this.usuarios];
      return;
    }

    const texto = this.filtroTexto.toLowerCase().trim();
    this.usuariosFiltradosCache = this.usuarios.filter(u =>
      u.nombreUsuario?.toLowerCase().includes(texto) ||
      u.rol?.toLowerCase().includes(texto)
    );
  }

  /**
   * Abre el modal para crear un nuevo usuario.
   */
  abrirCrear(): void {
    this.modoEdicion = false;
    this.usuarioForm = {
      id: undefined,
      nombreUsuario: '',
      correo: '',
      contrasenia: '',
      rol: Rol.ADMINISTRADOR
    };
    this.confirmarContrasenia = '';
    this.confirmarCorreo = '';
    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  /**
   * Abre el modal para editar un usuario existente.
   *
   * @param usuario Usuario a editar
   */
  abrirEditar(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioForm = {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      contrasenia: '',
      rol: usuario.rol || Rol.ADMINISTRADOR
    };
    this.confirmarContrasenia = '';
    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  /**
   * Cierra el modal y reinicia el formulario.
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioForm = { id: undefined, nombreUsuario: '', contrasenia: '', rol: Rol.ADMINISTRADOR };
    this.confirmarContrasenia = '';
    this.mensajeError = '';
    this.cdr.detectChanges();
  }

  /**
   * Guarda un nuevo usuario o actualiza uno existente.
   */
  guardar(): void {
    if (this.guardando) return; // Evitar doble click

    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.usuarioForm.nombreUsuario?.trim()) {
      this.mensajeError = 'El nombre de usuario es requerido';
      this.cdr.detectChanges();
      return;
    }

    if (!this.modoEdicion && !this.usuarioForm.contrasenia) {
      this.mensajeError = 'La contraseña es requerida para crear un usuario';
      this.cdr.detectChanges();
      return;
    }

    if (this.usuarioForm.contrasenia) {
      if (this.usuarioForm.contrasenia.length < 6) {
        this.mensajeError = 'La contraseña debe tener al menos 6 caracteres';
        this.cdr.detectChanges();
        return;
      }
      if (this.usuarioForm.contrasenia !== this.confirmarContrasenia) {
        this.mensajeError = 'Las contraseñas no coinciden';
        this.cdr.detectChanges();
        return;
      }
    }

    if (this.usuarioForm.correo !== this.confirmarCorreo) {
      this.mensajeError = 'Los correos no coinciden';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    const datos: Usuario = {
      nombreUsuario: this.usuarioForm.nombreUsuario.trim(),
      correo: this.usuarioForm.correo,
      rol: this.usuarioForm.rol
    };

    if (this.usuarioForm.contrasenia) {
      datos.contrasenia = this.usuarioForm.contrasenia;
    }

    if (this.modoEdicion && this.usuarioForm.id) {
      this.usuarioService.actualizar(datos, this.usuarioForm.id).pipe(
        finalize(() => {
          this.guardando = false;
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: (resp: string) => {
          this.ngZone.run(() => {
            this.mensajeExito = resp;
            this.cerrarModal();
            this.cargarUsuarios();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.mensajeError = err.error || 'Error al actualizar el usuario';
            this.cdr.detectChanges();
          });
        }
      });
    } else {
      this.usuarioService.crear(datos).pipe(
        finalize(() => {
          this.guardando = false;
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: (resp: string) => {
          this.ngZone.run(() => {
            this.mensajeExito = resp;
            this.cerrarModal();
            this.cargarUsuarios();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.mensajeError = err.error || 'Error al crear el usuario';
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  /**
   * Muestra el modal de confirmación para eliminar un usuario.
   *
   * @param usuario Usuario a eliminar
   */
  confirmarEliminar(usuario: Usuario): void {
    this.usuarioAEliminar = usuario;
    this.mostrarConfirmacion = true;
    this.mensajeError = '';
    this.cdr.detectChanges();
  }

  /**
   * Cancela la eliminación de un usuario.
   */
  cancelarEliminar(): void {
    this.usuarioAEliminar = null;
    this.mostrarConfirmacion = false;
    this.mensajeError = '';
    this.cdr.detectChanges();
  }

  /**
   * Elimina el usuario seleccionado.
   */
  eliminar(): void {
    if (this.guardando || !this.usuarioAEliminar?.id) return;

    this.guardando = true;
    this.cdr.detectChanges();

    this.usuarioService.eliminar(this.usuarioAEliminar.id).pipe(
      finalize(() => {
        this.guardando = false;
        this.usuarioAEliminar = null;
        this.mostrarConfirmacion = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (resp: string) => {
        this.ngZone.run(() => {
          this.mensajeExito = resp;
          this.cargarUsuarios();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.mensajeError = err.error || 'Error al eliminar el usuario';
          this.cdr.detectChanges();
        });
      }
    });
  }
}
