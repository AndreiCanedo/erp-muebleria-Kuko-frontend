import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { Muebleria } from '../models/mueblerias.model';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MuebleriaService {

  private http = inject(HttpClient);
  
  constructor() { }

  get token(): string {
    //console.log(localStorage.getItem('token'))
    //verificar si windows esta difinido antes de acceder
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


  cargarMuebleria(){
    const url = `${base_url}/muebleria`;
    return this.http.get( url, this.headers)
              .pipe(
                map<any,Muebleria[]>( ( resp: { ok:boolean, muebleria:{mueblerias:Muebleria[]} } ) => resp.muebleria.mueblerias)
              )
  }

  obtennerMuebleriaById(id:string){
    const url = `${base_url}/muebleria/${id}`
    return this.http.get<any>(url,this.headers)
            .pipe(
              map( (resp: {ok:boolean, muebleria:{mueblerias:Muebleria[]} } ) => resp.muebleria.mueblerias[0] )
            )
  }

  crearMuebleria( muebleria: { neto:number } ){
    const url = `${base_url}/muebleria`
    return this.http.post(url,muebleria,this.headers)
  }

  actualizarMuebleria( muebleria: Muebleria ){
    const url = `${base_url}/muebleria/${muebleria.uid}`
    return this.http.put(url,muebleria,this.headers)
  }

  eliminarMuebleria( _id: string ){
    const url = `${base_url}/muebleria/${_id}`
    return this.http.delete(url,this.headers)
  }


}
