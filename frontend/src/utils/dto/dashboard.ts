import { ActivityResponse } from "./activity";

export interface DashboardStatsParams {
    start_date?: string; // YYYY-MM-DD
    end_date?: string;   // YYYY-MM-DD
}

export interface DashboardStatsResponse {
    total_leads: number;
    total_deals: number;
    total_contacts: number;
    total_activities: number;
    recent_activities: ActivityResponse[];
    upcoming_activities: ActivityResponse[];
}
