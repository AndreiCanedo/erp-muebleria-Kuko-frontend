import { Role } from "./role.enum";


export class Usuario{
    
    constructor(
        public id:number,
        public username:string,
        
        public firstName:string | null,
        public lastName:string | null,
        public country:string | null,
        
        public role:Role,
        public activo: boolean

    ){}

}