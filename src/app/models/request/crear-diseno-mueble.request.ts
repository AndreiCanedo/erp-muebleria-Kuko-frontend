import { CategoriaMueble } from '../categoria-mueble.enum';

export interface CrearDisenoMuebleRequest {
    nombre: string;
    descripcion: string | null;
    categoria: CategoriaMueble;
    imagenUrl: string;
    miniaturaUrl: string | null;
}