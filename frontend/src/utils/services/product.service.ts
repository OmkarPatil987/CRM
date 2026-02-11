
import ClientsAxios from '../client-axios';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;


export const FetchProductListService = (payload: any) => handlePostRequest<any>('v1/product-master/list', payload, CMRF_NGO_ADMIN_SERVER);

//StoreProductService
export const StoreProductService = (payload: any) => handlePostRequest<any>('v1/product-master/create', payload, CMRF_NGO_ADMIN_SERVER);

export const UpdateProductService = (payload: any) => handlePostRequest<any>('v1/product/update', payload, CMRF_NGO_ADMIN_SERVER);

export const DeleteProductService = (payload: any) => handlePostRequest<any>('v1/product/delete', payload, CMRF_NGO_ADMIN_SERVER);

//details
export const FetchProductDetailsService = (payload: any) => handlePostRequest<any>('v1/product-master-details', payload, CMRF_NGO_ADMIN_SERVER);

//getCompanyList
export const FetchCompanyListService = (payload: any) => handlePostRequest<any>('v1/company/list', payload, CMRF_NGO_ADMIN_SERVER);

//CommonDeleteService
export const CommonDeleteService = (url: string, payload: any) => handlePostRequest<any>(`v1/${url}`, payload, CMRF_NGO_ADMIN_SERVER);

//FetchQRListService
export const FetchQRListService = (payload: any) => handlePostRequest<any>('v1/product-master-qr/list', payload, CMRF_NGO_ADMIN_SERVER);

//StoreQRService, UpdateQRService, FetchQRDetailsService
export const StoreQRService = (payload: any) => handlePostRequest<any>('v1/product-master/qr-store', payload, CMRF_NGO_ADMIN_SERVER);

export const UpdateQRService = (payload: any) => handlePostRequest<any>('v1/qr/update', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchQRDetailsService = (payload: any) => handlePostRequest<any>('v1/qr', payload, CMRF_NGO_ADMIN_SERVER);

//FetchCompanyDetailsService
export const FetchCompanyDetailsService = (payload: any) => handlePostRequest<any>('v1/company/details', payload, CMRF_NGO_ADMIN_SERVER);

//StoreCompanyService
export const StoreCompanyService = (payload: any) => handlePostRequest<any>('v1/company/create', payload, CMRF_NGO_ADMIN_SERVER);

//UpdateCompanyService

export const UpdateCompanyService = (payload: any) => handlePostRequest<any>('v1/company/update', payload, CMRF_NGO_ADMIN_SERVER);