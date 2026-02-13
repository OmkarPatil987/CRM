package dto

type DashboardStatsParams struct {
	StartDate string `json:"start_date" form:"start_date"`
	EndDate   string `json:"end_date" form:"end_date"`
}

type DashboardStatsResponse struct {
	TotalLeads         int64              `json:"total_leads"`
	TotalDeals         int64              `json:"total_deals"`
	TotalContacts      int64              `json:"total_contacts"`
	TotalActivities    int64              `json:"total_activities"`
	RecentActivities   []ActivityResponse `json:"recent_activities"`
	UpcomingActivities []ActivityResponse `json:"upcoming_activities"`
}
