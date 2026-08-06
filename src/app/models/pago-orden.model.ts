import { EstadoPagoOrden } from "./estado-pago-orden.enum";
import { FormaPago } from "./forma-pago.enum";
import { TipoPagoOrden } from "./tipo-pago-orden.enum";


export class PagoOrden{
    constructor(
        public id: number,
        public ordenId: number,
        public monto: number,
        public formaPago: FormaPago,
        public tipoPago: TipoPagoOrden,
        public estado: EstadoPagoOrden,
        public referencia: string | null,
        public observaciones: string | null,
        public fechaRegistro: Date | null,
        public fechaCancelacion: Date | null,
        public motivoCancelacion: string | null
    ){}
}