export interface DealResponse {
    id: number
    deal_uuid: string
    title: string
    description: string
    amount: number
    stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
    status: 'Open' | 'Won' | 'Lost'
    probability: number
    expected_close_date: string
    contact_id?: number
    lead_id?: number
    owner_id?: number
    notes: string
    created_at: string
    updated_at: string
    contact_name?: string
}

export interface DealListResponse {
    id: number
    title: string
    amount: number
    stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
    status: 'Open' | 'Won' | 'Lost'
    probability: number
    expected_close_date: string
    owner_name: string
    contact_name: string
    created_at: string
}
