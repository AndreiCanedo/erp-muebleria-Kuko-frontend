import { inject, Injectable } from "@angular/core";
import moment from "moment";

import { TransaccionService } from "./transaccion.service";
import { Transaccion } from "../models/transaccion.model";

import { TipoReferencia } from "../models/tipo-referencia.enum";
import { NaturalezaFinanciera } from "../models/naturaleza-financiera.enum";
import { ResumenSemanalFinanciero } from "../interface/resumen-semanal-financiero.interaface";


@Injectable({
    providedIn: 'root'
})
export class FinanzasMetricsService {

    private transaccionService = inject(TransaccionService);

    private readonly FORMATO_SEMANA = 'YYYY-MM-DD';


    ///////////////////////////////////////////////////
    ////////////////CACHE INTERNO//////////////////////
    ///////////////////////////////////////////////////
    
    /* private cacheSemanal? : {
        gastosOperativos: Record<string, number>,//Gasto real que viene de Tipo
        ingresosOperativos: Record<string, number>,//Ingreso real que viene de Tipo
        
        flujoIngresos: Record<string, number>,//Gastos real +/- Ajustes que vienen de Naturaleza Ingreso
        flujoGastos: Record<string, number>,//Gasto Real +/- Ajustes que vienen de Naturaleza Egreso
        
        ajustes: Record<string, number>,//Suma total de Ajuste tanto Engreso como Egresos
        
        ajustesEgresos: Record<string, number>,//Suma total de Ajuste de egresos
        ajustesIngresos: Record<string, number>,//Suma total de Ajustes de ingreso
    };*/

    private cacheSemanal : Record<string, ResumenSemanalFinanciero> ={};

    ///////////////////////////////////////////////////
    //////////////////INIT CACHE//////////////////////
    ///////////////////////////////////////////////////

    constructor(){
        this.transaccionService.transaccionesObservable$
            .subscribe((transacciones) => {
                this.cacheSemanal = this.generarMetricas(transacciones);
            })
    }

    ///////////////////////////////////////////////////
    ////////////////KPIS PUBLICOS//////////////////////
    ///////////////////////////////////////////////////

    obtenerGastoOperativosSemanaActual(): number {
        //porque dejo de ser undifined a {}
        //if(!this.cacheSemanal) return 0;

        const semana = this.obtenerSemanaActual();

       // return this.cacheSemanal.gastosOperativos[semana] ?? 0;
        return this.cacheSemanal[semana]?.gastos.bruto ?? 0;
    }

    obtenerIngresosOperativosSemanaActual(): number {
        
        //if(!this.cacheSemanal) return 0;
        
        const semana = this.obtenerSemanaActual();

        //return this.cacheSemanal.ingresosOperativos[semana] ?? 0;
        return this.cacheSemanal[semana]?.ingresos.bruto ?? 0;
    }

    obtenerFlujoIngresoSemanaActual(): number {

        //if(!this.cacheSemanal) return 0;

        const semana = this.obtenerSemanaActual();

        //return this.cacheSemanal.flujoIngresos[semana] ?? 0;
        return this.cacheSemanal[semana]?.ingresos.neto ?? 0;
    }

    obtenerFlujoEgresoSemanaActual(): number {

        //if(!this.cacheSemanal) return 0;

        const semana = this.obtenerSemanaActual();

        //return this.cacheSemanal.flujoGastos[semana] ?? 0;
        return this.cacheSemanal[semana]?.gastos.neto ?? 0;
    }

    /*obtenerAjustesSemanaActual(): number {

        if(!this.cacheSemanal) return 0;

        const semana = this.obtenerSemanaActual();

        return this.cacheSemanal.ajustes[semana] ?? 0;
    }*/

    obtenerAjusteIngresoSemanaActual(): number {
        //if(!this.cacheSemanal) return 0;

        const semana = this.obtenerSemanaActual();

        //return this.cacheSemanal.ajustesIngresos[semana] ?? 0;
        return this.cacheSemanal[semana]?.ingresos.ajustes ?? 0;
    }

    obtenerAjusteEgresoSemanaActual(): number {
        //if(!this.cacheSemanal) return 0;

        const semana = this.obtenerSemanaActual();

        //return this.cacheSemanal.ajustesEgresos[semana] ?? 0;
        return this.cacheSemanal[semana]?.gastos.ajustes ?? 0;
    }

    obtenerUtilidadesSemanaActual(): number {
        return (
            this.obtenerFlujoIngresoSemanaActual()
            -
            this.obtenerFlujoEgresoSemanaActual()
        );
    }

    ///////////////////////////////////////////////////
    ////////////////GENERAR METRICAS///////////////////
    ///////////////////////////////////////////////////
    //ANTES
    /*private generarMetricas(transacciones: Transaccion[]){

        const gastosOperativos: Record<string, number> = {};
        const ingresosOperativos: Record<string, number> = {};
        
        const flujoIngresos: Record<string, number> = {};
        const flujoGastos: Record<string, number> = {};
        
        const ajustes: Record<string, number> = {};
        const ajustesEgresos: Record<string, number> = {};
        const ajustesIngresos: Record<string, number> = {};

        transacciones.forEach((t) => {

            const semana = moment(t.fecha)
                .startOf('isoWeek')
                .format('YYYY-MM-DD');
        

            const monto = this.obtenerMontoReal(t);

            ///////////////////////////////////////////////////
            //////////////////KPIS OPERATIVOS//////////////////
            ///////////////////////////////////////////////////

            if(this.esOperacionEgreso(t)){
                gastosOperativos[semana] = (gastosOperativos[semana] || 0) + monto;
            }
            
            if(this.esOperacionIngreso(t)){
                ingresosOperativos[semana] = (ingresosOperativos[semana] || 0) + monto;
            }

            ///////////////////////////////////////////////////
            ///////////////////FLUJO FINANCIEROS///////////////
            ///////////////////////////////////////////////////

            if(this.esNaturalezaIngreso(t)){
                flujoIngresos[semana] = (flujoIngresos[semana] || 0) + monto;
            }

            if(this.esNaturalezaEgreso(t)){
                flujoGastos[semana] = (flujoGastos[semana] || 0) + monto;
            }

            ///////////////////////////////////////////////////
            ////////////////////////AJUSTES////////////////////
            ///////////////////////////////////////////////////

            if(
                this.esAjuste(t)
            ){
                ajustes[semana] = (ajustes[semana] || 0) + monto;
            }

            if( 
                
                this.esNaturalezaEgreso(t) &&
                this.esAjusteEgreso(t)
            ){
                ajustesEgresos[semana] = (ajustesEgresos[semana] || 0) + monto; 
            }

            if(
                this.esNaturalezaIngreso(t) &&
                this.esAjusteIngreso(t)
            ){
                ajustesIngresos[semana] = (ajustesIngresos[semana] || 0) + monto; 
            }

        });

        return {
            gastosOperativos,
            ingresosOperativos,
            flujoIngresos,
            flujoGastos,
            ajustes,
            ajustesEgresos,
            ajustesIngresos
        };

    }
    */
    //Despues
    private generarMetricas(transacciones: Transaccion[]): Record<string, ResumenSemanalFinanciero>{
    
        const resumen : Record<string, ResumenSemanalFinanciero> = {};
        
        transacciones.forEach((t) => {

            const semana = moment(t.fecha)
                .startOf('isoWeek')
                .format(this.FORMATO_SEMANA);

            const monto = this.obtenerMontoReal(t);

            //Crear estructura Vacia si no existe

            if(!resumen[semana]){
                resumen[semana] = this.crearResumenVacio();
            }

            ///////////////////////////////////////////////
            //////////////////GASTOS///////////////////////
            //////////////////////////////////////////////

            if(this.esOperacionEgreso(t)){
                resumen[semana].gastos.bruto += monto;
            }

            if(this.esNaturalezaEgreso(t) && this.esAjusteEgreso(t)){
                resumen[semana].gastos.ajustes += monto;
            }

            /////////////////////////////////////////////
            ////////////////INGRESOS/////////////////////
            ////////////////////////////////////////////

            if(this.esOperacionIngreso(t)){
                resumen[semana].ingresos.bruto += monto;
            }

            if(this.esNaturalezaIngreso(t) && this.esAjusteIngreso(t)){
                resumen[semana].ingresos.ajustes += monto;
            }

            //////////////Netos

            /*resumen[semana].gastos.neto = this.calcularNeto(
                resumen[semana].gastos.bruto,
                resumen[semana].gastos.ajustes
            );

            resumen[semana].ingresos.neto = this.calcularNeto(
                resumen[semana].ingresos.bruto,
                resumen[semana].ingresos.ajustes
            );

            ////////////////////UTILIDAD*/

            this.recalcularResumen(resumen[semana]);
        });

        return resumen;

    }
    ///////////////////////////////////////////////////
    ////////////////////VALIDACION ////////////////////
    ///////////////////////////////////////////////////

    obtenerPorcentajeCambioGastoSemanal(): number {
        //porque dejo de ser undifined a {}
        //if(!this.cacheSemanal) return 0;

        const semanaActual = this.obtenerSemanaActual();

        const semanaPasada = this.obtenerSemanaPasada();

        const actual = this.cacheSemanal[semanaActual]?.gastos.bruto || 0;

        const pasada = this.cacheSemanal[semanaPasada]?.gastos.bruto || 0;

        if(pasada === 0) return 0;

        return ((actual - pasada) / pasada) * 100;
    }

    ///////////////////////////////////////////////////
    //////////////////HELPERS//////////////////////////
    ///////////////////////////////////////////////////

    private obtenerSemanaActual(): string{
        return moment()
            .startOf('isoWeek')
            .format(this.FORMATO_SEMANA);
    }

    private obtenerSemanaPasada(): string{
        return moment()
            .subtract(1,'week')
            .startOf('isoWeek')
            .format(this.FORMATO_SEMANA)
    }

    private obtenerMontoReal(t:Transaccion): number {
        return (
            t.netoNuevo - t.netoAnterior
        );
    }

    /*private calcularNeto(bruto: number, ajustes: number): number{
        return bruto + ajustes;
    }*/

    private recalcularResumen(resumen: ResumenSemanalFinanciero): void{
        resumen.gastos.neto = resumen.gastos.bruto + resumen.gastos.ajustes;
        resumen.ingresos.neto = resumen.ingresos.bruto + resumen.ingresos.ajustes;
        resumen.neto = resumen.ingresos.neto - resumen.gastos.neto;
    }

    private crearResumenVacio(): ResumenSemanalFinanciero{
        return {
            gastos: {
                bruto: 0,
                ajustes: 0,
                neto : 0
            },
            ingresos: {
                bruto: 0,
                ajustes: 0,
                neto : 0
            },
            neto: 0
        }
    }

    ///////////////LIMPIAR CACHE

    clearCache(): void {
        this.cacheSemanal = {};
        //deja de ser undefined porque el cache siempre existira
        //this.cacheSemanal = undefined;
    }

    ////////////////////Para reducer los If

    private esAjuste(t:Transaccion): boolean{
        return [
            TipoReferencia.AJUSTE_DELETE_EGRESO,
            TipoReferencia.AJUSTE_DELETE_INGRESO,
            TipoReferencia.AJUSTE_UPDATE_EGRESO,
            TipoReferencia.AJUSTE_UPDATE_INGRESO,
            TipoReferencia.AJUSTE_MANUAL
        ].includes(t.referenciaTipo);
    }

    private esAjusteEgreso(t:Transaccion): boolean{
        return [
            TipoReferencia.AJUSTE_DELETE_EGRESO,
            TipoReferencia.AJUSTE_UPDATE_EGRESO
        ].includes(t.referenciaTipo);
    }

    private esAjusteIngreso(t:Transaccion): boolean{
        return [
            TipoReferencia.AJUSTE_DELETE_INGRESO,
            TipoReferencia.AJUSTE_UPDATE_INGRESO
        ].includes(t.referenciaTipo);
    }

    private esOperacionEgreso(t:Transaccion): boolean{
        return t.referenciaTipo === TipoReferencia.EGRESO;
    }

    private esOperacionIngreso(t:Transaccion): boolean{
        return t.referenciaTipo === TipoReferencia.INGRESO;
    }

    private esNaturalezaIngreso(t:Transaccion):boolean{
        return t.naturaleza === NaturalezaFinanciera.INGRESO;
    }

    private esNaturalezaEgreso(t:Transaccion): boolean{
        return t.naturaleza === NaturalezaFinanciera.EGRESO;
    }
}
