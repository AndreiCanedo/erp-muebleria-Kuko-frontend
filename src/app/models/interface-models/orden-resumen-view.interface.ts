import { EstadoOrdenCompra } from "../estado-orden-compra.enum";
import { EstadoEntrega } from "../estado-entrega.enum";
import { EstadoPago } from "../estado-pago.enum";
import { Proceso } from "../proceso.enum";

export interface OrdenResumenView {
    id: number;
    cliente: string;
    fecha: Date | null;
    fechaEntrega: Date | null;
    total: number;

    estadoOrden: EstadoOrdenCompra;
    estadoPago: EstadoPago;
    proceso: Proceso;
    estadoEntrega: EstadoEntrega;
}