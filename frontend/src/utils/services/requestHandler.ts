import { type AxiosInstance } from "axios";
import { ResponseEntity } from "../dto/response";

interface RequestOptions {
    params?: any;
    payload?: any;
    headers?: Record<string, string>;
}

const handleRequest = async <T>(
    method: "get" | "post" | "put" | "delete",
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

        let response: any;
        if (method === "get") {
            response = await SERVER_URL.get(url, axiosConfig);
        } else if (method === "delete") {
            response = await SERVER_URL.delete(url, axiosConfig);
        } else if (method === "post") {
            response = await SERVER_URL.post(url, options?.payload, axiosConfig);
        } else {
            response = await SERVER_URL.put(url, options?.payload, axiosConfig);
        }
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

export const handlePutRequest = async <T>(
    url: string,
    payload: any,
    SERVER_URL: AxiosInstance,
    headers?: Record<string, string>
): Promise<ResponseEntity<T>> => {
    return handleRequest<T>("put", url, SERVER_URL, { payload, headers });
};

export const handleDeleteRequest = async <T>(
    url: string,
    SERVER_URL: AxiosInstance,
    headers?: Record<string, string>
): Promise<ResponseEntity<T>> => {
    return handleRequest<T>("delete", url, SERVER_URL, { headers });
};
