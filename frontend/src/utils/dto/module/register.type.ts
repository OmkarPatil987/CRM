import { ReactElement } from 'react';

export interface RegisterProps {
    title: string;
    formTraceId?:string;
    handleNext: () => void;
    setIsSubmitting: (val: boolean) => void;
    updateUserDeatils: any;
}

export interface CSRFunding {
    id: number;
    financialYear: string;
    projectName: string;
    projectDescription: string;
    sector: string;
    amount: string;
    district: string;
    status: string;
    donorName: string;
    concernedPerson: string;
    email: string;
    document: File | null;
}


// Type for a single status option
interface StatusOption {
    key: string;
    label: string;
    color:any;
    count: number;
    icon: ReactElement;
}

// Type for count structure
interface CountMap {
    pending: number;
    compliance: number;
    approved: number;
    rejected: number;
    total: number;
}

// Final Payload Type
export interface NgoListPayload {
    offset: number;
    limit: number;
    search: string;
    status: StatusOption;
    count: CountMap | null;
}

