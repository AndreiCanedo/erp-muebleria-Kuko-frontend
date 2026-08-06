import { OrdenCompraDTO } from "../models/interface-models/orden-compraDTO.interface";

import { OrdenCompra } from "../models/orden-compra.model";
import { OrdenDetalleMapper } from "./orden-detalle.mapper";


export class OrdenCompraMapper{

    static fromDTO(dto: OrdenCompraDTO): OrdenCompra{
        return new OrdenCompra(
            dto.id,
            dto.clienteId,
            this.parseLocalDateTime(dto.fecha),
            dto.total,
            (dto.detalles ?? []).map(detalle => OrdenDetalleMapper.fromDTO(detalle)),
            this.parseLocalDateTime(dto.fechaConfirmacion),
            this.parseLocalDate(dto.fechaEntrega),
            this.parseLocalDateTime(dto.fechaCancelacion),
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

            fechaConfirmacion: model.fechaConfirmacion?.toISOString() ?? null,    
            fechaEntrega: model.fechaEntrega ? this.formatLocalDate(model.fechaEntrega) : null,
            fechaCancelacion: model.fechaCancelacion?.toISOString() ?? null,
            motivoCancelacion: model.motivoCancelacion,

            estadoOrden: model.estadoOrden,
            proceso: model.proceso,
            estadoPago: model.estadoPago,
            estadoEntrega: model.estadoEntrega
        };
    }

    private static parseLocalDate(fecha: string | null): Date | null {

        if (!fecha) return null;

        const [year, month, day] =fecha.substring(0, 10).split('-').map(Number);

        return new Date(year, month - 1, day);
    }

    private static parseLocalDateTime(fecha: string | null): Date | null {

        return fecha ? new Date(fecha) : null;
    }

    private static formatLocalDate(fecha: Date): string {

        const year = fecha.getFullYear();

        const month = String(fecha.getMonth() + 1).padStart(2, '0');

        const day =String(fecha.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

}