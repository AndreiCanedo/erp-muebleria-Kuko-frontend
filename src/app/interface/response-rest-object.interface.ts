export interface ResponseRestObject<T> {
    status: string;
    code: string;
    message: string;
    data: T;
}