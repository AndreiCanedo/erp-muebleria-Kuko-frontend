/**
    Ordena una colección de elementos por fecha de forma descendente.

    El elemento con la fecha mas reciente aparecera primero.
    Los elementos sin fecha (null o undefined) se colocan al final.

    @typeParam T Tipo de elemento de la colección.
    @param items Colección a ordenar.
    @param obtenerFecha Función que devuelve la fecha del elemento.
    @returns Nueva colección ordenada sin modificar la original.
 */
export function ordenarPorFechaDescendente<T>(items: T[],
    obtenerFecha: (item: T) => Date | string | null | undefined): T[] {

    return [...items].sort((a, b) => {

        const fechaA = obtenerFecha(a);
        const fechaB = obtenerFecha(b);

        const tiempoA = fechaA ? new Date(fechaA).getTime() : 0;

        const tiempoB = fechaB ? new Date(fechaB).getTime() : 0;

        return tiempoB - tiempoA;

    });

}