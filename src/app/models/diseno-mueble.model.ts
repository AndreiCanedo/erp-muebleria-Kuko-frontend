import { CategoriaMueble } from "./categoria-mueble.enum";


export class DisenoMueble {

    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string | null,
        public categoria: CategoriaMueble,
        public imagenUrl: string,
        public miniaturaUrl: string,
        public fechaRegistro: Date | null,
        public activo: boolean
    ) {}

}