

export interface ResponseRest<T>{
    status: string;
    code: string;
    message: string;
    data: T;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
}