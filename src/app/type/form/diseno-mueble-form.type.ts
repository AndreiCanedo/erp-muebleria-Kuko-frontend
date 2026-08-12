import { FormControl, FormGroup } from "@angular/forms";
import { CategoriaMueble } from "../../models/categoria-mueble.enum";

export type DisenoMuebleForm = FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    descripcion: FormControl<string>;
    categoria: FormControl<CategoriaMueble>;
    activo: FormControl<boolean>;
}>;