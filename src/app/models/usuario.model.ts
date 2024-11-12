import { Role } from "./role.enum";


export class Usuario{
    
    constructor(
        public firstName:string,
        public lastName:string,
        public username:string,
        public password:string,
        public country:string,
        public uid:number,
        public role:Role

    ){}

}