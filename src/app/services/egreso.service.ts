import { inject, Injectable } from '@angular/core';
import { Egreso } from '../models/egreso.model';
import { catchError, Observable, throwError } from 'rxjs';
import { SharedService } from './shared.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    console.log('egreso => ',egreso)
    return this.sharedServices.post<Egreso>(`${this.endpoint}`,egreso)
        .pipe(
          catchError((error:HttpErrorResponse):Observable<Egreso> => {
            console.error('Error al crear Egreso', error.message)
            return throwError(error)
          })
        )
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
