import { OrdenDetalleView } from "../models/interface-models/orden-detalle-view.interface";
import { OrdenDetalleDTO } from "../models/interface-models/orden-detalleDTO.interface";
import { Mueble } from "../models/mueble.model";
import { OrdenDetalle } from "../models/orden-detalle.model";


export class OrdenDetalleMapper{

    static fromDTO(dto:OrdenDetalleDTO):OrdenDetalle{
        return new OrdenDetalle(
            dto.id,
            dto.cantidad,
            dto.precioUnitario,
            dto.precioTotal,
            dto.ordenID,
            dto.muebleID
        )
    }

    static toDTO(model: OrdenDetalle): OrdenDetalleDTO{
        return {
            id: model.id,
            cantidad: model.cantidad,
            precioUnitario: model.precioUnitario,
            precioTotal: model.precioTotal,
            ordenID: model.ordenId,
            muebleID: model.muebleId
        }
    }

    static toView(detalle: OrdenDetalle, mueble: Mueble | null): OrdenDetalleView{
        return {
            muebleId: detalle.muebleId,
            descripcion: mueble?.descripcion ?? 'Mueble no encontrado',
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,

            precioTotal: detalle.cantidad * detalle.precioUnitario
        };
    }

}