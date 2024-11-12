import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  private router = inject(Router)
  private fb = inject(FormBuilder)
  private usuarioService = inject(UsuariosService)
  public loginForm: FormGroup
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    console.log(isPlatformBrowser(this.platformId))
    if(isPlatformBrowser(this.platformId)){
      console.log('manda o esto')
      this.loginForm = this.fb.group({
        username:[ localStorage.getItem('username') || '', [Validators.required, Validators.email]],
        password:['',Validators.required],
        remember:[localStorage.getItem('remember') || false]
      });
    }else{
      console.log('manda esto')
      this.loginForm = this.fb.group({
        username:['', [Validators.required, Validators.email]],
        password:['',Validators.required],
        remember:[ false]
      })
    }
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }


  login(){
    this.usuarioService.login( this.loginForm.value)
      .subscribe(resp => {
        if( this.loginForm.get('remember')?.value){
          localStorage.setItem('username', this.loginForm.get('username')?.value);
          localStorage.setItem('remember', this.loginForm.get('remember')?.value);
        }else{
          localStorage.removeItem('username');
          localStorage.removeItem('remember');
        }

        //ir al DashBoard
        this.router.navigateByUrl('/');
      },(err) => {
        const errorMsg = err.error?.msg || 'El Usuario o la Contraseña es incorrecta';
        Swal.fire('Error', errorMsg, 'error');
      });
    //console.log( this.loginForm.value )
  }

}
