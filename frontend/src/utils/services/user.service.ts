import ClientsAxios from '../client-axios';
import { NGODetails, RegistrationRequest } from '../dto/module/NGODetails.type';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const UpdateImplementingAgencyService = (payload: any) => handlePostRequest<any>('ngo/update', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const StoreImplementingAgencyService = (payload: any) => handlePostRequest<any>('ngo/store', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const FetchBankListService = (payload: any) => handlePostRequest<any>('bank-list', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchUserListService = (payload: any) => handlePostRequest<any>('user/list', payload, CMRF_NGO_ADMIN_SERVER);

//FetchUserTypeListService
export const FetchUserTypeListService = (payload: any) => handlePostRequest<any>('user-type', payload, CMRF_NGO_ADMIN_SERVER);