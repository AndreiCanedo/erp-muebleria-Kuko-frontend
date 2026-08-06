import { DashboardOrdenResumenDTO } from "./dashboard-orden-resumen-dto.interface";


export interface DashboardOrdenesDTO {
    pendientes: number;
    produccion: number;
    listasParaEntregar: number;
    atrasadas: number;
    proximas: DashboardOrdenResumenDTO[];
}