import ClientsAxios from '../client-axios';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const FetchGlobalMediaListService = (payload: any) => handlePostRequest<any>('media-gallery/list-global-store', payload, CMRF_NGO_ADMIN_SERVER);


export const FetchFileService = async (payload: any, options: { signal?: AbortSignal } = {}): Promise<any> => {
    try {
        const response = await CMRF_NGO_ADMIN_SERVER.post('blob/return-file', payload,
            { responseType: 'blob', signal: options.signal, });
        return response;
    } catch (error: any) {
        if (options.signal?.aborted) {
            console.error('Request aborted');
        } else {
            console.error('Error fetching file with hash:', error.message);
        }
        throw error;
    }
};

export const StoreUpdateGlobalDocumentService = (payload: any, isUpdate: boolean) => handlePostRequest<any>('media-gallery/global-store' , payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data', });
