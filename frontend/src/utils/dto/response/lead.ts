export type LeadListItem = {
    name: string;
    mobile: string;
    email: string;
    enquiry: string;
    status: string;
    created_at: string;
    id: number;
    lead_uuid: string;
};

export type LeadDetails = {
    id: number;
    lead_uuid: string;
    name: string;
    mobile_number: string;
    unique_lead_id: string;
    lead_status: string;
    services: string;
    created_at: string;
    updated_at: string;
};

export type LeadComment = {
    id: number;
    lead_id: number;
    reamrk: string;
    type: string;
    user_name: string;
    assigned_to: string;
    created_at: string;
};

export type LeadActivity = {
    id: number;
    lead_id: number;
    user_id: number;
    user_name: string;
    remarks: string;
    type: string;
    assigned_to: string;
    assigned_from: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type LeadFollowUp = {
    id: number;
    uuid: string;
    status: string;
    remark: string;
    follow_up_date: string;
    follow_up_time: string;
    next_follow_up_date: string;
    next_follow_up_time: string;
    lead_status: string;
    customer_name: string;
    lead_uuid: string;
    lead_mobile_number: string;
    lead_unique_id: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
};
