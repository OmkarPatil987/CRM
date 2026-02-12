import ClientsAxios from '../client-axios';
import { handlePostRequest } from './requestHandler';
import { ContactCreateRequest, ContactUpdateRequest, ContactListRequest } from '../dto/request/contact';
import { ContactResponse, ContactListResponse } from '../dto/response/contact';

const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const CreateContactService = async (payload: ContactCreateRequest) => {
    return handlePostRequest<ContactResponse>(
        'contact/create',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const UpdateContactService = async (payload: ContactUpdateRequest) => {
    return handlePostRequest<void>(
        'contact/update',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const DeleteContactService = async (id: number) => {
    return handlePostRequest<void>(
        'contact/delete',
        { id },
        CMRF_NGO_ADMIN_SERVER
    )
}

export const FetchContactDetailsService = async (id: number) => {
    return handlePostRequest<ContactResponse>(
        'contact/details',
        { id },
        CMRF_NGO_ADMIN_SERVER
    )
}

export const FetchContactListService = async (payload: ContactListRequest) => {
    return handlePostRequest<{ data: ContactListResponse[]; totalCount: number; filterCount: number }>(
        'contact/list',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}
