import ClientsAxios from '../client-axios'
import { DealCreateRequest, DealListRequest, DealUpdateRequest, DealUpdateStageRequest } from '../dto/request/deal'
import { DealListResponse, DealResponse } from '../dto/response/deal'
import { handlePostRequest } from './requestHandler'

const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios

export const CreateDealService = async (payload: DealCreateRequest) => {
    return handlePostRequest<DealResponse>(
        'deal/create',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const UpdateDealService = async (payload: DealUpdateRequest) => {
    return handlePostRequest<null>(
        'deal/update',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const DeleteDealService = async (id: number) => {
    return handlePostRequest<null>(
        'deal/delete',
        { id },
        CMRF_NGO_ADMIN_SERVER
    )
}

export const FetchDealDetailsService = async (id: number) => {
    return handlePostRequest<DealResponse>(
        'deal/details',
        { id },
        CMRF_NGO_ADMIN_SERVER
    )
}

export const FetchDealListService = async (payload: DealListRequest) => {
    return handlePostRequest<{ data: DealListResponse[]; totalCount: number; filterCount: number }>(
        'deal/list',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}

export const UpdateDealStageService = async (payload: DealUpdateStageRequest) => {
    return handlePostRequest<null>(
        'deal/update-stage',
        payload,
        CMRF_NGO_ADMIN_SERVER
    )
}
