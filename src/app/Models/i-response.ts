export interface IResponse<T> {
    Data: T;
    Error: IError;
}

export interface IError {
    Code: number;
    Message : number;
}