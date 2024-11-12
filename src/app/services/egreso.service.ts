import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from 'express';
import { HttpClient } from '@angular/common/http';
import { Egreso } from '../models/egreso.model';
import { catchError, map, throwError } from 'rxjs';
import { Muebleria } from '../models/mueblerias.model';
import { Transaccion } from '../models/transaccion.model';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private http = inject(HttpClient)

  constructor() { }

  get token():string{
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  get header(){
    return {
      headers:{
        'x-token': this.token
      }
    }
  }

  cargarEgreso(){
    const url = `${base_url}/factura/egresos`;
    return this.http.get( url, this.header)
        .pipe(
          map<any,Egreso[]>( ( resp: { ok:boolean, egreso:{ egresos:Egreso[] } } ) => resp.egreso.egresos )
        )
  }

  cargarEgresoById(id:string){
    const url = `${base_url}/factura/egresos/${id}`
    return this.http.get<any>( url, this.header )
        .pipe(
          map<any,Egreso>( ( resp: { ok:boolean, egreso:{ egresos:Egreso[] } } ) => {
            if (resp.egreso && resp.egreso.egresos && resp.egreso.egresos[0]){
              return resp.egreso.egresos[0] 
            }else{
              throw new Error('Egreso no encontrado')
            }
            
          }),
          catchError(err => {
            if(err.status === 404){
              console.error('Recursos No Encontrados')
              return throwError(() => new Error('El id no existe en la base de datos'));
            }else{
              console.error('Error en cargarEgresoById: ',err)
              return throwError(() => new Error('El id no existe en la base de datos'));
            }
          })
        )
  }

  crearEgreso( egreso:{ nombre:string, motivo:string, 
                        justificacion:string, monto:number, 
                        cambio:number, formaPago:string, 
                        muebleria:Muebleria, transacciones:Transaccion[]} ){

    const url = `${base_url}/factura/egresos`
    return this.http.post( url, egreso, this.header )


  }

  actualizarEgreso( egreso: Egreso){
    const url = `${base_url}/factura/egresos/${egreso}`;
    return this.http.put(url, egreso, this.header)
  }

  eliminarEgreso(_id:string){
    const url =`${base_url}/egreso/${_id}`
    return this.http.delete(url,this.header)
  }


}
