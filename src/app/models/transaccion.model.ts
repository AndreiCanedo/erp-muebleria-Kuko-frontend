import { NaturalezaFinanciera } from "./naturaleza-financiera.enum";
import { TipoTransaccion } from "./tipo-transaccion.enum";
import { TipoReferencia } from "./tipo-referencia.enum";

export class Transaccion{
    constructor(
        public id: number,
        public monto: number,
        public tipo:TipoTransaccion,
        public netoNuevo: number,
        public netoAnterior: number,
        public descripcion: string,
        public referenciaTipo: TipoReferencia,
        public referenciaId: number,
        public operadorId: string,
        public naturaleza: NaturalezaFinanciera,
        public fecha: Date,
    ){}
}



