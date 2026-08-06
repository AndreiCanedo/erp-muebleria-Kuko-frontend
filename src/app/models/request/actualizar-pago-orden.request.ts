import { FormaPago } from "../forma-pago.enum";

export interface ActualizarPagoOrdenRequest {
    formaPago: FormaPago;
    referencia: string | null;
    observaciones: string | null;
}