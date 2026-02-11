import { Dayjs } from "dayjs"

export type FloodDetailsStoreRequest = {
    uuid?: string;
    date: Dayjs | string,
    district_id: number | null,
    taluka_id: number | null,
    village_id: number | null,
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
    remarks: string,
}

export type FetchDistrictListRequest = {
    limit: number,
    offset: number
}

export type FetchFloodReliefLogsRequest = {
    uuid: string,
    limit: number,
    offset: number,
    module_type: string,
    campaign_uuid?: string
}

export type FetchTalukaListRequest = {
    district_id: number,
    limit: number,
    offset: number
}

export type FetchVillageListRequest = {
    taluka_id: number,
    limit: number,
    offset: number
}

export type FetchRequirementsCountRequest = {
    e_type?: string,
    district_id?: number,
    taluka_id?: number,
    village_id?: number
} 

export type FetchFloodReliefCountRequest = {
    district_id?: number,
    taluka_id?: number,
    village_id?: number
} 