

export class Mueble {
    constructor(
        public id:number,
        public descripcion:string,
        public precioReferencia:number,

        public disenoMuebleId: number | null,
        public disenoMuebleNombre: string | null,
        public disenoMuebleMiniaturaUrl: string | null,

        public activo: boolean
    ){}
}