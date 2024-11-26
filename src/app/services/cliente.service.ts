import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable, Subject } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private sharedServices = inject(SharedService)

  private endpoint = '/cliente';
  private respField = 'cliente';
  private clienteCreadoSourse = new Subject<void>();

  clienteCreado$ =  this.clienteCreadoSourse.asObservable();

  notificarClienteCreado(){
    this.clienteCreadoSourse.next();
  }

  cargarCliente():Observable<Cliente[]>{

    return this.sharedServices.get<Cliente>(this.endpoint,this.respField);
  }

  cargarClienteById(id:string):Observable<Cliente>{
    return this.sharedServices.getById<Cliente>(`${this.endpoint}/${id}`, this.respField)
  }

  crearCliente(cliente:Cliente):Observable<Cliente>{
    return this.sharedServices.post<Cliente>(this.endpoint,cliente)
  }

  actualizarCliente(cliente:Cliente, id:String):Observable<Cliente>{
    return this.sharedServices.put<Cliente>(`${this.endpoint}/${id}`,cliente)
  }

  eliminarCliente(id:string):Observable<Cliente>{
    return this.sharedServices.delete<Cliente>(`${this.endpoint}/${id}` )
  }

}
