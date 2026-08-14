import { Role } from "../role.enum";


export interface CrearUsuarioRequest {

    username: string;
    password: string;
    passwordConfirm: string;
    firstName: string | null;
    lastName: string | null;
    country: string | null;
    role: Role;
}