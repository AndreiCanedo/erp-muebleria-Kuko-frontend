import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseRest } from '../interface/response-rest.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private base_url = environment.base_url;

  private http = inject(HttpClient)

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

    return this.http.get<ResponseRest<T[]>>(`${this.base_url}${url}`, { ...this.header, params: httpParams})
      .pipe(
        map(resp => resp.data ?? []),
        catchError(this.handleError)
      );
  }

  public getById<T>(url: string): Observable<T>{
    return this.http.get<ResponseRest<T>>(`${this.base_url}${url}`, this.header)
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

  return this.http.get<ResponseRest<T>>(`${this.base_url}${url}`,{...this.header,params: httpParams})
    .pipe(
      map(resp => resp.data),
      catchError(this.handleError)
    );
}



  public post<T>(url:string, data:any): Observable<T>{
    return this.http.post<ResponseRest<T>>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      );
  }

  public put<T>(url:string, data:any): Observable<T>{
    return this.http.put<ResponseRest<T>>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      )
  }

  public patch<T>(url:string, data:any): Observable<T>{
    return this.http.patch<ResponseRest<T>>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      );
  }

  public delete<T>(url:string):Observable<T>{
    return this.http.delete<ResponseRest<T>>(`${this.base_url}${url}`, this.header)
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      )
  }

  public deleteWithBody<T>(url:string, body: unknown):Observable<T>{
    return this.http.delete<ResponseRest<T>>(`${this.base_url}${url}`,{body})
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      )
  }

  get token():string{
    //verificar si windows esta difinido antes de acceder
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  get header(){
    const token = this.token; 
    console.log('Token => ', token);
    return {
      headers:new HttpHeaders({
          'x-token': this.token
        })
    }
  }

  private handleError(error: HttpErrorResponse){
    
    console.error('HTTP error: ', error);

    let message = 'Error Desconocido';

    if(error.error instanceof ErrorEvent){
      //Error del Cliente
      message = `Error cliente:  ${error.error.message}`;
    } else {
      //Error Servidor
      const backendError = error.error;

      if(backendError?.message){
        //Mi ResponseRest.message
        message = backendError.message;
      }else if(error.status === 0){
        message = 'No hay conexion con el servidor';
      } else {
        message = `Error ${error.status}: ${error.statusText}`;
      }
    }
  
  
  return throwError(() => new Error(message));
  }


}
