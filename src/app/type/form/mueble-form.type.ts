import { FormControl, FormGroup } from "@angular/forms";


export type MuebleForm = FormGroup<{
    id: FormControl<number>,
    descripcion: FormControl<string>,
    precioReferencia: FormControl<number>

}>;