import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/role.enum';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: false
})
export class LoginComponent implements OnInit{

  private router = inject(Router)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService);
  public loginForm: FormGroup

  public errorLogin = '';
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    
    if(isPlatformBrowser(this.platformId)){
      this.loginForm = this.fb.group({
        username:[ localStorage.getItem('username') || '', [Validators.required, Validators.email]],
        password:['',Validators.required],
        remember:[localStorage.getItem('remember') || false]
      });
    }else{
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
    this.authService.login( this.loginForm.value)
      .subscribe({
        next: resp => {
        if( this.loginForm.get('remember')?.value){
          localStorage.setItem('username', this.loginForm.get('username')?.value);
          localStorage.setItem('remember', this.loginForm.get('remember')?.value);
        }else{
          localStorage.removeItem('username');
          localStorage.removeItem('remember');
        }

        const role = resp.role as Role;

        switch (role) {

          case Role.ADMIN:
            this.router.navigateByUrl('/dashboard');
            break;

          case Role.VENDEDOR:
          case Role.USER:
            this.router.navigateByUrl('/catalogo');
            break;

          default:
            this.router.navigateByUrl('/login');
        }
      },
      error: err => {
        this.errorLogin = 'El usuario o la contraseña es incorrecta';
        const errorMsg = err.error?.msg || 'El Usuario o la Contraseña es incorrecta';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
    //console.log( this.loginForm.value )
  }

}
