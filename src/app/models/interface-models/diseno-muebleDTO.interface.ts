import { CategoriaMueble } from '../categoria-mueble.enum';

export interface DisenoMuebleDTO {

    id: number;
    nombre: string;
    descripcion: string | null;
    categoria: CategoriaMueble;
    imagenUrl: string;
    miniaturaUrl: string;
    fechaRegistro: string | null;
    activo: boolean;

}