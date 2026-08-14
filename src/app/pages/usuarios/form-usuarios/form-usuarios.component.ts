import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '../../../models/role.enum';
import { UsuarioForm } from '../../../type/form/usuario-form.type';

@Component({
  selector: 'app-form-usuarios',
  standalone: false,
  templateUrl: './form-usuarios.component.html',
  styleUrl: './form-usuarios.component.css',
})
export class FormUsuariosComponent {

  @Input({ required: true }) public usuarioForm!: UsuarioForm;
  @Input() public actualizar = false;
  @Input() public guardando = false;

  @Output() public submitForm = new EventEmitter<void>();
  @Output() public cancelar = new EventEmitter<void>();


  public readonly roles = Object.values(Role);


  /************************************************************/
  /************************ FORM ******************************/
  /************************************************************/

  public onSubmit(): void {

    if (this.guardando) return;

    this.submitForm.emit();
  }


  public cerrarCaja(): void {

    if (this.guardando) return;
    

    this.cancelar.emit();
  }


  /************************************************************/
  /*********************** CONTROLES **************************/
  /************************************************************/

  public get f():UsuarioForm['controls'] {

    return this.usuarioForm.controls;
  }


  public isInvalid(field: keyof UsuarioForm['controls']): boolean {

    const control = this.usuarioForm.controls[field];

    return control.touched && control.invalid;
  }


  /************************************************************/
  /************************ ROLE ******************************/
  /************************************************************/

  public obtenerNombreRol(role: Role): string {

    switch (role) {

      case Role.ADMIN: return 'Administrador';

      case Role.VENDEDOR: return 'Vendedor';

      case Role.USER: return 'Usuario';

      default: return role;
    }
  }

  /************************************************************/
  /************************ HELPERS ***************************/
  /************************************************************/

  public passwordConfirmInvalid(): boolean {

    const control = this.usuarioForm.controls.passwordConfirm;

    return control.touched && (control.invalid || this.usuarioForm.hasError('passwordMismatch'));
}


public passwordMismatch(): boolean {

    return this.usuarioForm.hasError('passwordMismatch');
}

}
