export interface ContactCreateRequest {
    name: string
    mobile: string
    email?: string
    company?: string
    designation?: string
    status?: string
    vip?: boolean
    address?: string
    owner_id?: number
    lead_id?: number
    deal_id?: number
    tags?: string
    notes?: string
}

export interface ContactUpdateRequest {
    id: number
    name?: string
    mobile?: string
    email?: string
    company?: string
    designation?: string
    status?: string
    vip?: boolean
    address?: string
    owner_id?: number
    lead_id?: number
    deal_id?: number
    tags?: string
    notes?: string
}

export interface ContactListRequest {
    page: number
    limit: number
    search?: string
    status?: string
    vip?: boolean
    owner_id?: number
    tags?: string
}
