import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { RegisterForm } from '../interface/register-form.interface';
import { LoginForm } from '../interface/login-form.interface';

const base_url = environment.base_url



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private router = inject(Router);
  public usuario! : Usuario;

  private http = inject(HttpClient);


  guardarLocalStorage(token: string, menu:any){
    localStorage.setItem('token', token)
    localStorage.setItem('menu', JSON.stringify(menu))
  }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get uid():number{
    return this.usuario.uid || 0;
  }

  get headers(){
    return {
      headers: {
        'x-token' : this.token
      }
    }
  }

  validarToken(): Observable<boolean>{
    return this.http.get(`${base_url}/auth/login`,{
      headers:{
        'x-token': this.token
      }
    }).pipe(
      map( (resp:any) => {
        const{username, firstName, lastName, country, role, uid } = resp.usuario;

        this.usuario = new Usuario( firstName, lastName, username, '',country, uid, role);

        this.guardarLocalStorage(resp.token, resp.menu)

        return true
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/auth/register`,formData)
      .pipe(
        tap( (resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu)
        })
      );
  }

  login( formData: LoginForm){
    console.log(formData);
    return this.http.post(`${base_url}/auth/login`, formData)
      .pipe(
        tap( (resp:any) => {
          this.guardarLocalStorage(resp.token, resp.menu)
        })
      )
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('/login');
  }
  
}
