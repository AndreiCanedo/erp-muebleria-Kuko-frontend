import { DashboardDTO } from "../models/interface-dashboard/dashboard-dto.interface";
import { DashboardFinanzaPuntoView, DashboardOrdenResumenView, DashboardView } from "../models/interface-dashboard/dashboard-view.interface";

export class DashboardMapper {

    public static fromDTO(dto: DashboardDTO): DashboardView {
        return {
            periodo: {
                inicio: this.parseLocalDate(dto.periodo.inicio),
                fin: this.parseLocalDate(dto.periodo.fin),
                inicioAnterior: this.parseLocalDate(dto.periodo.inicioAnterior),
                finAnterior: this.parseLocalDate(dto.periodo.finAnterior)
            },

            kpis: {
                ingresos: Number(dto.kpis.ingresos ?? 0),
                egresos: Number(dto.kpis.egresos ?? 0),
                balance: Number(dto.kpis.balance ?? 0),
                ventas: Number(dto.kpis.ventas ?? 0),
                saldoPendiente: Number(dto.kpis.saldoPendiente ?? 0),
                ordenesActivas: Number(dto.kpis.ordenesActivas ?? 0),
                tendenciaIngresos: Number(dto.kpis.tendenciaIngresos ?? 0),
                tendenciaVentas: Number(dto.kpis.tendenciaVentas ?? 0),
                tendenciaEgresos: Number(dto.kpis.tendenciaEgresos ?? 0)
            },

            finanzas: dto.finanzas.map(
                punto => this.mapFinanzaPunto(punto)
            ),

            cobranza: {
                totalVendido: Number(dto.cobranza.totalVendido ?? 0),
                totalCobrado: Number(dto.cobranza.totalCobrado ?? 0),
                saldoPendiente: Number(dto.cobranza.saldoPendiente ?? 0),
                porcentajeCobrado: Number(dto.cobranza.porcentajeCobrado ?? 0)
            },

            ordenes: {
                pendientes: Number(dto.ordenes.pendientes ?? 0),
                produccion: Number(dto.ordenes.produccion ?? 0),
                listasParaEntregar: Number(dto.ordenes.listasParaEntregar ?? 0),
                atrasadas: Number(dto.ordenes.atrasadas ?? 0),
                proximas: dto.ordenes.proximas.map(orden => this.mapOrdenResumen(orden))
            }
        };
    }

    private static mapFinanzaPunto(punto: DashboardDTO['finanzas'][number]): DashboardFinanzaPuntoView {
        return {
            fecha: this.parseLocalDate(punto.fecha),
            ingresos: Number(punto.ingresos ?? 0),
            egresos: Number(punto.egresos ?? 0),
            balance: Number(punto.balance ?? 0)
        };
    }

    private static mapOrdenResumen(orden: DashboardDTO['ordenes']['proximas'][number]): DashboardOrdenResumenView {
        return {
            id: orden.id,
            clienteId: orden.clienteId,
            cliente: orden.cliente,
            total: Number(orden.total ?? 0),
            fechaEntrega: orden.fechaEntrega ? new Date(orden.fechaEntrega) : null,
            estadoOrden: orden.estadoOrden,
            proceso: orden.proceso,
            estadoPago: orden.estadoPago,
            estadoEntrega: orden.estadoEntrega
        };
    }

    private static parseLocalDate(fecha: string): Date {
        
        const [year, month, day] = fecha.split('-').map(Number);

        return new Date(year, month - 1, day);
    }
}