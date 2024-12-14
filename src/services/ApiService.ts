import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import LocalStorageService from '../services/LocalStorageService';

export default class ApiService {
    private static instance: ApiService;
    private baseURL: string;

    private constructor() {
        this.baseURL = 'https://app.rel2.stgrapidusertests.com/api/tester';

    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        try {
            // Log request details
            console.log(`API Request - ${method} ${url}`);
            console.log('Request Data:', data);
            console.log('Request Config:', config);


            const response: AxiosResponse<T> = await axios({
                method,
                url: `${this.baseURL}${endpoint}`,
                data,
                ...config,
            });

            // Log response details
            console.log(`[API Response] - ${method} ${url}`);
            console.log('[Response Status]:', response.status);
            console.log('[Response Data]:', JSON.stringify(response.data, null, 2));

            return response.data;
        } catch (error: any) {
            this.handleError(error);
            throw error;
        }
    }

    // Handle API Errors
    private handleError(error: any): void {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            const message = error.response?.data?.message || error.message;

            switch (statusCode) {
                case 400:
                    console.error('Bad Request:', message);
                    break;
                case 401:
                    console.error('Unauthorized:', message);
                    break;
                case 403:
                    console.error('Forbidden:', message);
                    break;
                case 404:
                    console.error('Not Found:', message);
                    break;
                case 500:
                    console.error('Internal Server Error:', message);
                    break;
                default:
                    console.error('Unexpected Error:', message);
            }
        } else {
            console.error('Unknown Error:', error.message);
        }
    }

    // Public Methods for API Calls
    public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('GET', endpoint, undefined, config);
    }

    public async post<T>(
        endpoint: string,
        data: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        return this.request<T>('POST', endpoint, data, config);
    }

    public async put<T>(
        endpoint: string,
        data: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        return this.request<T>('PUT', endpoint, data, config);
    }

    public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('DELETE', endpoint, undefined, config);
    }
}
