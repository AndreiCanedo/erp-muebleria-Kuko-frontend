import { ClienteView } from "../interface/cliente-view.interface";
import { Cliente } from "../models/cliente.model";


export class ClienteViewMapper{

    static toTable(cliente: Cliente): ClienteView{

        return {
            id: cliente.id,
            nombre: cliente.nombre
        };
    }
}