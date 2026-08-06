import { Cliente } from "../models/cliente.model";
import { ClienteDTO } from "../models/interface-models/clienteDTO.interface";


export class ClienteMapper{
    
    static fromDTO(dto: ClienteDTO): Cliente{
        return new Cliente(
            dto.id,
            dto.nombre,
            dto.direccion,
            dto.telefono,
            dto.correo,
            dto.rfc
        )
    }

    static toDTO(model: Cliente): ClienteDTO{
        return {
            id: model.id,
            nombre: model.nombre,
            direccion: model.direccion,
            telefono: model.telefono,
            correo: model.correo,
            rfc: model.rfc
        }
    }
}