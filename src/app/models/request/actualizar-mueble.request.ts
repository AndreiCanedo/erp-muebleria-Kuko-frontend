
export interface ActualizarMuebleRequest {

    descripcion: string;
    precioReferencia: number;
    disenoMuebleId: number | null;
    activo: boolean;
}