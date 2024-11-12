import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  constructor() { }

  isLocalStorageAvailable(): boolean{
    try{
      const test = 'test'
      localStorage.setItem(test,test)
      localStorage.removeItem(test)
      return true;
    }catch(e){
      return false;
    }
  }

  guardarDatos(key:string, data:any):void{
    if(this.isLocalStorageAvailable()){
      localStorage.setItem(key,JSON.stringify(data))
    }
  }

  cargarDatos(key:string):any{
    if(this.isLocalStorageAvailable()){
      const data =localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }

    return null
  }
}
