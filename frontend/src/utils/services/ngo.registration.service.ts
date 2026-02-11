import ClientsAxios from '../client-axios';
import { NGODetails, RegistrationRequest } from '../dto/module/NGODetails.type';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const UpdateImplementingAgencyService = (payload: any) => handlePostRequest<any>('ngo/update', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const StoreImplementingAgencyService = (payload: any) => handlePostRequest<any>('ngo/store', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const FetchBankListService = (payload: any) => handlePostRequest<any>('bank-list', payload, CMRF_NGO_ADMIN_SERVER);

export const GetPincodeDetailsService = (payload: any) => handlePostRequest<any>('pincode-detail', payload, CMRF_NGO_ADMIN_SERVER);

export const SendMailOTP = (payload: any) => handlePostRequest<any>('verify-email', payload, CMRF_NGO_ADMIN_SERVER);

export const GetDropDownListService = (payload: any) => handlePostRequest<any>('ngo/dropdown', payload, CMRF_NGO_ADMIN_SERVER);

export const VerifyTokenfUser = (payload: any) => handlePostRequest<any>('ngo/verify-token', payload, CMRF_NGO_ADMIN_SERVER);

export const VerifyMailOTP = (payload: any) => handlePostRequest<any>('verify-email/otp', payload, CMRF_NGO_ADMIN_SERVER);

// NGO Other 

export const FetchNgoListSerivce = (payload: any) => handlePostRequest<any>('ngo/list', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchNgoDetailsSerivce = (payload: RegistrationRequest) => handlePostRequest<NGODetails>('ngo/detail', payload, CMRF_NGO_ADMIN_SERVER);

export const UpdateNgoStatusSerivce = (payload: any) => handlePostRequest<any>('ngo/update-status', payload, CMRF_NGO_ADMIN_SERVER);
export const FetchNgoCountSerivce = (payload: any) => handlePostRequest<any>('ngo/count', payload, CMRF_NGO_ADMIN_SERVER);

// NGO Activity 
export const FetchNgoActivityListSerivce = (payload: any) => handlePostRequest<any>('volunteer/list', payload, CMRF_NGO_ADMIN_SERVER);
export const FetchVolunteerActivityListSerivce = (payload: any) => handlePostRequest<any>('ngo-activities/list', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchNgoActivityCountSerivce = (payload: any) => handlePostRequest<any>('ngo-activities/count', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchNgoActivityDailyCountSerivce = (payload: any) => handlePostRequest<any>('ngo-activities/day-wise-count', payload, CMRF_NGO_ADMIN_SERVER);

export const AddEditNgoActivitySerivce = (payload: any, isUpdate: boolean) => handlePostRequest<any>(isUpdate ? 'ngo-activities/update' : 'ngo-activities/store', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const FetchNgoActivityDetailsSerivce = (payload: any) => handlePostRequest<any>('ngo-activities/details', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchActivityLogsService = (payload: any) => handlePostRequest<any>('ngo/activity-log-list', payload, CMRF_NGO_ADMIN_SERVER);


// NGO ACTIVITY Document
export const FetchNgoActivityDocumentSerivce = (payload: any) => handlePostRequest<any>('volunteer-activity-documents/list', payload, CMRF_NGO_ADMIN_SERVER);

export const StoreNgoActivityDocumentSerivce = (payload: any) => handlePostRequest<any>('volunteer-activity-documents/store', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const DeleteNgoActivityDocumentSerivce = (payload: any) => handlePostRequest<any>('volunteer-activity-documents/delete', payload, CMRF_NGO_ADMIN_SERVER);

// Beneficiary List 
export const FetchActivityBeneficiaryListSerivce = (payload: any) => handlePostRequest<any>('beneficiary/list', payload, CMRF_NGO_ADMIN_SERVER);

export const StoreActivityBeneficiarySerivce = (payload: any) => handlePostRequest<any>('beneficiary/store', payload, CMRF_NGO_ADMIN_SERVER);

// Notification 
export const FetchNotificationListService = (payload: any) => handlePostRequest<any>('notifications/list', payload, CMRF_NGO_ADMIN_SERVER);

export const UpdateNotificationService = (payload: any) => handlePostRequest<any>('notifications/update-status', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchNGODailyActivityCountsService = (payload: any) => handlePostRequest<any>('ngo-activities/day-wise-count', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchDistrictTalukaService = (payload: any) => handlePostRequest<any>('taluka-district', payload, CMRF_NGO_ADMIN_SERVER);
// ngo-activities/generate-pdf
export const StoreMOUpdfService = (payload: any) => handlePostRequest<any>('ngo-activities/generate-pdf', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchMOUpdfListService = (payload: any) => handlePostRequest<any>('ngo-activities/ngo-mou-list', payload, CMRF_NGO_ADMIN_SERVER);
