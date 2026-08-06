import { EstadoPagoOrden } from "../estado-pago-orden.enum";
import { FormaPago } from "../forma-pago.enum";
import { TipoPagoOrden } from "../tipo-pago-orden.enum";

export interface PagoOrdenDTO{
    id: number;
    ordenId: number;
    monto: number;
    formaPago: FormaPago;
    tipoPago: TipoPagoOrden;
    estado: EstadoPagoOrden;
    referencia: string | null;
    observaciones: string | null;
    fechaRegistro: string | null;
    fechaCancelacion: string | null;
    motivoCancelacion: string | null;

}