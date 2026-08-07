import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interface/register-request.interface';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    standalone: false
})
export class RegisterComponent{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public enviado = false;
  public guardando = false;

  public registerForm = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      username: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      passwordConfirm: ['', Validators.required]
    },
    {
      validators: [this.passwordsIguales]
    }
  );

  public crearUsuario(): void {
    this.enviado = true;

    if (this.registerForm.invalid || this.guardando) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.getRawValue();

    const request: RegisterRequest = {
      username: form.username.trim(),
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      country: form.country.trim()
    };

    this.guardando = true;

    this.authService.register(request)
      .pipe(finalize(() => this.guardando = false)
      )
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Usuario registrado',
            icon: 'success'
          }).then(() => {
            this.router.navigateByUrl('/');
          });
        },
        error: (error: Error) => {
          Swal.fire({
            title: 'No fue posible registrar al usuario',
            text: error.message,
            icon: 'error'
          });
        }
      });
  }

  public campoNoValido(campo: string): boolean {
    const control = this.registerForm.get(campo);

    return Boolean(control && control.invalid && (control.touched || this.enviado));
  }

  public contrasenasNoValidas(): boolean {
    const confirmacion = this.registerForm.controls.passwordConfirm;

    return Boolean(this.registerForm.hasError('passwordMismatch') 
      && (confirmacion.touched || this.enviado));  
    }

  private passwordsIguales(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;

    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (!password || !passwordConfirm) {
      return null;
    }

    if (password === passwordConfirm) {
      return null;
    }

    return {
      passwordMismatch: true
    };
  }

  public mensajeErrorPassword(): string {
    const control = this.registerForm.controls.password;

    if (!(control.touched || this.enviado)) {
      return '';
    }
  
    if (control.hasError('required')) {
      return 'La contraseña es obligatoria';
    }
  
    if (control.hasError('minlength')) {
      return 'Debe tener mínimo 8 caracteres';
    }
  
    if (control.hasError('pattern')) {
      return 'Debe incluir una mayúscula, una minúscula y un número';
    }
  
    return '';
  }

}
