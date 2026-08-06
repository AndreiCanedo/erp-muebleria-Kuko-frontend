import { OrdenCompraDTO } from "../models/interface-models/orden-compraDTO.interface";

import { OrdenCompra } from "../models/orden-compra.model";
import { OrdenDetalleMapper } from "./orden-detalle.mapper";


export class OrdenCompraMapper{

    static fromDTO(dto: OrdenCompraDTO): OrdenCompra{
        return new OrdenCompra(
            dto.id,
            dto.clienteId,
            dto.fecha ? new Date(dto.fecha) : null,
            dto.total,
            (dto.detalles ?? []).map(detalle => OrdenDetalleMapper.fromDTO(detalle)),
            dto.fechaEntrega  ? new Date(dto.fechaEntrega) : null,
            dto.fechaCancelacion ? new Date(dto.fechaCancelacion) : null,
            dto.motivoCancelacion,
            dto.estadoOrden,
            dto.proceso,
            dto.estadoPago,
            dto.estadoEntrega
        )
    }

    static toDTO(model: OrdenCompra): OrdenCompraDTO{
        return {
            id: model.id,
            clienteId: model.clienteId,
            fecha: model.fecha?.toISOString() ?? null,
            total: model.total,
            detalles: model.detalles
                .map(detalle => OrdenDetalleMapper.toDTO(detalle)),

            fechaEntrega: model.fechaEntrega?.toISOString() ?? null,
            fechaCancelacion: model.fechaCancelacion?.toISOString() ?? null,
            motivoCancelacion: model.motivoCancelacion,

            estadoOrden: model.estadoOrden,
            proceso: model.proceso,
            estadoPago: model.estadoPago,
            estadoEntrega: model.estadoEntrega
        };
    }

}