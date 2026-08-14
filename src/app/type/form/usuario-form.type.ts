import { FormControl, FormGroup } from "@angular/forms";
import { Role } from "../../models/role.enum";


export type UsuarioForm = FormGroup<{

    id: FormControl<number>;
    username: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    country: FormControl<string>;
    role: FormControl<Role>;
    activo: FormControl<boolean>;
    password: FormControl<string>;
    passwordConfirm: FormControl<string>;
}>;