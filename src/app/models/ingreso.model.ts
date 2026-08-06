import { FormaPago } from "./forma-pago.enum"

export class Ingreso{
    constructor(
        public id:number,
        public ordenId:number,
        public monto:number,
        public formaPago:FormaPago,
        public fecha:Date
    ){}
}