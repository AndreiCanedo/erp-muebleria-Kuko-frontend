import { EstadoEntrega } from "../estado-entrega.enum";
import { EstadoOrdenCompra } from "../estado-orden-compra.enum";
import { EstadoPago } from "../estado-pago.enum";
import { Proceso } from "../proceso.enum";
import { OrdenDetalleView } from "./orden-detalle-view.interface";
import { PagoOrdenView } from "./pago-orden-view.interface";

export interface OrdenInfoView {
    id: number;
    clienteId: number;
    cliente: string;

    fecha: string | null;
    fechaEntrega: string | null;
    fechaCancelacion: string | null;
    motivoCancelacion: string | null;

    total: number;

    
    estadoOrden: EstadoOrdenCompra;
    proceso: Proceso;
    estadoPago: EstadoPago;
    estadoEntrega: EstadoEntrega;
    
    detalles: OrdenDetalleView[];
    pagos: PagoOrdenView[];
    
    totalPagado: number;
    saldoPendiente: number;
}