import { FormaPago } from "../forma-pago.enum";


export interface IngresoDTO{
    id: number;
    ordenId: number;
    monto: number;
    formaPago:FormaPago;
    fecha:string | null;
}