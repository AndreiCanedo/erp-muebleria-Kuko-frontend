export interface DashboardView {
    periodo: DashboardPeriodoView;
    kpis: DashboardKpisView;
    finanzas: DashboardFinanzaPuntoView[];
    cobranza: DashboardCobranzaView;
    ordenes: DashboardOrdenesView;
}

export interface DashboardPeriodoView {
    inicio: Date;
    fin: Date;
    inicioAnterior: Date;
    finAnterior: Date;
}

export interface DashboardKpisView {
    ingresos: number;
    egresos: number;
    balance: number;
    ventas: number;
    saldoPendiente: number;
    ordenesActivas: number;
    tendenciaIngresos: number;
    tendenciaVentas: number;
    tendenciaEgresos: number;
}

export interface DashboardFinanzaPuntoView {
    fecha: Date;
    ingresos: number;
    egresos: number;
    balance: number;
}

export interface DashboardCobranzaView {
    totalVendido: number;
    totalCobrado: number;
    saldoPendiente: number;
    porcentajeCobrado: number;
}

export interface DashboardOrdenResumenView {
    id: number;
    clienteId: number | null;
    cliente: string;
    total: number;
    fechaEntrega: Date | null;
    estadoOrden: string | null;
    proceso: string | null;
    estadoPago: string | null;
    estadoEntrega: string | null;
}

export interface DashboardOrdenesView {
    pendientes: number;
    produccion: number;
    listasParaEntregar: number;
    atrasadas: number;
    proximas: DashboardOrdenResumenView[];
}