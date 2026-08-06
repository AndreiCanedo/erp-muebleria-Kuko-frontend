import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})


export class ModalService {

    private stacks: number[] = [];

    private idActual = 0;

    registrar(): number{
        const id = ++this.idActual;

        this.stacks.push(id);

        if(this.stacks.length === 1){

            //nos ayuda a bloquear los scroll
            //NOTA: no olvidar quitar el hidden al cerrar
            document.body.style.overflow = 'hidden';
            
        }

        return id;
    }

    eliminar(id: number): void{

        this.stacks = this.stacks.filter(x => x !== id);

        if(this.stacks.length === 0){
            document.body.style.overflow = '';
        }
    }

    esElUltimo(id:number):boolean{
        return this.stacks[this.stacks.length - 1 ] === id;
    }

}