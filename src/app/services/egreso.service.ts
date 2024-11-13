import { inject, Injectable } from '@angular/core';
import { Egreso } from '../models/egreso.model';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private sharedServices = inject(SharedService)

  private endpoint = '/factura/egresos'
  private respField = 'egreso';

  cargarEgresos():Observable<Egreso[]>{
    return this.sharedServices.get<Egreso>(this.endpoint,this.respField)
  }

  cargarEgresoById(id:string):Observable<Egreso>{
    return this.sharedServices.getById<Egreso>(`${this.endpoint}/${id}`,this.respField)
  }

  crearEgreso(egreso:Egreso):Observable<Egreso>{
    return this.sharedServices.post<Egreso>(`${this.endpoint}`,egreso)
  }

  actualizarEgreso(egreso:Egreso, id:string):Observable<Egreso>{
    return this.sharedServices.put<Egreso>(`${this.endpoint}/${id}`,egreso)
  }

  eliminarEgreso(id:string):Observable<Egreso>{
    return this.sharedServices.delete<Egreso>(`${this.endpoint}/${id}`)
  }

  /*
  egreso:{ nombre:string, 
           motivo:string, 
           justificacion:string, monto:number, 
           cambio:number, formaPago:string, 
           muebleria:Muebleria, transacciones:Transaccion[]} )
  */
}
