import { FormControl, FormGroup } from '@angular/forms';

export type ClienteForm = FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    direccion: FormControl<string>;
    correo: FormControl<string>;
    telefono: FormControl<string>;
    rfc: FormControl<string>;
}>;