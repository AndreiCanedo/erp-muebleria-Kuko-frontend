import { EstadoEgreso } from "./estado-egreso.enum";
import { FormaPago } from "./forma-pago.enum";

export class Egreso{

    constructor(
        public id:number,
        public nombre:string | null,
        public motivo:string,
        public justificacion:string | null,
        public efectivoEntregado: number | null,
        public monto:number,
        public cambio:number | null,
        public formaPago:FormaPago,
        public estado: EstadoEgreso,
        public fecha:Date | null,
        public fechaCancelacion: Date | null,
        public motivoCancelacion: string | null
    ){}
}

