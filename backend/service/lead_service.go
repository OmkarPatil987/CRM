package service

import (
    "camp-backend/dto"
    "camp-backend/model"
    "camp-backend/repository"
    "camp-backend/util"
    "errors"
    "fmt"
    "time"
)

type LeadService interface {
    Create(req dto.LeadCreateRequest, userID int) (*dto.LeadDetailsResponse, error)
    List(req dto.LeadListRequest) ([]dto.LeadListResponse, int64, int64, error)
    Details(id int) (*dto.LeadDetailsResponse, error)
    AddFollowUp(req dto.LeadFollowUpCreateRequest, userID int, userName string) error
    ListFollowUps(req dto.LeadFollowUpListRequest) ([]dto.LeadFollowUpResponse, int64, int64, error)
    AddComment(req dto.LeadCommentCreateRequest, userID int, userName string) error
    ListComments(req dto.LeadCommentListRequest) ([]dto.LeadCommentResponse, int64, int64, error)
    ListActivities(req dto.LeadActivityListRequest) ([]dto.LeadActivityResponse, int64, int64, error)
}

type leadService struct {
    repo     repository.LeadRepository
    userRepo repository.UserRepository
}

var Lead LeadService = &leadService{
    repo:     repository.NewLeadRepository(),
    userRepo: repository.NewUserRepository(),
}

func (s *leadService) Create(req dto.LeadCreateRequest, userID int) (*dto.LeadDetailsResponse, error) {
    if err := util.ValidateStruct(req); err != nil {
        return nil, err
    }

    lead := &model.Lead{
        Name:         req.Name,
        MobileNumber: req.Mobile,
        Email:        req.Email,
        EnquiryText:  req.EnquiryText,
        LeadStatus:   "pending",
        Services:     "",
        CreatedAt:    time.Now(),
        UpdatedAt:    time.Now(),
    }
    if err := s.repo.Create(lead); err != nil {
        return nil, err
    }

    uniqueID, err := s.generateUniqueLeadID()
    if err != nil {
        return nil, err
    }
    lead.UniqueLeadID = uniqueID
    if err := s.repo.Update(lead); err != nil {
        return nil, err
    }

    _ = s.repo.AddActivity(&model.LeadActivity{
        LeadUUID:    lead.LeadUUID,
        UserID:      userID,
        UserName:    s.resolveUserName(userID),
        Remarks:     "Created Lead by",
        Type:        "store_lead",
        AssignedTo:  "",
        AssignedFrom: "",
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    })

    return &dto.LeadDetailsResponse{
        ID:           lead.ID,
        LeadUUID:     lead.LeadUUID,
        Name:         lead.Name,
        MobileNumber: lead.MobileNumber,
        UniqueLeadID: lead.UniqueLeadID,
        LeadStatus:   lead.LeadStatus,
        Services:     lead.Services,
        CreatedAt:    lead.CreatedAt.Format(time.RFC3339),
        UpdatedAt:    lead.UpdatedAt.Format(time.RFC3339),
    }, nil
}

func (s *leadService) List(req dto.LeadListRequest) ([]dto.LeadListResponse, int64, int64, error) {
    if req.Page == 0 {
        req.Page = 1
    }
    if req.Limit == 0 {
        req.Limit = 10
    }
    return s.repo.List(req)
}

func (s *leadService) Details(id int) (*dto.LeadDetailsResponse, error) {
    lead, err := s.repo.GetByID(id)
    if err != nil {
        return nil, err
    }
    return &dto.LeadDetailsResponse{
        ID:           lead.ID,
        LeadUUID:     lead.LeadUUID,
        Name:         lead.Name,
        MobileNumber: lead.MobileNumber,
        UniqueLeadID: lead.UniqueLeadID,
        LeadStatus:   lead.LeadStatus,
        Services:     lead.Services,
        CreatedAt:    lead.CreatedAt.Format(time.RFC3339),
        UpdatedAt:    lead.UpdatedAt.Format(time.RFC3339),
    }, nil
}

func (s *leadService) AddFollowUp(req dto.LeadFollowUpCreateRequest, userID int, userName string) error {
    if err := util.ValidateStruct(req); err != nil {
        return err
    }
    if userName == "" {
        userName = s.resolveUserName(userID)
    }

    lead, err := s.repo.GetByUUID(req.LeadUUID)
    if err != nil {
        return err
    }

    followUpDate, err := time.Parse("2006-01-02", req.FollowUpDate)
    if err != nil {
        return errors.New("invalid follow_up_date, must be YYYY-MM-DD")
    }

    var nextDate *time.Time
    if req.NextFollowUpDate != "" {
        t, err := time.Parse("2006-01-02", req.NextFollowUpDate)
        if err != nil {
            return errors.New("invalid next_follow_up_date, must be YYYY-MM-DD")
        }
        nextDate = &t
    }

    followUp := &model.LeadFollowUp{
        Status:           req.Status,
        Remark:           req.Remark,
        FollowUpDate:     followUpDate,
        FollowUpTime:     req.FollowUpTime,
        NextFollowUpDate: nextDate,
        NextFollowUpTime: req.NextFollowUpTime,
        LeadStatus:       lead.LeadStatus,
        CustomerName:     lead.Name,
        LeadUUID:         lead.LeadUUID,
        LeadMobileNumber: lead.MobileNumber,
        LeadUniqueID:     lead.UniqueLeadID,
        CreatedAt:        time.Now(),
        UpdatedAt:        time.Now(),
        UpdatedBy:        userName,
    }

    if err := s.repo.AddFollowUp(followUp); err != nil {
        return err
    }

    _ = s.repo.AddActivity(&model.LeadActivity{
        LeadUUID:    lead.LeadUUID,
        UserID:      userID,
        UserName:    userName,
        Remarks:     fmt.Sprintf("Follow Up created with the status %s by", req.Status),
        Type:        "follow_up",
        AssignedTo:  "",
        AssignedFrom: "",
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    })

    return nil
}

func (s *leadService) ListFollowUps(req dto.LeadFollowUpListRequest) ([]dto.LeadFollowUpResponse, int64, int64, error) {
    if req.Page == 0 {
        req.Page = 1
    }
    if req.Limit == 0 {
        req.Limit = 10
    }
    return s.repo.ListFollowUps(req.LeadUUID, req.Page, req.Limit)
}

func (s *leadService) AddComment(req dto.LeadCommentCreateRequest, userID int, userName string) error {
    if err := util.ValidateStruct(req); err != nil {
        return err
    }
    if userName == "" {
        userName = s.resolveUserName(userID)
    }

    lead, err := s.repo.GetByUUID(req.LeadUUID)
    if err != nil {
        return err
    }

    comment := &model.LeadComment{
        LeadUUID:   lead.LeadUUID,
        Remark:     req.Comment,
        Type:       "comment",
        UserName:   userName,
        AssignedTo: "",
        CreatedAt:  time.Now(),
    }
    if err := s.repo.AddComment(comment); err != nil {
        return err
    }

    _ = s.repo.AddActivity(&model.LeadActivity{
        LeadUUID:    lead.LeadUUID,
        UserID:      userID,
        UserName:    userName,
        Remarks:     "commented on lead by",
        Type:        "lead_comment",
        AssignedTo:  "",
        AssignedFrom: "",
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    })

    return nil
}

func (s *leadService) ListComments(req dto.LeadCommentListRequest) ([]dto.LeadCommentResponse, int64, int64, error) {
    if req.Page == 0 {
        req.Page = 1
    }
    if req.Limit == 0 {
        req.Limit = 10
    }
    return s.repo.ListComments(req.LeadUUID, req.Page, req.Limit)
}

func (s *leadService) ListActivities(req dto.LeadActivityListRequest) ([]dto.LeadActivityResponse, int64, int64, error) {
    if req.Page == 0 {
        req.Page = 1
    }
    if req.Limit == 0 {
        req.Limit = 10
    }
    return s.repo.ListActivities(req.LeadUUID, req.Page, req.Limit)
}

func (s *leadService) resolveUserName(userID int) string {
    if userID <= 0 {
        return ""
    }
    user, err := s.userRepo.GetByID(userID)
    if err != nil {
        return ""
    }
    return user.Name
}

func (s *leadService) generateUniqueLeadID() (string, error) {
    now := time.Now()
    prefix := fmt.Sprintf("LEAD/%02d%02d/", now.Year()%100, int(now.Month()))
    count, err := s.repo.CountLeadsForMonth(prefix)
    if err != nil {
        return "", err
    }
    return fmt.Sprintf("%s%05d", prefix, count+1), nil
}
