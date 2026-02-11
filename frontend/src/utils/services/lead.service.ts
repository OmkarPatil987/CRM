import ClientsAxios from '../client-axios';
import { handlePostRequest } from './requestHandler';
import {
    LeadActivity,
    LeadComment,
    LeadDetails,
    LeadFollowUp,
    LeadListItem,
} from '../dto/response/lead';
import {
    LeadActivityCreateRequest,
    LeadActivityListRequest,
    LeadCommentCreateRequest,
    LeadCommentListRequest,
    LeadCreateRequest,
    LeadDetailsRequest,
    LeadFollowUpCreateRequest,
    LeadFollowUpListRequest,
    LeadListRequest,
    LeadStatusUpdateRequest,
} from '../dto/request/lead';

const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const CreateLeadService = (payload: LeadCreateRequest) =>
    handlePostRequest<LeadDetails>('lead/create', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchLeadListService = (payload: LeadListRequest) =>
    handlePostRequest<{ data: LeadListItem[]; totalCount: number; filterCount: number }>(
        'lead/list',
        payload,
        CMRF_NGO_ADMIN_SERVER
    );

export const FetchLeadDetailsService = (payload: LeadDetailsRequest) =>
    handlePostRequest<LeadDetails>('lead/details', payload, CMRF_NGO_ADMIN_SERVER);

export const UpdateLeadStatusService = (payload: LeadStatusUpdateRequest) =>
    handlePostRequest<any>('lead/status', payload, CMRF_NGO_ADMIN_SERVER);

export const AddLeadCommentService = (payload: LeadCommentCreateRequest) =>
    handlePostRequest<any>('lead/comments/add', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchLeadCommentsService = (payload: LeadCommentListRequest) =>
    handlePostRequest<{ data: LeadComment[]; filteredCount: number; totalCount: number }>(
        'lead/comments/list',
        payload,
        CMRF_NGO_ADMIN_SERVER
    );

export const AddLeadActivityService = (payload: LeadActivityCreateRequest) =>
    handlePostRequest<any>('lead/activities/add', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchLeadActivitiesService = (payload: LeadActivityListRequest) =>
    handlePostRequest<{ data: LeadActivity[]; filteredCount: number; totalCount: number }>(
        'lead/activities/list',
        payload,
        CMRF_NGO_ADMIN_SERVER
    );

export const AddLeadFollowUpService = (payload: LeadFollowUpCreateRequest) =>
    handlePostRequest<any>('lead/followups/add', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchLeadFollowUpsService = (payload: LeadFollowUpListRequest) =>
    handlePostRequest<{ data: LeadFollowUp[]; filterCount: number; totalCount: number }>(
        'lead/followups/list',
        payload,
        CMRF_NGO_ADMIN_SERVER
    );
