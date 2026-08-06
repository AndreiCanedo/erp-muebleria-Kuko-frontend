import { PagoOrdenView } from "../models/interface-models/pago-orden-view.interface";
import { PagoOrden } from "../models/pago-orden.model";

export class PagoOrdenViewMapper {

    static fromModel(pago: PagoOrden): PagoOrdenView{

        return{
            id: pago.id,
            monto: pago.monto,
            formaPago: pago.formaPago,
            tipoPago: pago.tipoPago,
            estado: pago.estado,
            referencia: pago.referencia,
            observaciones: pago.observaciones,
            fechaRegistro: pago.fechaRegistro?.toISOString() ?? '',
            fechaCancelacion: pago.fechaCancelacion?.toISOString() ?? null,
            motivoCancelacion: pago.motivoCancelacion
        }

    }

}