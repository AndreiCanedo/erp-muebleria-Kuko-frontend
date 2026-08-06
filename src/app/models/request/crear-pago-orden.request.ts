import { FormaPago } from "../forma-pago.enum";


export interface CrearPagoOrdenRequest {
    ordenId: number;
    monto: number;
    formaPago: FormaPago;
    referencia: string | null;
    observaciones: string | null;
}