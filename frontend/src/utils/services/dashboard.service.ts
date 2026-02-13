import ClientsAxios from '../client-axios'
import { DashboardStatsParams, DashboardStatsResponse } from '../dto/dashboard'
import { handleGetRequest } from './requestHandler'

const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios

export const FetchDashboardStatsService = async (payload?: DashboardStatsParams) => {
    return handleGetRequest<DashboardStatsResponse>(
        'dashboard/stats',
        payload || {},
        CMRF_NGO_ADMIN_SERVER
    )
}
