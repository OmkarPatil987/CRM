export interface ContactResponse {
    id: number
    contact_uuid: string
    name: string
    mobile: string
    email: string
    company: string
    designation: string
    status: string
    vip: boolean
    address: string
    owner_id?: number
    lead_id?: number
    deal_id?: number
    tags: string
    notes: string
    created_at: string
    updated_at: string
}

export interface ContactListResponse {
    id: number
    name: string
    mobile: string
    email: string
    company: string
    designation: string
    status: string
    vip: boolean
    owner_id?: number
    tags: string
    created_at: string
}
