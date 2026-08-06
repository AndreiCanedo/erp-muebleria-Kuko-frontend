import { EstadoEgreso } from "../estado-egreso.enum";
import { FormaPago } from "../forma-pago.enum";


export interface EgresoDTO{
    id: number;
    nombre: string | null;
    motivo: string;
    justificacion: string | null;
    efectivoEntregado: number | null;
    monto: number;
    cambio: number | null;
    formaPago: FormaPago;
    estado: EstadoEgreso;
    fecha: string | null;
    fechaCancelacion: string | null;
    motivoCancelacion: string | null;
}