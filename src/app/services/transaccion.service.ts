import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion.model';
import { TipoFactura } from '../models/tipo-factura.enum';
import { SharedService } from './shared.service';
import moment from 'moment';


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

  agruparTransaccionPorSemana( transacciones:any[] ): { egresos:any, ingresos:any }{
    let transaccionesPorSemanaEgreso:any = {}
    let transaccionesPorSemanaIngreso:any = {}

    transacciones.forEach(transaccion => {
      const semana = moment(transaccion.fecha).startOf('week').format('YYYY-MM-DD');
      if(transaccion.tipo == 'EGRESO'){
        if(!transaccionesPorSemanaEgreso[semana]){
          transaccionesPorSemanaEgreso[semana] = 0;
        }
        let monto = this.calcularTransaccion(transaccion)
        transaccionesPorSemanaEgreso[semana] += monto;
      }
      if(transaccion.tipo == 'INGRESO'){
        if(!transaccionesPorSemanaIngreso[semana]){
          transaccionesPorSemanaEgreso[semana] = 0
        }
        let monto = this.calcularTransaccion(transaccion);
        transaccionesPorSemanaIngreso[semana] += monto;
      }
    })
    return {egresos:transaccionesPorSemanaEgreso, ingresos:transaccionesPorSemanaIngreso}
  }

  calcularTransaccion(transaccion:Transaccion):number{
    if(transaccion.tipo == 'EGRESO'){
      return transaccion.netoNuevo - transaccion.netoActual
    }else{
      return transaccion.netoActual - transaccion.netoNuevo
    }
  }

}
