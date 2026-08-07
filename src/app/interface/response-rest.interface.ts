

export interface ResponseRest<T>{
    status: string;
    code: string;
    message: string;
    data: T[];

    page?: number | null;
    size?: number | null;
    totalElements?: number | null;
    totalPages?: number | null;
}