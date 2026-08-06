import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject} from 'rxjs';

import { SharedService } from './shared.service';

import { ClienteDTO } from '../models/interface-models/clienteDTO.interface';
import { ClienteMapper } from '../mappers/cliente.mapper';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private sharedServices = inject(SharedService)

  private endpoint = '/clientes';
  private clienteCreadoSourse = new Subject<void>();

  clienteCreado$ =  this.clienteCreadoSourse.asObservable();

  notificarClienteCreado(){
    this.clienteCreadoSourse.next();
  }

  cargarCliente():Observable<Cliente[]>{
    return this.sharedServices.get<ClienteDTO>(this.endpoint)
      .pipe(
        map((dtos) => dtos.map(ClienteMapper.fromDTO))
      );
  }

  buscarClientes(texto: string): Observable<Cliente[]>{
    return this.sharedServices.get<ClienteDTO>(`${this.endpoint}/buscar`,{ texto: texto.trim() })
      .pipe(
        map((dtos) => dtos.map(ClienteMapper.fromDTO))
      );
  }

  cargarClienteById(id:number):Observable<Cliente>{
    return this.sharedServices.getById<ClienteDTO>(`${this.endpoint}/${id}`)
      .pipe(
        map(dto => ClienteMapper.fromDTO(dto))
      );
  }

  crearCliente(cliente:Cliente):Observable<Cliente>{
    return this.sharedServices.post<ClienteDTO>(this.endpoint, ClienteMapper.toDTO(cliente))
      .pipe(
        map(dto => ClienteMapper.fromDTO(dto))
      );
  }

  actualizarCliente(cliente:Cliente, id:number):Observable<Cliente>{
    return this.sharedServices.put<ClienteDTO>(`${this.endpoint}/${id}`, ClienteMapper.toDTO(cliente))
      .pipe(
          map(dto => ClienteMapper.fromDTO(dto))
        );
  }

  eliminarCliente(id:number):Observable<Cliente>{
    return this.sharedServices.delete<ClienteDTO>(`${this.endpoint}/${id}`)
      .pipe(
        map(dto => ClienteMapper.fromDTO(dto))
      );
  }

}
