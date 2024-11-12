interface _Muebleria{
    _id:string;
    neto:number;
}

export class Muebleria{
    constructor(
        public uid: string,
        public neto: number
    ){}
}