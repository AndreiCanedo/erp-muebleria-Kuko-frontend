import { UsuarioDTO } from "../models/interface-models/usuarioDTO.interface";
import { Usuario } from "../models/usuario.model";

export class UsuarioMapper {


    public static fromDTO(dto: UsuarioDTO): Usuario {

        return new Usuario(
            dto.id,
            dto.username,
            dto.firstName,
            dto.lastName,
            dto.country,
            dto.role,
            dto.activo
        );
    }

    public static fromDTOList(dtos: UsuarioDTO[]): Usuario[] {

        return dtos.map(
            dto => UsuarioMapper.fromDTO(dto)
        );
    }
}