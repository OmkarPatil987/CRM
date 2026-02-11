package repository

import (
    "camp-backend/database"
    "camp-backend/dto"
    "camp-backend/model"
    "time"

    "github.com/google/uuid"
)

type LeadRepository interface {
    Create(lead *model.Lead) error
    Update(lead *model.Lead) error
    GetByID(id int) (*model.Lead, error)
    GetByUUID(leadUUID string) (*model.Lead, error)
    List(req dto.LeadListRequest) ([]dto.LeadListResponse, int64, int64, error)
    AddFollowUp(followUp *model.LeadFollowUp) error
    ListFollowUps(leadUUID string, page, limit int) ([]dto.LeadFollowUpResponse, int64, int64, error)
    AddComment(comment *model.LeadComment) error
    ListComments(leadUUID string, page, limit int) ([]dto.LeadCommentResponse, int64, int64, error)
    AddActivity(activity *model.LeadActivity) error
    ListActivities(leadUUID string, page, limit int) ([]dto.LeadActivityResponse, int64, int64, error)
    CountLeadsForMonth(prefix string) (int64, error)
}

type leadRepo struct{}

func NewLeadRepository() LeadRepository { return &leadRepo{} }

func (r *leadRepo) Create(lead *model.Lead) error {
    if lead.LeadUUID == "" {
        lead.LeadUUID = uuid.New().String()
    }
    return database.DB.Create(lead).Error
}

func (r *leadRepo) Update(lead *model.Lead) error {
    return database.DB.Save(lead).Error
}

func (r *leadRepo) GetByID(id int) (*model.Lead, error) {
    var lead model.Lead
    if err := database.DB.First(&lead, id).Error; err != nil {
        return nil, err
    }
    return &lead, nil
}

func (r *leadRepo) GetByUUID(leadUUID string) (*model.Lead, error) {
    var lead model.Lead
    if err := database.DB.Where("lead_uuid = ?", leadUUID).First(&lead).Error; err != nil {
        return nil, err
    }
    return &lead, nil
}

func (r *leadRepo) List(req dto.LeadListRequest) ([]dto.LeadListResponse, int64, int64, error) {
    var leads []model.Lead
    var total int64
    var filtered int64

    base := database.DB.Model(&model.Lead{})
    if err := base.Count(&total).Error; err != nil {
        return nil, 0, 0, err
    }

    q := base
    if req.Search != "" {
        like := "%" + req.Search + "%"
        q = q.Where("name LIKE ? OR mobile_number LIKE ? OR email LIKE ? OR enquiry_text LIKE ?", like, like, like, like)
    }
    if req.Status != "" {
        q = q.Where("lead_status = ?", req.Status)
    }

    if err := q.Count(&filtered).Error; err != nil {
        return nil, 0, 0, err
    }

    if err := q.Offset((req.Page-1)*req.Limit).Limit(req.Limit).Order("created_at DESC").Find(&leads).Error; err != nil {
        return nil, 0, 0, err
    }

    resp := make([]dto.LeadListResponse, 0, len(leads))
    for _, l := range leads {
        resp = append(resp, dto.LeadListResponse{
            Name:      l.Name,
            Mobile:    l.MobileNumber,
            Email:     l.Email,
            Enquiry:   l.EnquiryText,
            Status:    l.LeadStatus,
            CreatedAt: l.CreatedAt.Format(time.RFC3339),
        })
    }

    return resp, total, filtered, nil
}

func (r *leadRepo) AddFollowUp(followUp *model.LeadFollowUp) error {
    if followUp.UUID == "" {
        followUp.UUID = uuid.New().String()
    }
    return database.DB.Create(followUp).Error
}

func (r *leadRepo) ListFollowUps(leadUUID string, page, limit int) ([]dto.LeadFollowUpResponse, int64, int64, error) {
    var items []model.LeadFollowUp
    var total int64
    var filtered int64

    base := database.DB.Model(&model.LeadFollowUp{}).Where("lead_uuid = ?", leadUUID)
    if err := base.Count(&total).Error; err != nil {
        return nil, 0, 0, err
    }
    filtered = total

    if err := base.Offset((page-1)*limit).Limit(limit).Order("created_at DESC").Find(&items).Error; err != nil {
        return nil, 0, 0, err
    }

    resp := make([]dto.LeadFollowUpResponse, 0, len(items))
    for _, f := range items {
        nextDate := ""
        if f.NextFollowUpDate != nil {
            nextDate = f.NextFollowUpDate.Format("2006-01-02T15:04:05-07:00")
        }
        resp = append(resp, dto.LeadFollowUpResponse{
            ID:               f.ID,
            UUID:             f.UUID,
            Status:           f.Status,
            Remark:           f.Remark,
            FollowUpDate:     f.FollowUpDate.Format("2006-01-02T15:04:05-07:00"),
            FollowUpTime:     f.FollowUpTime,
            NextFollowUpDate: nextDate,
            NextFollowUpTime: f.NextFollowUpTime,
            LeadStatus:       f.LeadStatus,
            CustomerName:     f.CustomerName,
            LeadUUID:         f.LeadUUID,
            LeadMobileNumber: f.LeadMobileNumber,
            LeadUniqueID:     f.LeadUniqueID,
            CreatedAt:        f.CreatedAt.Format(time.RFC3339),
            UpdatedAt:        f.UpdatedAt.Format(time.RFC3339),
            UpdatedBy:        f.UpdatedBy,
        })
    }
    return resp, total, filtered, nil
}

func (r *leadRepo) AddComment(comment *model.LeadComment) error {
    return database.DB.Create(comment).Error
}

func (r *leadRepo) ListComments(leadUUID string, page, limit int) ([]dto.LeadCommentResponse, int64, int64, error) {
    type commentRow struct {
        ID         int
        LeadID     int
        Remark     string
        Type       string
        UserName   string
        AssignedTo string
        CreatedAt  time.Time
    }
    var comments []commentRow
    var total int64
    var filtered int64

    base := database.DB.Table("lead_comments").
        Joins("JOIN leads ON leads.lead_uuid = lead_comments.lead_uuid").
        Where("lead_comments.lead_uuid = ?", leadUUID)
    if err := base.Count(&total).Error; err != nil {
        return nil, 0, 0, err
    }
    filtered = total

    if err := base.
        Select("lead_comments.id, leads.id as lead_id, lead_comments.remark, lead_comments.type, lead_comments.user_name, lead_comments.assigned_to, lead_comments.created_at").
        Offset((page-1)*limit).
        Limit(limit).
        Order("lead_comments.created_at DESC").
        Scan(&comments).Error; err != nil {
        return nil, 0, 0, err
    }

    resp := make([]dto.LeadCommentResponse, 0, len(comments))
    for _, c := range comments {
        resp = append(resp, dto.LeadCommentResponse{
            ID:         c.ID,
            LeadID:     c.LeadID,
            Remark:     c.Remark,
            Type:       c.Type,
            UserName:   c.UserName,
            AssignedTo: c.AssignedTo,
            CreatedAt:  c.CreatedAt.Format(time.RFC3339),
        })
    }
    return resp, total, filtered, nil
}

func (r *leadRepo) AddActivity(activity *model.LeadActivity) error {
    return database.DB.Create(activity).Error
}

func (r *leadRepo) ListActivities(leadUUID string, page, limit int) ([]dto.LeadActivityResponse, int64, int64, error) {
    type activityRow struct {
        ID           int
        LeadID       int
        UserID       int
        UserName     string
        Remarks      string
        Type         string
        AssignedTo   string
        AssignedFrom string
        CreatedAt    time.Time
        UpdatedAt    time.Time
        DeletedAt    *time.Time
    }
    var activities []activityRow
    var total int64
    var filtered int64

    base := database.DB.Table("lead_activities").
        Joins("JOIN leads ON leads.lead_uuid = lead_activities.lead_uuid").
        Where("lead_activities.lead_uuid = ?", leadUUID)
    if err := base.Count(&total).Error; err != nil {
        return nil, 0, 0, err
    }
    filtered = total

    if err := base.
        Select("lead_activities.id, leads.id as lead_id, lead_activities.user_id, lead_activities.user_name, lead_activities.remarks, lead_activities.type, lead_activities.assigned_to, lead_activities.assigned_from, lead_activities.created_at, lead_activities.updated_at, lead_activities.deleted_at").
        Offset((page-1)*limit).
        Limit(limit).
        Order("lead_activities.created_at DESC").
        Scan(&activities).Error; err != nil {
        return nil, 0, 0, err
    }

    resp := make([]dto.LeadActivityResponse, 0, len(activities))
    for _, a := range activities {
        var deletedAt *string
        if a.DeletedAt != nil {
            t := a.DeletedAt.Format(time.RFC3339)
            deletedAt = &t
        }
        resp = append(resp, dto.LeadActivityResponse{
            ID:           a.ID,
            LeadID:       a.LeadID,
            UserID:       a.UserID,
            UserName:     a.UserName,
            Remarks:      a.Remarks,
            Type:         a.Type,
            AssignedTo:   a.AssignedTo,
            AssignedFrom: a.AssignedFrom,
            CreatedAt:    a.CreatedAt.Format(time.RFC3339),
            UpdatedAt:    a.UpdatedAt.Format(time.RFC3339),
            DeletedAt:    deletedAt,
        })
    }
    return resp, total, filtered, nil
}

func (r *leadRepo) CountLeadsForMonth(prefix string) (int64, error) {
    var count int64
    if err := database.DB.Model(&model.Lead{}).Where("unique_lead_id LIKE ?", prefix+"%").Count(&count).Error; err != nil {
        return 0, err
    }
    return count, nil
}
