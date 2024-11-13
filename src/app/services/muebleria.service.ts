import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Muebleria } from '../models/mueblerias.model';
import { SharedService } from './shared.service';


@Injectable({
  providedIn: 'root'
})
export class MuebleriaService {

  private sharedService = inject(SharedService)

  private endpoint = '/muebleria'
  private respField = 'muebleria'
  
  constructor() { }

  cargarMuebleria():Observable<Muebleria[]>{
    return this.sharedService.get<Muebleria>(this.endpoint,this.respField)
   
  }

  obtennerMuebleriaById(id:string):Observable<Muebleria>{
    return this.sharedService.getById<Muebleria>(`${this.endpoint}/${id}`,this.respField)
  }

  crearMuebleria( muebleria: { neto:number } ):Observable<Muebleria>{
    return this.sharedService.post<Muebleria>(this.endpoint,muebleria)
  }

  actualizarMuebleria( muebleria: Muebleria ):Observable<Muebleria>{
    return this.sharedService.put<Muebleria>(this.endpoint,muebleria)
  }

  eliminarMuebleria( _id: string ):Observable<Muebleria>{
    return this.sharedService.delete<Muebleria>(this.endpoint)
  }


}
