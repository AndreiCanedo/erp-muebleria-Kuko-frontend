import { FormaPago } from "../forma-pago.enum";


export interface ActualizarEgresoRequest {
    nombre: string | null;
    motivo: string;
    justificacion: string | null;
    efectivoEntregado: number | null;
    monto: number;
    cambio: number | null;
    formaPago: FormaPago;
}