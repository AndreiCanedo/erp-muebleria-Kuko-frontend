import { FormControl, FormGroup } from "@angular/forms";
import { FormaPago } from "../../models/forma-pago.enum";


export type EgresoForm = FormGroup<{
    nombre: FormControl<string>;
    motivo: FormControl<string>;
    justificacion: FormControl<string>;
    formaPago: FormControl<FormaPago>;
    monto: FormControl<number>;
    efectivoEntregado: FormControl<number | null>;
    cambio: FormControl<number | null>;
}>;