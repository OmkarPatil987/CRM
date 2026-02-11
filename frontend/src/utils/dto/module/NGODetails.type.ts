// NGODetails
export interface NGODetails {
    id: number;
    uuid: string;
    trace_id: string;
    organization_type: string;
    orgnisation_name: string;
    cin: string;
    email: string;
    mobile_no: string;
    gst_number: string;
    pan_number: string;
    date_of_incorporation: string;
    csr_certificate_no: string;
    darpan_registration_no: string;
    registered_address: string;
    sector: string;
    pincode: string;
    state_name: string;
    district_name: string;
    office_address_in_maharashtra: string;
    company_website: string;
    status: "pending" | "approved" | "rejected" | "draft" | "submitted";
    application_date: string;
    role_name: string;

    register_documents: RegisterDocument[];
    correspondence: Correspondence;
    bank_info: BankInfo[];
    financial_infos: FinancialInfo[];
    csr_funding_infos: CSRFundingInfo[];
}

// 📁 Register Document
export interface RegisterDocument {
    id: number;
    reference_id: number;
    file_path: string;
    form_type: string;
    form_step: string;
    file_type: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// 📁 Correspondence Info
export interface Correspondence {
    id: number;
    name_of_contact_person: string;
    designation: string;
    mobile_no: string;
    email: string;
    form_type: string;
}

// 📁 Bank Info
export interface BankInfo {
    id: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    is_default: string;
    file: FileInfo;
}

// 📁 Financial Info
export interface FinancialInfo {
    id: number;
    financial_year: string;
    turnover: string;
    profit_loss: string;
    csr_spent: string;
    file: FileInfo;
}

// 📁 CSR Funding Info
export interface CSRFundingInfo {
    id: number;
    reference_id: number;
    project_name: string;
    financial_year: string;
    donor_name: string;
    concerned_person: string;
    email: string;
    district: string;
    sector: string;
    amount: string;
    status: string;
    project_description: string;
    file_path: string;
    file: FileInfo;
}

// 📁 Reusable File Info
export interface FileInfo {
    id: number;
    reference_id: number;
    file_path: string;
    form_type: string;
    form_step: string;
    file_type: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface RegistrationRequest {
    registration_type: 'ngo'; 
    uuid: string;
    request_type?: string;
}