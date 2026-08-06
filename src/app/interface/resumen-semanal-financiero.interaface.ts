import { MetricaSemanalFinanciera } from "./metrica-semanal-financiera.interface";


export interface ResumenSemanalFinanciero {

    gastos: MetricaSemanalFinanciera;

    ingresos: MetricaSemanalFinanciera;

    neto: number;
}