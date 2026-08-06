import { CrearOrdenDetalleRequest } from "./crear-orden-detalle.request";

export interface CrearOrdenCompraRequest {
    clienteId: number;
    fechaEntrega: string | null;
    detallesRequest: CrearOrdenDetalleRequest[];
} 