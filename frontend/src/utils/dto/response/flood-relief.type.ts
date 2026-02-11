export interface FloodReport {
    id: number;
    uuid: string;
    date: string; // ISO datetime
    flood_id: string;
    district_id: number;
    taluka_id: number;
    village_id: number;
    pin_code: string;
    current_condition: string;
    water_level: string;
    affected_roads: string;
    affected_houses: number;
    affected_population: number;
    flooded_houses: number;
    houses_damaged: number;
    dead_animals: number;
    lost_animals: number;
    shifted_population: number;
    district_name: string;
    taluka_name: string;
    village_name: string;
    created_by: number;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
    deleted_at: string | null;
}

export interface FloodReportLog {
    id: number;
    date: string; // ISO date string
    uuid: string;
    remark: string;
    flood_id: string;
    pin_code: string;
    taluka_id: number;
    created_at: string;
    created_by: number;
    deleted_at: string | null;
    updated_at: string;
    updated_by: number;
    village_id: number;
    district_id: number;
    taluka_name: string;
    water_level: string;
    dead_animals: number;
    lost_animals: number;
    village_name: string;
    district_name: string;
    affected_roads: number;
    flooded_houses: number;
    houses_damaged: number;
    affected_houses: number;
    current_condition: string;
    shifted_population: number;
    affected_population: number;
}

// Each log entry
export interface ActivityLog {
    id: number;
    action: string;
    action_id: string;
    action_by: number;
    user_name: string;
    module_type: string;
    request: FloodReportLog;
    remark: string;
    old_value: FloodReportLog;
    new_value: string | Record<string, any>; // sometimes empty string, sometimes could be object
    campaign_uuid: string;
    description: string;
    documents: string | null;
    medicines: string | null;
    diseases: string | null;
    created_at: string;
    updated_at: string;
}

export interface FetchMediaGalleryListData {
    flood_uuid: string,
    file_type: string,
    file_path: string,
    created_by: string,
    created_at: string
}

export interface FetchDistrictListData {
    id: number,
    name: string,
    region_id: number
}

export interface FetchTalukaListData {
    id: number,
    name: string,
    district_id: number
}

export interface FetchVillageListData {
    id: number,
    name: string,
    taluka_id: number
}

export interface FloodReportListResponse {
    data: FloodReport[];
    filtered_count: number;
    total_count: number;
}

export interface FetchDistrictListResponse {
    data: FetchDistrictListData[];
    filtered_count: number;
    total_count: number;
}

export interface FetchTalukaListResponse {
    data: FetchTalukaListData[];
    filtered_count: number;
    total_count: number;
}

export interface FetchVillageListResponse {
    data: FetchVillageListData[];
    filtered_count: number;
    total_count: number;
}

export interface FetchMediaGalleryListResponse {
    data: FetchMediaGalleryListData[];
    filtered_count: number;
    total_count: number;
}

export interface FetchFloodReliefLogsResponse {
    data: ActivityLog[];
    filter_count: number;
    total_count: number;

}


export interface FetchRequirementsCountResponse {
    requirement_food: number,
    requirement_shelter: number,
    requirement_health: number,
    requirement_hygiene: number,
    requirement_rescue: number,
    requirement_communication: number,
    requirement_operation: number,
    requirement_others: number
}

export interface FetchFloodReportDetailsResponse {
    id: number,
    uuid: string,
    date: string,
    flood_id: string,
    district_id: number,
    district_name: string,
    taluka_id: number,
    taluka_name: string,
    village_id: number,
    village_name: string,
    pin_code: string,
    current_condition: string,
    water_level: string,
    affected_roads: number,
    affected_houses: number,
    affected_population: number,
    flooded_houses: number,
    houses_damaged: number,
    dead_animals: number,
    lost_animals: number,
    shifted_population: number,
    created_at: string,
    updated_at: string
}