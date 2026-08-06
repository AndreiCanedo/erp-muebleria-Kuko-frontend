import { MuebleriaDTO } from "../models/interface-models/muebleriaDTO.interface";
import { Muebleria } from "../models/mueblerias.model";


export class MuebleriaMapper{

    static fromDTO(dto: MuebleriaDTO):Muebleria{
        return new Muebleria(
            dto.id,
            dto.neto,
            dto.totalIngreso,
            dto.totalEgreso
        )
    }    
}