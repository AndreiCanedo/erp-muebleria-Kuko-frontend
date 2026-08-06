import { OrdenCompra } from '../models/orden-compra.model';
import { Cliente } from '../models/cliente.model';

import { OrdenResumenView } from '../models/interface-models/orden-resumen-view.interface'

export class OrdenResumenMapper {

    static fromOrden(orden: OrdenCompra, cliente: Cliente | null): OrdenResumenView {
        return {
            id: orden.id,
            cliente: cliente?.nombre ?? 'Cliente no encontrado', // temporal
            fecha: orden.fecha,
            fechaEntrega: orden.fechaEntrega,
            total: orden.total,
            estadoOrden: orden.estadoOrden,
            proceso: orden.proceso,
            estadoPago: orden.estadoPago,
            estadoEntrega: orden.estadoEntrega
        };
    }

}