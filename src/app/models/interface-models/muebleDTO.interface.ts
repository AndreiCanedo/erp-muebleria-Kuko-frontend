

export interface MuebleDTO{
    id:number;
    descripcion:string;
    precioReferencia:number;
    disenoMuebleId: number | null;
    disenoMuebleNombre: string | null;
    disenoMiniaturaUrl: string | null;
    activo: boolean;
}