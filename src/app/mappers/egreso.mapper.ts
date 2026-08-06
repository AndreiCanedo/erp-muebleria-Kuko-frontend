import { Egreso } from "../models/egreso.model";
import { EgresoDTO } from "../models/interface-models/egresoDTO.interface";


export class EgresoMapper{

    static fromDTO(dto: EgresoDTO):Egreso{
        return new Egreso(
            dto.id,
            dto.nombre,
            dto.motivo,
            dto.justificacion,
            dto.efectivoEntregado,
            dto.monto,
            dto.cambio,
            dto.formaPago,
            dto.estado,
            dto.fecha ? new Date(dto.fecha) : null,
            dto.fechaCancelacion ? new Date(dto.fechaCancelacion) : null,
            dto.motivoCancelacion
        );
    }
    

    static toDTO(model: Egreso): EgresoDTO {
        return {
            id: model.id,
            nombre: model.nombre,
            motivo: model.motivo,
            justificacion: model.justificacion,
            efectivoEntregado: model.efectivoEntregado,
            monto: model.monto,
            cambio: model.cambio,
            formaPago: model.formaPago,
            estado: model.estado,
            fecha: model.fecha ? model.fecha?.toISOString() : null,
            fechaCancelacion: model.fechaCancelacion ? model.fechaCancelacion?.toISOString() : null,
            motivoCancelacion: model.motivoCancelacion
        };
    }
}