import ClientsAxios from '../client-axios'
import { ActivityCreateRequest, ActivityListRequest, ActivityResponse, ActivityUpdateRequest } from '../dto/activity'
import { handleDeleteRequest, handleGetRequest, handlePostRequest, handlePutRequest } from './requestHandler'

const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios

export const CreateActivityService = async (payload: ActivityCreateRequest) => {
    return handlePostRequest<ActivityResponse>(
        'activities',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const UpdateActivityService = async (payload: ActivityUpdateRequest) => {
    return handlePutRequest<null>(
        `activities/${payload.id}`,
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const DeleteActivityService = async (id: number) => {
    return handleDeleteRequest<null>(
        `activities/${id}`,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const FetchActivityListService = async (payload: ActivityListRequest) => {
    // Transform All to undefined for API
    const params = { ...payload }
    if (params.status === 'All') delete params.status;
    if (params.type === 'All') delete params.type;
    if (params.related_type === 'All') delete params.related_type;

    return handleGetRequest<{ data: ActivityResponse[]; totalCount: number; filterCount: number }>(
        'activities',
        params,
        CMRF_NGO_ADMIN_SERVER
    )
}
