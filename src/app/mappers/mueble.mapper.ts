import { MuebleDTO } from "../models/interface-models/muebleDTO.interface";
import { Mueble } from "../models/mueble.model";


export class MuebleMapper{

    static fromDTO(dto: MuebleDTO):Mueble{
        return new Mueble(
            dto.id,
            dto.descripcion,
            dto.precioReferencia,
            dto.disenoMuebleId,
            dto.disenoMuebleNombre,
            dto.disenoMiniaturaUrl,
            dto.activo
        )
    }

    static fromDTOList(dtos: MuebleDTO[]): Mueble[] {
        return dtos.map(dto => this.fromDTO(dto));
    }

    static toDTO(model: Mueble): MuebleDTO{
        return {
            id: model.id,
            descripcion: model.descripcion,
            precioReferencia: model.precioReferencia,
            disenoMuebleId: model.disenoMuebleId,
            disenoMuebleNombre: model.disenoMuebleNombre,
            disenoMiniaturaUrl: model.disenoMuebleMiniaturaUrl,
            activo: model.activo
        }
    }

}