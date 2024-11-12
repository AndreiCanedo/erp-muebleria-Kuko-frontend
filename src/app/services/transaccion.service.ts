import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Muebleria } from '../models/mueblerias.model';
import { Transaccion } from '../models/transaccion.model';
import { TipoFactura } from '../models/tipo-factura.enum';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class TransaccionService{

  private http = inject(HttpClient)

  constructor() { }

  get token(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';

  }

  get headers(){
    return {
      headers:{
        'x-token': this.token
      }
    }
  }

  cargarTransaccion(){
    const url = `${base_url}/estado`
    return this.http.get(url,this.headers)
        .pipe(
          map<any,Transaccion[]>( (resp: { ok:boolean, transaccion: {transacciones:Transaccion[]} } ) => resp.transaccion.transacciones )
        )
  }

  obtenerTransaccionesById(id:string){
    const url = `${base_url}/estado/${id}`
    return this.http.get<any>(url,this.headers)
        .pipe(
          map( (resp: { ok:boolean, transaccion: {transacciones:Transaccion[]} } ) => resp.transaccion.transacciones[0] )
        )
  }

  crearTransacciones( transaccion: { netoActual:number, netoNuevo:number, fecha:Date, tipo:TipoFactura }){
    const url = `${base_url}/estado`
    return this.http.post(url,transaccion,this.headers)
  }

  actualizarTransacciones( transaccion:Transaccion ){
    const url = `${base_url}/estado/${transaccion.uid}`
    return this.http.put(url,transaccion,this.headers)
  }

  deleteTransaccion( _id:string ){
    const url = `${base_url}/estado/${_id}`
    return this.http.put(url,this.headers)
  }


}
