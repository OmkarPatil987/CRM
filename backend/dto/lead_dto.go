package dto

type LeadCreateRequest struct {
    Name        string `json:"name" validate:"required"`
    Mobile      string `json:"mobile" validate:"required"`
    Email       string `json:"email" validate:"omitempty,email"`
    EnquiryText string `json:"enquiry_text"`
}

type LeadListRequest struct {
    Page   int    `json:"page" validate:"required,min=1"`
    Limit  int    `json:"limit" validate:"required,min=1"`
    Search string `json:"search"`
    Status string `json:"status"`
}

type LeadListResponse struct {
    Name      string `json:"name"`
    Mobile    string `json:"mobile"`
    Email     string `json:"email"`
    Enquiry   string `json:"enquiry"`
    Status    string `json:"status"`
    CreatedAt string `json:"created_at"`
}

type LeadDetailsRequest struct {
    ID int `json:"id" validate:"required"`
}

type LeadDetailsResponse struct {
    ID            int    `json:"id"`
    LeadUUID      string `json:"lead_uuid"`
    Name          string `json:"name"`
    MobileNumber  string `json:"mobile_number"`
    UniqueLeadID  string `json:"unique_lead_id"`
    LeadStatus    string `json:"lead_status"`
    Services      string `json:"services"`
    CreatedAt     string `json:"created_at"`
    UpdatedAt     string `json:"updated_at"`
}

type LeadFollowUpCreateRequest struct {
    LeadUUID        string `json:"lead_uuid" validate:"required"`
    FollowUpDate    string `json:"follow_up_date" validate:"required"`
    FollowUpTime    string `json:"follow_up_time" validate:"required"`
    Status          string `json:"status" validate:"required"`
    Remark          string `json:"remark"`
    NextFollowUpDate string `json:"next_follow_up_date"`
    NextFollowUpTime string `json:"next_follow_up_time"`
}

type LeadFollowUpListRequest struct {
    LeadUUID string `json:"lead_uuid" validate:"required"`
    Page     int    `json:"page" validate:"required,min=1"`
    Limit    int    `json:"limit" validate:"required,min=1"`
}

type LeadFollowUpResponse struct {
    ID               int    `json:"id"`
    UUID             string `json:"uuid"`
    Status           string `json:"status"`
    Remark           string `json:"remark"`
    FollowUpDate     string `json:"follow_up_date"`
    FollowUpTime     string `json:"follow_up_time"`
    NextFollowUpDate string `json:"next_follow_up_date"`
    NextFollowUpTime string `json:"next_follow_up_time"`
    LeadStatus       string `json:"lead_status"`
    CustomerName     string `json:"customer_name"`
    LeadUUID         string `json:"lead_uuid"`
    LeadMobileNumber string `json:"lead_mobile_number"`
    LeadUniqueID     string `json:"lead_unique_id"`
    CreatedAt        string `json:"created_at"`
    UpdatedAt        string `json:"updated_at"`
    UpdatedBy        string `json:"updated_by"`
}

type LeadCommentCreateRequest struct {
    LeadUUID string `json:"lead_uuid" validate:"required"`
    Comment  string `json:"comment" validate:"required"`
}

type LeadCommentListRequest struct {
    LeadUUID string `json:"lead_uuid" validate:"required"`
    Page     int    `json:"page" validate:"required,min=1"`
    Limit    int    `json:"limit" validate:"required,min=1"`
}

type LeadCommentResponse struct {
    ID         int    `json:"id"`
    LeadID     int    `json:"lead_id"`
    Remark     string `json:"reamrk"`
    Type       string `json:"type"`
    UserName   string `json:"user_name"`
    AssignedTo string `json:"assigned_to"`
    CreatedAt  string `json:"created_at"`
}

type LeadActivityListRequest struct {
    LeadUUID string `json:"lead_uuid" validate:"required"`
    Page     int    `json:"page" validate:"required,min=1"`
    Limit    int    `json:"limit" validate:"required,min=1"`
}

type LeadActivityResponse struct {
    ID          int     `json:"id"`
    LeadID      int     `json:"lead_id"`
    UserID      int     `json:"user_id"`
    UserName    string  `json:"user_name"`
    Remarks     string  `json:"remarks"`
    Type        string  `json:"type"`
    AssignedTo  string  `json:"assigned_to"`
    AssignedFrom string `json:"assigned_from"`
    CreatedAt   string  `json:"created_at"`
    UpdatedAt   string  `json:"updated_at"`
    DeletedAt   *string `json:"deleted_at"`
}
