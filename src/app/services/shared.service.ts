import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private base_url = environment.base_url;

  private http = inject(HttpClient)

  constructor() { }

  public get<T>(url: string, respField:string): Observable<T[]> {
    return this.http.get<T>(`${this.base_url}${url}`, this.header)
      .pipe(
        map(  (resp:any) =>{
          let plural = 's'
          if(respField == 'transaccion'){
            plural = 'es'
          }
          return resp[respField]?.[respField + plural] || []
        }),
        catchError(this.handleError)
      );
  }

  public getById<T>(url: string, respField:string): Observable<T>{
    return this.http.get<T>(`${this.base_url}${url}`, this.header)
      .pipe(
        map( (resp:any) => {
          let plural = 's'
          if(respField == 'transaccion'){
            plural = 'es'
          }
          return resp[respField]?.[respField + 's']?.[0] || null 
        }),
        catchError(this.handleError)
      )
  }

  public post<T>(url:string, data:any): Observable<T>{
    const fullUrl = `${this.base_url}${url}`
    console.log('url => ',fullUrl)
    console.log('dato => ',data)
    return this.http.post<T>(fullUrl, data, this.header)
      .pipe(
        catchError((error:HttpErrorResponse):Observable<T> => {
          console.error(`Error en la solicitud POST a ${fullUrl}`,error.message)
          return throwError(error)
        })
      );
  }

  public put<T>(url:string, data:any): Observable<T>{
    return this.http.put<T>(`${this.base_url}${url}`, data, this.header)
      .pipe(
        catchError(this.handleError)
      )
  }

  public delete<T>(url:string):Observable<T>{
    return this.http.delete<T>(`${this.base_url}${url}`, this.header)
      .pipe(
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

  private handleError(error:any){
    console.error('Error en la solicitud: ', error)
    return throwError('Ha Ocurrido un error, por favor intente nuevamente.')
  }


}
