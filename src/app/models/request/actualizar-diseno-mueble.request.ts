import { CategoriaMueble } from '../categoria-mueble.enum';

export interface ActualizarDisenoMuebleRequest {
    nombre: string;
    descripcion: string | null;
    categoria: CategoriaMueble;
    imagenUrl: string;
    miniaturaUrl: string | null;
    activo: boolean;
}