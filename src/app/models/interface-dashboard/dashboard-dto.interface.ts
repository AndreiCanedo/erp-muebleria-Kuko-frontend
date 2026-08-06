import { DashboardCobranzaDTO } from "./dashboard-cobranza-dto.interface";
import { DashboardFinanzaPuntoDTO } from "./dashboard-finanza-punto-dto.interface";
import { DashboardKpisDTO } from "./dashboard-kpis-dto.interface";
import { DashboardOrdenesDTO } from "./dashboard-ordenes-dto.interface";
import { DashboardPeriodoDTO } from "./dashboard-periodo-dto.interface";

export interface DashboardDTO {
    periodo: DashboardPeriodoDTO;
    kpis: DashboardKpisDTO;
    finanzas: DashboardFinanzaPuntoDTO[];
    cobranza: DashboardCobranzaDTO;
    ordenes: DashboardOrdenesDTO;
}