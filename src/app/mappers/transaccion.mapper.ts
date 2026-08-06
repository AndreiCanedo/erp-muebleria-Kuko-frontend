import { TransaccionDTO } from "../models/interface-models/transaccionDTO.interface";
import { NaturalezaFinanciera } from "../models/naturaleza-financiera.enum";
import { TipoReferencia } from "../models/tipo-referencia.enum";
import { Transaccion } from "../models/transaccion.model";


export class TransaccionMapper{
    
    static fromDTO(dto: TransaccionDTO): Transaccion{
        return new Transaccion(
            dto.id,
            dto.monto ?? 0,
            dto.tipo,
            dto.netoNuevo ?? 0,
            dto.netoAnterior ?? 0,
            dto.descripcion ?? '',
            dto.referenciaTipo ?? TipoReferencia.AJUSTE_MANUAL,
            dto.referenciaId ?? 0,
            dto.operadorId,
            dto.naturaleza ?? NaturalezaFinanciera.NEUTRO,
            dto.fecha ? new Date(dto.fecha) : new Date()
        );
    }
}