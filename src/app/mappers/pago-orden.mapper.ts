import { PagoOrdenDTO } from "../models/interface-models/pago-ordenDTO.interface";
import { PagoOrden } from "../models/pago-orden.model";


export class PagoOrdenMapper{

    static fromDTO(dto: PagoOrdenDTO): PagoOrden{
        return new PagoOrden(
            dto.id,
            dto.ordenId,
            dto.monto,
            dto.formaPago,
            dto.tipoPago,
            dto.estado,
            dto.referencia,
            dto.observaciones,
            dto.fechaRegistro ? new Date(dto.fechaRegistro) : null,
            dto.fechaCancelacion ? new Date(dto.fechaCancelacion) : null,
            dto.motivoCancelacion
        )
    }

    static toDTO(model: PagoOrden): PagoOrdenDTO{
        return {
            id: model.id,
            ordenId: model.ordenId,
            monto: model.monto,
            formaPago: model.formaPago,
            tipoPago: model.tipoPago,
            estado: model.estado,
            referencia: model.referencia,
            observaciones: model.observaciones,
            fechaRegistro: model.fechaRegistro?.toISOString() ?? null,
            fechaCancelacion: model.fechaCancelacion?.toISOString() ?? null,
            motivoCancelacion: model.motivoCancelacion
        };
    }

}