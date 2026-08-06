import { ClienteDTO } from "./interface-models/clienteDTO.interface";

export class Cliente{

    constructor(
        public id:number,
        public nombre:string,
        public direccion:string,
        public telefono:string,
        public correo:string,
        public rfc:string | null
    ){}
}