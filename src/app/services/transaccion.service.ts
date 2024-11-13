import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion.model';
import { TipoFactura } from '../models/tipo-factura.enum';
import { SharedService } from './shared.service';


@Injectable({
  providedIn: 'root'
})
export class TransaccionService{

  
  private sharedService = inject(SharedService)

  private endpoint = '/estado'
  private respField = 'transaccion'

  constructor() { }

  cargarTransaccion():Observable<Transaccion[]>{
    return this.sharedService.get<Transaccion>(this.endpoint,this.respField)
  }

  obtenerTransaccionesById(id:string):Observable<Transaccion>{
    return this.sharedService.getById<Transaccion>(`${this.endpoint}/${id}`,this.respField)
  }

  crearTransacciones( transaccion: { netoActual:number, netoNuevo:number, fecha:Date, tipo:TipoFactura }){
    return this.sharedService.post<Transaccion>( this.endpoint, transaccion )
  }

  actualizarTransacciones( transaccion:Transaccion,id:string ){
    return this.sharedService.put<Transaccion>(`${this.endpoint}/${id}`, transaccion)
  }

  deleteTransaccion( _id:string ){
    return this.sharedService.delete<Transaccion>(`${this.endpoint}/${_id}`)
  }

}
