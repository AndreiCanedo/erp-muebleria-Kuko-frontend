import { CrearOrdenDetalleRequest } from "./crear-orden-detalle.request";

export interface CrearOrdenCompraRequest {
    clienteId: number;
    detallesRequest: CrearOrdenDetalleRequest[];
} 