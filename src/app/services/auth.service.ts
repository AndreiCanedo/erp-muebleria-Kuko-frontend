import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { StorageServiceService } from './storage-service.service';
import { LoginRequest } from '../interface/login-request.interface';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interface/auth-response.interface';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private sharedService = inject(SharedService);
  private storageService = inject(StorageServiceService);

  public login(request: LoginRequest): Observable<AuthResponse> {

    return this.sharedService
      .post<AuthResponse>('/auth/login', request)
      .pipe(tap(response => this.guardarSesion(response)));

  }


  public logout(): void{
    this.storageService.eliminar('token');
    this.storageService.eliminar('username');
    this.storageService.eliminar('role');
  }

  private guardarSesion(response: AuthResponse): void {

    this.storageService.guardar('token', response.token);

    this.storageService.guardar('username', response.username);

    this.storageService.guardar('role', response.role);

  }

  public getToken(): string{
    return this.storageService.obtener<string>('token') ?? '';
  }

  public getUsername(): string {
    return this.storageService.obtener<string>('username') ?? '';
  }

  public getRole(): string {
    return this.storageService.obtener<string>('role') ?? '';
  }

  /***************POR EL MOMENTO**************/
  /***TODO: verificar si ya vencio JWT*/
  public estaAutenticado(): boolean {
    const token = this.getToken();

    if(!token){
      return false;
    }

    if(this.tokenExpirado(token)){
      this.logout();
      return false;
    }

    return true;
  }

  public tokenExpirado(token: string = this.getToken()): boolean {

    const payload = this.obtenerPayload(token);

    if(!payload?.exp){
      return true;
    }

    const expiracionMs = payload.exp * 1000;

    return Date.now() >= expiracionMs;

  }

  public get fechaExpiracion(): Date | null{
    const payload = this.obtenerPayload(this.getToken());

    if(!payload?.exp) return null;

    return new Date(payload.exp * 1000);
  }

  private obtenerPayload(token:string): JwtPayload | null{

    try{

      const partes = token.split('.');

      if(partes.length !== 3) return null;

      const payloadBase64Url = partes[1];

      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');

      const payloadNormalizado = payloadBase64.padEnd(
        payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '='
      );

      const json = decodeURIComponent(
        atob(payloadNormalizado)
          .split('')
          .map(caracter => 
            `%${caracter.charCodeAt(0).toString(16).padStart(2, '0')}`
          )
          .join('')
      );

      return JSON.parse(json) as JwtPayload;

    }catch{
      return null;
    }

  }

}
