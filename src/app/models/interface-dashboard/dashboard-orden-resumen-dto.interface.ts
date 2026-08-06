

export interface DashboardOrdenResumenDTO {
    id: number;
    clienteId: number | null;
    cliente: string;
    total: number;
    fechaEntrega: string | null;
    estadoOrden: string | null;
    proceso: string | null;
    estadoPago: string | null;
    estadoEntrega: string | null;
}