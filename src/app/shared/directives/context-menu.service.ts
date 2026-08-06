import { ElementRef, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {

  private readonly menuAbierto = signal<string | null>(null);

  private readonly triggers = new Map<string, ElementRef<HTMLElement>>();

  //Abre el menu o lo cierra si esta abierto
  public toggle(id: string): void{
    this.menuAbierto.update(actual => actual === id ? null : id);
  }

  //Fuerza la apertura de un menu
  public abrir(id: string): void{
    this.menuAbierto.set(id);
  }

  //Cierra cualquier menu abierto
  public cerrar(): void{
    this.menuAbierto.set(null);
  }

  //Indica si un menu esta abierto
  public estaAbierto(id: string): boolean{
    return this.menuAbierto() === id;
  }

  //Devuelve el id del menu abierto
  public obtenerMenuAbierto(): string | null {
    return this.menuAbierto();
  }

  public registrarTrigger(id: string, trigger: ElementRef<HTMLElement>):void{
    this.triggers.set(id, trigger);
  }

  public eliminarTrigger(id:string): void{
    this.triggers.delete(id);
  }

  public obtenerTrigger(id:string): ElementRef<HTMLElement> | null {
    return this.triggers.get(id) ?? null;
  }
  
}
