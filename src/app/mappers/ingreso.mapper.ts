import { Ingreso } from "../models/ingreso.model";
import { IngresoDTO } from "../models/interface-models/ingresoDTO.interface";


export class IngresoMapper{
    
    static fromDTO(dto: IngresoDTO): Ingreso{
        return new Ingreso(
            dto.id,
            dto.ordenId,
            dto.monto,
            dto.formaPago,
            dto.fecha ? new Date(dto.fecha) : new Date()
        )
    }
    
    static toDTO(model: Ingreso): IngresoDTO{
        return {
            id: model.id,
            ordenId: model.ordenId,
            monto: model.monto,
            formaPago: model.formaPago,
            fecha: model.fecha ? model.fecha?.toISOString() : null
        };
    }
}