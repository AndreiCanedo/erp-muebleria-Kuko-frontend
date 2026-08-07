import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseRest } from '../interface/response-rest.interface';
import { ResponseRestObject } from '../interface/response-rest-object.interface';
import { StorageServiceService } from './storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private storageServices = inject(StorageServiceService);

  private base_url = environment.base_url;

  private http = inject(HttpClient);

  constructor() { }


  //Este get permite el GetAll y el buscartexto
  // se agrego los params para el uso del buscar texto
  public get<T>(url: string, params?: Record<string, string | number | boolean>): Observable<T[]> {

    let httpParams = new HttpParams();

    if(params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key,String(value));
      })
    }

    return this.http.get<ResponseRest<T>>(`${this.base_url}${url}`, { ...this.header, params: httpParams})
      .pipe(
        map(resp => resp.data ?? []),
        catchError(this.handleError)
      );
  }

  public getById<T>(url: string): Observable<T>{
    return this.http.get<ResponseRestObject<T>>(`${this.base_url}${url}`, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      );
  }

  /********************** Metodo Generico para llamar un objeto *************************/

public getObject<T>(url: string, params?: Record<string, string | number | boolean>): Observable<T> {

  let httpParams = new HttpParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      httpParams = httpParams.set(key, String(value));
    });
  }

  return this.http.get<ResponseRestObject<T>>(`${this.base_url}${url}`,{...this.header,params: httpParams})
    .pipe(
      map(resp => resp.data),
      catchError(this.handleError)
    );
}



  public post<T>(url:string, data:unknown): Observable<T>{
    return this.http.post<ResponseRestObject<T>>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      );
  }

  public put<T>(url:string, data:unknown): Observable<T>{
    return this.http.put<ResponseRestObject<T>>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      )
  }

  public patch<T>(url:string, data:unknown): Observable<T>{
    return this.http.patch<ResponseRestObject<T>>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      );
  }

  public delete<T>(url:string):Observable<T>{
    return this.http.delete<ResponseRestObject<T>>(`${this.base_url}${url}`, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      )
  }

  public deleteWithBody<T>(url:string, body: unknown):Observable<T>{
    return this.http.delete<ResponseRestObject<T>>(`${this.base_url}${url}`,{...this.header, body})
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      )
  }

  private get token():string{
    //verificar si windows esta difinido antes de acceder
    /*if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';*/
    return this.storageServices.obtener<string>('token') ?? '';
  }

  private get header(){
    const token = this.token; 
    
    if(!token){
      return {
        headers: new HttpHeaders()
      };
    }

    return {
      headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
    };
  }

  private handleError(error: HttpErrorResponse):Observable<never>{
    
    console.error('HTTP error: ', error);

    let message = 'Error Desconocido';

    if(typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent){
      //Error del Cliente
      message = `Error cliente:  ${error.error.message}`;

    } else {
      //Error Servidor
      const backendError = error.error;

      if(backendError?.message){
        //Mi ResponseRest.message
        message = backendError.message;
      } else if(error.status === 0){

        message = 'No hay conexion con el servidor';
      } else if(error.status === 401){

        message = 'La sesion no es válida o ha expirado';
      } else if(error.status === 403){

        message = 'No tienes permisos para realizar esta accion';
      }else {
        
        message = `Error ${error.status}: ${error.statusText}`;
      }
    }
  
  
    return throwError(() => new Error(message));
  }


}
