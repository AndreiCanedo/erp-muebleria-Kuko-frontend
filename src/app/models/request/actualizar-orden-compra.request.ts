import { CrearOrdenDetalleRequest } from "./crear-orden-detalle.request";

export interface ActualizarOrdenCompraRequest{
    clienteId: number;
    detallesRequest: CrearOrdenDetalleRequest[];
    fechaEntrega: string | null;
}