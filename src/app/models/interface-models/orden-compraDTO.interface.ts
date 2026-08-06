import { OrdenDetalleDTO } from "./orden-detalleDTO.interface";

import { EstadoOrdenCompra } from "../estado-orden-compra.enum";
import { EstadoEntrega } from "../estado-entrega.enum";
import { EstadoPago } from "../estado-pago.enum";
import { Proceso } from "../proceso.enum";

export interface OrdenCompraDTO{
        id:number;
        clienteId:number;
        fecha:string | null;
        total:number;
        detalles:OrdenDetalleDTO[];
        
        fechaEntrega:string | null;
        fechaCancelacion:string | null;
        motivoCancelacion:string | null;
        
        estadoOrden: EstadoOrdenCompra;
        proceso: Proceso;
        estadoPago: EstadoPago;
        estadoEntrega: EstadoEntrega;
} 