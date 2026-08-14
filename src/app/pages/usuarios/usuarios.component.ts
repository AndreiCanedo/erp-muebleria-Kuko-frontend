import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { Role } from '../../models/role.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit{

  private readonly usuarioService = inject(UsuariosService);
  private readonly destroyRef = inject(DestroyRef);

  public usuarios: Usuario[] = [];
  public usuariosFiltrados: Usuario[] = [];
  public usuarioSeleccionado: Usuario | null = null;
  public textoBusqueda = '';
  public rolSeleccionado: Role | null = null;

  public readonly roles = Object.values(Role);

  public ui = {
    cargando: false,
    cambiandoEstado: false,
    modalVisible: false,

    modo: null as
      | 'crear'
      | 'actualizar'
      | null,

    error: ''
  };


  ngOnInit(): void {

    this.cargarUsuarios();
  }


  /************************************************************/
  /********************* CARGAR USUARIOS **********************/
  /************************************************************/

  public cargarUsuarios(): void {

    this.ui.cargando = true;
    this.ui.error = '';

    this.usuarioService.cargarUsuarios()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({

        next: usuarios => {
          this.usuarios = usuarios;
          this.aplicarFiltros();
        },

        error: (error: Error) => {

          this.usuarios = [];
          this.usuariosFiltrados = [];
          this.ui.error = error.message;
        }

      });
  }


  /************************************************************/
  /************************ BUSCAR ****************************/
  /************************************************************/

  public buscar(texto: string): void {

    this.textoBusqueda = texto.trim();
    this.aplicarFiltros();
  }


  /************************************************************/
  /*********************** FILTRO ROL *************************/
  /************************************************************/

  public cambiarRol(role: Role | null): void {

    this.rolSeleccionado = role;
    this.aplicarFiltros();
  }


  public limpiarFiltros(): void {

    this.textoBusqueda = '';
    this.rolSeleccionado = null;
    this.aplicarFiltros();
  }


  /************************************************************/
  /*********************** FILTRADO ***************************/
  /************************************************************/

  private aplicarFiltros(): void {

    const texto = this.textoBusqueda.trim().toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
        const nombreCompleto = `${usuario.firstName ?? ''} ${usuario.lastName ?? ''}`
          .trim().toLowerCase();

        const coincideTexto = !texto
          || usuario.username.toLowerCase().includes(texto)
          || nombreCompleto.includes(texto)
          || usuario.country?.toLowerCase().includes(texto);

        const coincideRol = !this.rolSeleccionado
          || usuario.role === this.rolSeleccionado;

        return (coincideTexto && coincideRol);
      });
  }


  /************************************************************/
  /************************ CREAR *****************************/
  /************************************************************/

  public abrirCrear(): void {

    this.cerrarModal();

    this.ui.modo = 'crear';
    this.ui.modalVisible = true;
  }


  public usuarioCreado(_usuario: Usuario): void {

    this.cerrarModal();
    this.cargarUsuarios();
  }


  /************************************************************/
  /*********************** ACTUALIZAR *************************/
  /************************************************************/

  public abrirActualizar(usuario: Usuario): void {

    this.cerrarModal();

    this.usuarioSeleccionado = usuario;

    this.ui.modo = 'actualizar';
    this.ui.modalVisible = true;
  }


  public usuarioActualizado(_usuario: Usuario): void {
    this.cerrarModal();
    this.cargarUsuarios();
  }


  /************************************************************/
  /********************** CAMBIAR ESTADO **********************/
  /************************************************************/

  public confirmarCambiarEstado(usuario: Usuario): void {

    if (this.ui.cambiandoEstado) return;
    
    const nuevoEstado = !usuario.activo;

    Swal.fire({

      title: nuevoEstado ? '¿Activar usuario?' : '¿Desactivar usuario?',
      text: nuevoEstado
        ? `"${usuario.username}" podra volver a iniciar sesion.`
        : `"${usuario.username}" dejara de poder iniciar sesion.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: nuevoEstado ? 'Si, activar' : 'Si, desactivar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {

      if (result.isConfirmed) {
        this.cambiarEstado(usuario, nuevoEstado);
      }
    });
  }


  private cambiarEstado(usuario: Usuario, activo: boolean): void {

    this.ui.cambiandoEstado = true;

    this.usuarioService.cambiarEstado(usuario.id, activo)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cambiandoEstado = false)
      )
      .subscribe({

        next: usuarioActualizado => {

          this.usuarios = this.usuarios
            .map(usuario =>
              usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario
            );

          this.aplicarFiltros();

          Swal.fire({

            title: activo ? 'Usuario activado' : 'Usuario desactivado',
            icon: 'success'
          });
        },

        error: (error: Error) => {

          Swal.fire({

            title: 'No fue posible cambiar el estado',
            text: error.message,
            icon: 'error'
          });
        }

      });
  }


  /************************************************************/
  /************************ MODAL *****************************/
  /************************************************************/

  public cerrarModal(): void {

    this.ui.modalVisible = false;
  }

  //Se ejecuta despues de que el modal haga su animacion
  public onModalCerrado(): void {

    this.ui.modalVisible = false;
    this.ui.modo = null;
    this.usuarioSeleccionado = null;
  }


  /************************************************************/
  /************************ HELPERS ***************************/
  /************************************************************/

  public obtenerNombreCompleto(usuario: Usuario): string {

    const nombre = [usuario.firstName, usuario.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

    return nombre || 'Sin nombre registrado';
  }


  public obtenerNombreRol(role: Role): string {

    switch (role) {

      case Role.ADMIN: return 'Administrador';

      case Role.VENDEDOR: return 'Vendedor';

      case Role.USER: return 'Usuario';

      default: return role;
    }
  }

}
