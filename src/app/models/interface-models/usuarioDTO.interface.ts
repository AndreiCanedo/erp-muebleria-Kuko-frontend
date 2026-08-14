import { Role } from "../role.enum";

export interface UsuarioDTO {

    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    country: string | null;
    role: Role;
    activo: boolean;
}