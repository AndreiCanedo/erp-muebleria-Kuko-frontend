

export class OrdenDetalle{
    constructor(
        public id:number,
        public cantidad:number,
        public precioUnitario:number,
        public precioTotal:number,

        public ordenId:number,
        public muebleId:number
    ){}
}