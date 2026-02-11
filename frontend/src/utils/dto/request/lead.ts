export type LeadCreateRequest = {
    name: string;
    mobile: string;
    email?: string;
    enquiry_text?: string;
};

export type LeadListRequest = {
    page: number;
    limit: number;
    search?: string;
    status?: string;
};

export type LeadDetailsRequest = {
    id: number;
};

export type LeadStatusUpdateRequest = {
    id: number;
    status: string;
};

export type LeadCommentCreateRequest = {
    lead_uuid: string;
    comment: string;
};

export type LeadCommentListRequest = {
    lead_uuid: string;
    page: number;
    limit: number;
};

export type LeadActivityCreateRequest = {
    lead_uuid: string;
    activity_type: string;
    description?: string;
};

export type LeadActivityListRequest = {
    lead_uuid: string;
    page: number;
    limit: number;
};

export type LeadFollowUpCreateRequest = {
    lead_uuid: string;
    follow_up_date: string;
    follow_up_time: string;
    status: string;
    remark?: string;
    next_follow_up_date?: string;
    next_follow_up_time?: string;
};

export type LeadFollowUpListRequest = {
    lead_uuid: string;
    page: number;
    limit: number;
};
