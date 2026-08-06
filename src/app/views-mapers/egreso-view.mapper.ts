import { Egreso } from "../models/egreso.model";
import { UtilService } from "../services/util.service";


export class EgresoViewMapper {
    static toTable( egreso: Egreso){
        return {
            id: egreso.id,
            nombre: egreso.nombre,
            motivo: egreso.motivo,
            justificacion: egreso.justificacion,
            monto: egreso.monto,
            cambio: egreso.cambio,
            formaPago: egreso.formaPago
        }
    }
}