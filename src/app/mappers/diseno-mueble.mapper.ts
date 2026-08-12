
import { DisenoMueble } from '../models/diseno-mueble.model';
import { DisenoMuebleDTO } from '../models/interface-models/diseno-muebleDTO.interface';

export class DisenoMuebleMapper {

    static fromDTO(dto: DisenoMuebleDTO): DisenoMueble {

        return new DisenoMueble(
            dto.id,
            dto.nombre,
            dto.descripcion,
            dto.categoria,
            dto.imagenUrl,
            dto.miniaturaUrl,
            dto.fechaRegistro ? new Date(dto.fechaRegistro) : null,
            dto.activo
        );
    }

    static fromDTOList(dtos: DisenoMuebleDTO[]): DisenoMueble[] {
        return dtos.map(dto => this.fromDTO(dto));
    }

}