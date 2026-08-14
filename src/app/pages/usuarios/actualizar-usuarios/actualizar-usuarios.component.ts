import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioForm } from '../../../type/form/usuario-form.type';
import { Role } from '../../../models/role.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ActualizarUsuarioRequest } from '../../../models/request/actualizar-usuario.request';

@Component({
  selector: 'app-actualizar-usuarios',
  standalone: false,
  templateUrl: './actualizar-usuarios.component.html',
  styleUrl: './actualizar-usuarios.component.css',
})
export class ActualizarUsuariosComponent implements OnChanges{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly usuarioService = inject(UsuariosService);

  @Input({ required: true }) public usuario!: Usuario;

  @Output() public usuarioActualizado = new EventEmitter<Usuario>();
  @Output() public cancelar = new EventEmitter<void>();

  public usuarioForm: UsuarioForm = this.fb.group({

      id: this.fb.control<number>(0),
      username: this.fb.control<string>('',
        [Validators.required, Validators.email, this.noWhitespaceValidator]),
      firstName: this.fb.control<string>(''),
      lastName: this.fb.control<string>(''),
      country: this.fb.control<string>(''),
      role: this.fb.control<Role>(Role.USER, Validators.required),
      activo: this.fb.control<boolean>(true),

      //Existe porque son parte de usuario form pero nos los utiliza
      password: this.fb.control<string>(''),
      passwordConfirm: this.fb.control<string>('')
    });

  public ui = {
    actualizar: true,
    guardando: false
  };


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['usuario'] && this.usuario) {
      this.cargarUsuarioEnFormulario();
    }
  }


  /************************************************************/
  /******************* CARGAR FORMULARIO **********************/
  /************************************************************/

  private cargarUsuarioEnFormulario(): void {

    this.usuarioForm.reset({

      id: this.usuario.id,
      username: this.usuario.username,
      firstName: this.usuario.firstName ?? '',
      lastName: this.usuario.lastName ?? '',
      country: this.usuario.country ?? '',
      role: this.usuario.role,
      activo: this.usuario.activo,
      password: '',
      passwordConfirm: ''
    });
  }


  /************************************************************/
  /********************* ACTUALIZAR ***************************/
  /************************************************************/

  public actualizarUsuario(): void {

    if (this.usuarioForm.invalid || this.ui.guardando) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.ui.guardando = true;

    const request = this.buildRequest();

    this.usuarioService.actualizarUsuario(this.usuario.id, request)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.guardando = false)
      )
      .subscribe({

        next: usuario => {

          this.usuarioActualizado.emit(usuario);

          Swal.fire({
            title: 'Usuario actualizado correctamente',
            icon: 'success'
          });
        },

        error: (error: Error) => {

          Swal.fire({
            title: 'No fue posible actualizar el usuario',
            text: error.message,
            icon: 'error'
          });
        }

      });
  }


  /************************************************************/
  /*********************** BUILD REQUEST **********************/
  /************************************************************/

  private buildRequest(): ActualizarUsuarioRequest {

    const form = this.usuarioForm.getRawValue();

    return {
      username: form.username.trim().toLowerCase(),
      firstName: this.normalizarTexto(form.firstName),
      lastName: this.normalizarTexto(form.lastName),
      country: this.normalizarTexto(form.country),
      role: form.role,
      activo: form.activo
    };
  }


  /************************************************************/
  /************************ HELPERS ***************************/
  /************************************************************/

  private noWhitespaceValidator(control: AbstractControl) {

    return (control.value || '').trim().length === 0 
        ? { whitespace: true }
        : null;
  }


  private normalizarTexto(valor: string): string | null {

    const texto = valor.trim();

    return texto ? texto : null;
  }


  public cerrarCaja(): void {

    if (this.ui.guardando) return;

    this.cancelar.emit();
  }

}
