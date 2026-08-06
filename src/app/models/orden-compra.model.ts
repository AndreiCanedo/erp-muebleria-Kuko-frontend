import { OrdenDetalle } from "./orden-detalle.model";

import { EstadoOrdenCompra } from "./estado-orden-compra.enum";
import { EstadoEntrega } from "./estado-entrega.enum";
import { EstadoPago } from "./estado-pago.enum";
import { Proceso } from "./proceso.enum";

export class OrdenCompra{
    constructor(
        public id:number,
        public clienteId:number,
        public fecha:Date | null,
        public total:number,
        public detalles:OrdenDetalle[],
        public fechaConfirmacion:Date | null,
        public fechaEntrega:Date | null,
        public fechaCancelacion:Date | null,
        public motivoCancelacion:string | null,
        public estadoOrden: EstadoOrdenCompra,
        public proceso: Proceso,
        public estadoPago: EstadoPago,
        public estadoEntrega: EstadoEntrega

    ){}
}