import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

// Interface for Agency Corporation Form data (Step 1)
interface AgencyCorporationFormData {
  typeOfCompany: string;
  cin: string;
  organisationName: string;
  email: string;
  Mailotp: string;
  mobile: string;
  gst: string;
  pan: string;
  darpanRegNo: string;
  csrRegNo: string;
  sector: string;
  dateOfInc: string | null;
  registerAdd: string;
  pinCode: string;
  stateName: string;
  districtName: string;
  officeAdd: string;
  companyweb: string;
  panCardBase64: any | null;
  gstCertificateBase64: any | null;
  incCertiBase64: any | null;
  csr1CertiBase64: any | null;
  eightygCertiBase64: any | null;
}

interface FinancialFile {
  base64: string;
  name: string;
  type: string;
}

// Interface for Agency Contact Person Form data (Step 4)
interface AgencyContactPersonFormData {
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
}

interface AgencyFinancialYearData {
  financial_year: string;
  turnover?: string;
  profit_loss?: string;
  csr_spent?: string;
  fy_statement_file?: FinancialFile | null;
}

interface CSRFunding {
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
interface BanksData {
  id?: number;
  name: string;
  account: string;
  ifsc: string;
  cheque?: any | null;
  username?: string;
  isDefault?: boolean
}
// Combined state interface
interface AgencyFormState {
  agencyCorporation: AgencyCorporationFormData;
  agencyContactPerson: AgencyContactPersonFormData;
  agencyFinancialData: AgencyFinancialYearData[];
  csrFundingProjects: CSRFunding[];
  banksData: BanksData[]
}


const initialState: AgencyFormState = {
  agencyCorporation: {
    typeOfCompany: '',
    cin: '',
    organisationName: '',
    email: '',
    Mailotp: '',
    mobile: '',
    gst: '',
    pan: '',
    dateOfInc: dayjs().format('YYYY-MM-DD'),
    registerAdd: '',
    pinCode: '',
    stateName: '',
    districtName: '',
    officeAdd: '',
    companyweb: '',
    panCardBase64: null,
    gstCertificateBase64: null,
    incCertiBase64: null,
    eightygCertiBase64: null,
    csr1CertiBase64: null,
    sector: '',
    csrRegNo: '',
    darpanRegNo: '',
  },
  agencyContactPerson: {
    contactPerson: '',
    designation: '',
    mobile: '',
    email: '',
  },
  agencyFinancialData: [{ financial_year: '', turnover: '', profit_loss: '', csr_spent: '', fy_statement_file: null }],
  csrFundingProjects: [],
  banksData: [{ name: '', account: '', ifsc: '', cheque: null, username: '', isDefault: false }],
};

const formSlice = createSlice({
  name: 'agencyForm',
  initialState,
  reducers: {
    updateAgencyCorporationForm: (state, action: PayloadAction<Partial<AgencyCorporationFormData>>) => {
      state.agencyCorporation = { ...state.agencyCorporation, ...action.payload };
    },
    updateAgencyContactPersonForm: (state, action: PayloadAction<Partial<AgencyContactPersonFormData>>) => {
      state.agencyContactPerson = { ...state.agencyContactPerson, ...action.payload };
    },
    updateAgencyFinancialData: (state, action: PayloadAction<AgencyFinancialYearData[]>) => {
      state.agencyFinancialData = action.payload;
    },
    updateCSRFundingProjects: (state, action: PayloadAction<CSRFunding[]>) => {
      state.csrFundingProjects = action.payload;
    },
    updateBankData: (state, action: PayloadAction<BanksData[]>) => {
      state.banksData = action.payload;
    },
    clearAgencyFormData: () => initialState,
  },
});

export const {
  updateAgencyCorporationForm,
  updateAgencyContactPersonForm,
  updateAgencyFinancialData,
  updateCSRFundingProjects,
  updateBankData,
  clearAgencyFormData
} = formSlice.actions;

export default formSlice.reducer;
