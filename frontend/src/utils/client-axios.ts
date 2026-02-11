import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { BaseUrls } from '../utils/base-urls'
import store from '../redux/store'


const ClientsAxios: any = {}

Object.keys(BaseUrls).forEach((base: any) => {
    ClientsAxios[base] = axios.create({ baseURL: BaseUrls[base].url })
    addInterceptor(ClientsAxios[base], BaseUrls[base].config)
})


function addInterceptor(instance: AxiosInstance, requestExtetion: any): AxiosInstance {
    instance.interceptors.request.use(async (request: InternalAxiosRequestConfig) => {
        const authUser = store.getState().authUser;
        if (authUser?.token) {
            const token = authUser.token.startsWith('Bearer ') ? authUser.token : `Bearer ${authUser.token}`;
            request.headers['Authorization'] = token;
        }
        request.headers['Accept'] = 'Application/json'
        request.headers['Content-Type'] ??= 'application/json'
        return request
    }, (error: AxiosError) => {
        return Promise.reject(error)
    })

    instance.interceptors.response.use((response: any) => {
        return response
    }, (error: {
        response: {
            data: any; status: number
        }
    }) => {
        console.error(error);
        if (error?.response?.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            window.open("/auth/login", "_self")
        } else {
            return Promise.reject(new Error(error?.response?.data?.message ?? 'Something went wrong'));
        }
    })
    return instance
}

export default ClientsAxios
