import { Role } from "../role.enum";


export interface ActualizarUsuarioRequest {

    username: string;
    firstName: string | null;
    lastName: string | null;
    country: string | null;
    role: Role;
    activo: boolean;
}