
import ClientsAxios from '../client-axios';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;


export const GuestProductDetailsService = (payload: any) => handlePostRequest<any>(`v1/public-qr`, payload, CMRF_NGO_ADMIN_SERVER);