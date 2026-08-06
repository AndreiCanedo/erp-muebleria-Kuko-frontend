import { NaturalezaFinanciera } from "../naturaleza-financiera.enum";
import { TipoTransaccion } from "../tipo-transaccion.enum";
import { TipoReferencia } from "../tipo-referencia.enum";

export interface TransaccionDTO {
    id: number;
    monto: number;
    tipo: TipoTransaccion;
    netoNuevo: number;
    netoAnterior: number;
    descripcion: string;
    referenciaTipo: TipoReferencia;
    referenciaId: number;
    operadorId: string;
    naturaleza: NaturalezaFinanciera;
    fecha: string;
}