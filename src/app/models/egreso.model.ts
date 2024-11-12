import { Muebleria } from "./mueblerias.model";
import { Transaccion } from "./transaccion.model";


interface _Egreso{
    _id:string;
    nombre:string;
    motivo:string;
    justificacion:string;
    monto:number;
    cambio:number;
    formaPago:number;
    muebleria:Muebleria;
    transaccones:Transaccion[];

}

export class Egreso{

    constructor(
        public id:string,
        public nombre:string,
        public motivo:string,
        public justificacion:string,
        public monto:number,
        public cambio:number,
        public formaPago:string,
        public muebleria:Muebleria,
        public transacciones:Transaccion[]
    ){}

}