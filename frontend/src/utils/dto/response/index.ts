export * from './auth';
export * from './lead';

export interface ListResponseType<T> {
    data: Array<T>
    filter_count: number
    total_count: number
}

export interface APIServerResponse<T> {
    StatusCode: number;
    Message: string;
    DevMessage: string | null;
    Body: T;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T | null;
}

export class ResponseEntity<T>{
    code!: number;
    message!: string;
    data!: T | null;

    success(data: T, code?: number, message?: string): ApiResponse<T> {
        this.code = code ?? 200;
        this.message = message ?? '';
        this.data = data;
        return this.getResponse()
    }

    error(code: number, message: string, data?: T | null): ApiResponse<T> {
        this.code = code;
        this.message = message;
        this.data = data ?? null;
        return this.getResponse()
    }

    getResponse(): ApiResponse<T> {
        return {
            code: this.code,
            message: this.message,
            data: this.data as T,
        }
    }
}
