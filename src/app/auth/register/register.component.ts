import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    standalone: false
})
export class RegisterComponent implements OnInit{

  private router = inject(Router)
  private formSumitted = false//bandera para errores
  private fb = inject(FormBuilder)
  private usuarioService = inject(UsuariosService)
  public registerForm: FormGroup
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    console.log(isPlatformBrowser(this.platformId))
    if(isPlatformBrowser(this.platformId)){
      this.registerForm = this.fb.group({
        firstName:['', [Validators.required]],
        lastName:['', [Validators.required]],
        country:['', [Validators.required]],
        username:[ '', [Validators.required, Validators.email]],
        password:['',Validators.required],
        password2:['',Validators.required]
      },{
        validators: this.passwordsIguales('password', 'password2')
      });
    }else{
      this.registerForm = this.fb.group({
        firstName:['', [Validators.required]],
        lastName:['', [Validators.required]],
        country:['', [Validators.required]],
        username:[ '', [Validators.required, Validators.email]],
        password:['',Validators.required]
      },{
        validators: this.passwordsIguales('password', 'password2')
      })
    }
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }


  crearUsuario(){
    this.formSumitted = true;
    console.log(this.registerForm.value)
    if(this.registerForm.invalid){
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe( resp => {
        this.router.navigateByUrl('/');

      },(err) => {
        const errorMsg = err.error?.msg || 'Error al crear Usuario';
        Swal.fire('Error', errorMsg, 'error');
      })
  }

  campoNoValido(campo:string):boolean{
    console.log(campo,"=>", this.registerForm.get(campo)?.invalid && this.formSumitted)
    if(this.registerForm.get(campo)?.invalid && this.formSumitted ){
      return true
    }
    return false
    
    }

  contrasenasNoValidas(){
    const pass1 =  this.registerForm.get('password')?.value;
    const pass2 =  this.registerForm.get('password2')?.value;
    console.log(pass1 !== pass2)
    if( (pass1 !== pass2) && this.formSumitted ){
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1:string, pass2:string){
    return (form: FormGroup) => {

      const pass1Check = form.get(pass1);
      const pass2Check = form.get(pass2);

      if(pass1Check?.value == pass2Check?.value){
        pass2Check?.setErrors(null)
      }else{
        pass2Check?.setErrors({ noEsIgual: true})
      }

    }
  }

}
