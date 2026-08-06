import { MuebleDTO } from "../models/interface-models/muebleDTO.interface";
import { Mueble } from "../models/mueble.model";


export class MuebleMapper{

    static fromDTO(dto: MuebleDTO):Mueble{
        return new Mueble(
            dto.id,
            dto.descripcion,
            dto.precioReferencia
        )
    }

    static toDTO(model: Mueble): MuebleDTO{
        return {
            id: model.id,
            descripcion: model.descripcion,
            precioReferencia: model.precioReferencia
        }
    }

}