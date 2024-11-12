import { TipoFactura } from "./tipo-factura.enum";


interface _Transaccion{
    _id:string
    netoActual:number
    netoNuevo:number
    fecha:Date
    tipo: TipoFactura
}

export class Transaccion{
    constructor(
        public uid: string,
        public netoActual: number,
        public netoNuevo: number,
        public fecha: Date,
        public tipo: TipoFactura
    ){}
}