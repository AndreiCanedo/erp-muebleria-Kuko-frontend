import { Cliente } from "../models/cliente.model";
import { EstadoPagoOrden } from "../models/estado-pago-orden.enum";
import { OrdenDetalleView } from "../models/interface-models/orden-detalle-view.interface";
import { OrdenInfoView } from "../models/interface-models/orden-info-view.interface";
import { PagoOrdenView } from "../models/interface-models/pago-orden-view.interface";
import { OrdenCompra } from "../models/orden-compra.model";

export class OrdenInfoMapper{

    static fromData(orden: OrdenCompra, 
        cliente: Cliente | null, 
        detalles: OrdenDetalleView[], 
        pagos: PagoOrdenView[]): OrdenInfoView{

        const totalPagado = pagos.filter(pago => pago.estado === EstadoPagoOrden.APLICADO)
            .reduce((total, pago) => total + pago.monto, 0);
            
        const saldoPendiente = Math.max(orden.total - totalPagado, 0);
            
        return {
            id: orden.id,
            clienteId: orden.clienteId,
            cliente: cliente?.nombre ?? 'Cliente no encontrado',

            fecha: orden.fecha?.toISOString() ?? null,
            fechaEntrega: orden.fechaEntrega?.toISOString() ?? null,
            fechaCancelacion: orden.fechaCancelacion?.toISOString() ?? null,
            motivoCancelacion: orden.motivoCancelacion,

            total: orden.total,
            totalPagado,
            saldoPendiente,

            estadoOrden: orden.estadoOrden,
            proceso: orden.proceso,
            estadoPago: orden.estadoPago,
            estadoEntrega: orden.estadoEntrega,

            detalles,
            pagos
        };
    }
}