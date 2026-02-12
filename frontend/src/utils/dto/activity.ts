export enum ActivityType {
    CALL = 'call',
    MEETING = 'meeting',
    EMAIL = 'email',
    NOTE = 'note'
}

export enum ActivityRelatedType {
    LEAD = 'lead',
    DEAL = 'deal',
    CONTACT = 'contact'
}

export enum ActivityStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export interface ActivityResponse {
    id: number;
    activity_uuid: string;
    title: string;
    type: ActivityType;
    description: string;
    related_type: ActivityRelatedType;
    related_id: number;
    scheduled_at: string;
    status: ActivityStatus;
    owner_id?: number;
    created_at: string;
    updated_at: string;
}

export interface ActivityListRequest {
    page: number;
    limit: number;
    start_date?: string;
    end_date?: string;
    status?: string | 'All';
    type?: string | 'All';
    related_type?: string | 'All';
    owner_id?: number;
}

export interface ActivityCreateRequest {
    title: string;
    type: ActivityType;
    description?: string;
    related_type: ActivityRelatedType;
    related_id: number;
    scheduled_at?: string;
    status?: ActivityStatus;
    owner_id?: number;
}

export interface ActivityUpdateRequest {
    id: number;
    title?: string;
    type?: ActivityType;
    description?: string;
    scheduled_at?: string;
    status?: ActivityStatus;
}
