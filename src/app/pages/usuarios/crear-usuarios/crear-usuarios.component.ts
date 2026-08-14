import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioForm } from '../../../type/form/usuario-form.type';
import { Role } from '../../../models/role.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { CrearUsuarioRequest } from '../../../models/request/crear-usuario.request';

@Component({
  selector: 'app-crear-usuarios',
  standalone: false,
  templateUrl: './crear-usuarios.component.html',
  styleUrl: './crear-usuarios.component.css',
})
export class CrearUsuariosComponent implements OnInit{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly usuarioService = inject(UsuariosService);

  @Output() public usuarioCreado = new EventEmitter<Usuario>();
  @Output() public cancelar = new EventEmitter<void>();

  public usuarioForm!: UsuarioForm;

  public ui = {
    actualizar: false,
    guardando: false
  };


  ngOnInit(): void {

    this.initForm();
  }


  private initForm(): void { 
    this.usuarioForm = this.fb.group({

      id: this.fb.control<number>(0),
      username: this.fb.control<string>('',
        [Validators.required, Validators.email, this.noWhitespaceValidator]),
      firstName: this.fb.control<string>(''),
      lastName: this.fb.control<string>(''),
      country: this.fb.control<string>(''),
      role: this.fb.control<Role>(Role.USER, Validators.required),
      activo: this.fb.control<boolean>(true),
      password: this.fb.control<string>('',
        [Validators.required, Validators.minLength(8), this.passwordValidator]),
      passwordConfirm: this.fb.control<string>('', Validators.required)
    }, {
      validators: this.passwordMatchValidator
    });
  }


  /************************************************************/
  /********************** CREAR USUARIO ***********************/
  /************************************************************/

  public guardarUsuario(): void {

    if (this.usuarioForm.invalid || this.ui.guardando) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.ui.guardando = true;
    const request = this.buildRequest();

    this.usuarioService.crearUsuario(request)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.guardando = false)
      )
      .subscribe({

        next: usuario => {

          this.usuarioCreado.emit(usuario);

          Swal.fire({
            title: 'Usuario creado correctamente',
            icon: 'success'
          });
        },

        error: error => {

          Swal.fire({
            title: 'No fue posible crear el usuario',
            text: error.message,
            icon: 'error'
          });
        }

      });
  }


  /************************************************************/
  /*********************** BUILD REQUEST **********************/
  /************************************************************/

  private buildRequest(): CrearUsuarioRequest {

    const form = this.usuarioForm.getRawValue();
    return {
      username: form.username.trim().toLowerCase(),
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      firstName: this.normalizarTexto(form.firstName),
      lastName: this.normalizarTexto(form.lastName),
      country: this.normalizarTexto(form.country),
      role: form.role
    };
  }


  /************************************************************/
  /**************** VALIDACIÓN CONTRASEÑA ********************/
  /************************************************************/

  private passwordValidator(control: AbstractControl): ValidationErrors | null {

    const password = control.value as string;

    if (!password) return null;
    
    if (!/[A-Z]/.test(password)) {
      return {
        uppercase: true
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        lowercase: true
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        number: true
      };
    }

    return null;
  }


  private passwordMatchValidator:ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {

    const password = control.get('password')?.value;
    const confirm = control.get('passwordConfirm')?.value;

    if (!password || !confirm) return null;
    
    return password === confirm ? null : { passwordMismatch: true };
  };


  /************************************************************/
  /************************ HELPERS ***************************/
  /************************************************************/

  private noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {

    const value = control.value as string;

    return value?.trim().length === 0 ? { whitespace: true } : null;
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
