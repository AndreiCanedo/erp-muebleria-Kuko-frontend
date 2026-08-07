import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  private readonly platformId = inject(PLATFORM_ID);

  private get disponible(): boolean{
    return isPlatformBrowser(this.platformId);
  }

  public guardar<T>(key:string, value: T): void{
    if(!this.disponible) return;

    localStorage.setItem(key, JSON.stringify(value));
  }

  obtener<T>(key:string): T | null{
    if(!this.disponible) return null;

    const valor = localStorage.getItem(key);

    if(!valor) return null;

    try{
      return JSON.parse(valor) as T;
    }catch{
      return null;
    }

  }

  eliminar(key: string): void{
    if(!this.disponible) return;

    localStorage.removeItem(key);
  }

  limpiar(): void{
    if(!this.disponible) return;

    localStorage.clear();
  }
}
