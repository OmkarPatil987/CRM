import { Dayjs } from "dayjs";
import { ReactElement } from "react";

interface StatusOption {
    key: string;
    label: string;
    color:any;
    count: number;
    icon: ReactElement;
}

// Type for count structure
interface CountMap {
    upcoming: number;
    ongoing: number;
    completed: number;
    total: number;
}

// Final Payload Type
export interface NgoActivityListPayload {
    offset: number;
    limit: number;
    start_date: Dayjs |null,
    end_date: Dayjs | null,
    search: string;
    status: StatusOption;
    created_by_ngo:number;
    count: CountMap | null;
}

