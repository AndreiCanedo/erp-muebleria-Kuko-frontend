import { Pipe, PipeTransform } from '@angular/core';
import { FormaPago } from '../models/forma-pago.enum';

@Pipe({
    name: 'formaPago',
    standalone: true
})
export class FormaPagoPipe implements PipeTransform {

    transform(value: FormaPago | null | undefined): string {

    if (value == null) return 'Sin definir';

    switch (value) {
        case FormaPago.EFECTIVO:
            return 'Efectivo';

        case FormaPago.TARJETA:
            return 'Tarjeta';

        case FormaPago.TRANSFERENCIA:
            return 'Transferencia';

        default:
            return 'Desconocido';
        }
    } 
}