import { type AxiosInstance } from "axios";
import { ResponseEntity } from "../dto/response";

interface RequestOptions {
    params?: any;
    payload?: any;
    headers?: Record<string, string>;
}

const handleRequest = async <T>(
    method: "get" | "post",
    url: string,
    SERVER_URL: AxiosInstance,
    options?: RequestOptions
): Promise<ResponseEntity<T>> => {
    const responseEntity = new ResponseEntity<T>();

    try {
        const axiosConfig = {
            headers: options?.headers,
            params: method === "get" ? options?.params : undefined,
        };

        const response = await SERVER_URL[method](url, method === "get" ? axiosConfig : options?.payload, method === "get" ? undefined : axiosConfig);
        responseEntity.success(response.data?.body, 200, response.data?.message);
    } catch (error: any) {
        const response = error?.response;
        responseEntity.error(
            response?.status ?? 500,
            error?.message ?? "Unknown error occurred",
            response?.data?.body ?? {}
        );
    }

    return responseEntity;
};

export const handleGetRequest = async <T>(
    url: string,
    params: any,
    SERVER_URL: AxiosInstance,
    headers?: Record<string, string>
): Promise<ResponseEntity<T>> => {
    return handleRequest<T>("get", url, SERVER_URL, { params, headers });
};

export const handlePostRequest = async <T>(
    url: string,
    payload: any,
    SERVER_URL: AxiosInstance,
    headers?: Record<string, string>
): Promise<ResponseEntity<T>> => {
    return handleRequest<T>("post", url, SERVER_URL, { payload, headers });
};
