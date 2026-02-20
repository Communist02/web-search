import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { url } from "./url";

const BASE_URL = url;

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    validateStatus: () => true
});

export interface AuthResponse {
    token: string;
    username: string;
}

const normalizeErrorResponse = (error: AxiosError): AxiosResponse => {
    if (error.response) {
        // Сервер дал ответ (даже 500) — возвращаем как есть
        return error.response;
    }

    // Если ответа нет — создаём фейковый AxiosResponse
    return {
        data: null,
        status: 0,
        statusText: error.code ?? "NETWORK_ERROR",
        headers: {},
        config: (error.config ?? {}) as InternalAxiosRequestConfig,
    };
};

const handleError = (error: AxiosError, context?: string): AxiosResponse => {
    console.error(`[${context}] Ошибка запроса:`, error);

    return normalizeErrorResponse(error);
};

export const authAPI = async (username: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
    try {
        const response = await api.get('/auth', {
            auth: {
                username,
                password,
            }
        });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "auth");
    }
};

export const checkTokenAPI = async (token: string): Promise<AxiosResponse> => {
    try {
        const response = await api.get('/session', { params: { token } });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "get_session");
    }
};

export const deleteSession = async (token: string): Promise<AxiosResponse> => {
    try {
        const response = await api.delete('/session', {
            params: { token }
        });
        return response.data;
    } catch (error) {
        return handleError(error as AxiosError, "delete_session");
    }
};

export const search = async (order: object): Promise<AxiosResponse> => {
    try {
        const response = await api.post('/search', order);
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "search");
    }
};

export const getCategories = async (token: string): Promise<AxiosResponse> => {
    try {
        const response = await api.get('/categories', { params: { token } });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "get_categories");
    }
};

export const addItemToBucket = async (token: string, document_id: string, service_id: string): Promise<AxiosResponse> => {
    try {
        const response = await api.post('/add_to_bucket', { token, document_id, service_id });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "add_to_bucket");
    }
};

export const getBucketItems = async (token: string): Promise<AxiosResponse> => {
    try {
        const response = await api.get('/get_bucket', { params: { token } });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "get_bucket");
    }
};

export const deleteItemFromBucket = async (token: string, item_id: number): Promise<AxiosResponse> => {
    try {
        const response = await api.post('/delete_from_bucket', { token, item_id });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "delete_from_bucket");
    }
};

export const clearBucketApi = async (token: string): Promise<AxiosResponse> => {
    try {
        const response = await api.post('/clear_bucket', { token });
        return response;
    } catch (error) {
        return handleError(error as AxiosError, "clear_bucket");
    }
};