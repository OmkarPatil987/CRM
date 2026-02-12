export interface DealCreateRequest {
    title: string
    description?: string
    amount?: number
    stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
    status?: 'Open' | 'Won' | 'Lost'
    probability?: number
    expected_close_date?: string // YYYY-MM-DD
    contact_id?: number
    lead_id?: number
    owner_id?: number
    notes?: string
}

export interface DealUpdateRequest extends Partial<DealCreateRequest> {
    id: number
}

export interface DealListRequest {
    page: number
    limit: number
    search?: string
    stage?: string
    owner_id?: number
    date_range_check?: string
    start_date?: string
    end_date?: string
}

export interface DealUpdateStageRequest {
    id: number
    stage: string
}
