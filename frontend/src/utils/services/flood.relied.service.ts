import ClientsAxios from '../client-axios';
import { FetchDistrictListRequest, FetchFloodReliefCountRequest, FetchFloodReliefLogsRequest, FetchRequirementsCountRequest, FetchTalukaListRequest, FetchVillageListRequest, FloodDetailsStoreRequest } from '../dto/request/flood-relief.type';
import { handleGetRequest, handlePostRequest } from './requestHandler';
import { FetchDistrictListResponse, FetchFloodReliefLogsResponse, FetchFloodReportDetailsResponse, FetchMediaGalleryListResponse, FetchRequirementsCountResponse, FetchTalukaListResponse, FetchVillageListResponse, FloodReportListResponse } from '../dto/response/flood-relief.type';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;


export const StoreUpdateFloodDetailsService = (payload: FloodDetailsStoreRequest, isUpdate: boolean = false) => handlePostRequest<any>( isUpdate ? "flood-relief/update" : "flood-relief/store", payload, CMRF_NGO_ADMIN_SERVER);
  
export const FetchFloodReportListService = (payload: any) => handlePostRequest<FloodReportListResponse>('flood-relief/list', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchFloodReportDetailsService = (payload: { uuid: string }) => handlePostRequest<FetchFloodReportDetailsResponse>('flood-relief/details', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchDistrictListService = (payload: FetchDistrictListRequest) => handlePostRequest<FetchDistrictListResponse>('village-dropdown/district', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchTalukaListService = (payload: FetchTalukaListRequest) => handlePostRequest<FetchTalukaListResponse>('village-dropdown/taluka', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchVillageListService = (payload: FetchVillageListRequest) => handlePostRequest<FetchVillageListResponse>('village-dropdown/villages', payload, CMRF_NGO_ADMIN_SERVER);
export const StoreVoluntaryRegistrationService = (payload: any) => handlePostRequest<any>('volunteer/register', payload, CMRF_NGO_ADMIN_SERVER);


export const StoreRequirementService = (payload: any) => handlePostRequest<any>('requirements/store', payload, CMRF_NGO_ADMIN_SERVER);


export const UploadGalleryReportFileService = (payload: any) => handlePostRequest<any>('media-gallery/store', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });

export const GetCaptchImageService = (payload: any) => handleGetRequest<any>('captcha/get', payload, CMRF_NGO_ADMIN_SERVER);

export const VerifyCaptchaService = (payload: any) => handlePostRequest<any>('captcha/verify', payload, CMRF_NGO_ADMIN_SERVER);
export const FetchRequirementListService = (payload: any) => handlePostRequest<any>('requirements/list', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchGalleryDocumentSerivce = (payload: any) => handlePostRequest<FetchMediaGalleryListResponse>('media-gallery/list', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchFloodReliefCountSerivce = (payload: any) => handlePostRequest<any>('flood-relief/count', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchRequirementCountSerivce = (payload: any) => handlePostRequest<any>('requirements/get-requirements-count', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchRequirementsCountService = (payload: FetchRequirementsCountRequest) => handlePostRequest<FetchRequirementsCountResponse>('requirements/get-requirements-count', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchFloodReliefCountService = (payload: FetchFloodReliefCountRequest) => handlePostRequest<FetchFloodReportDetailsResponse>('flood-relief/count', payload, CMRF_NGO_ADMIN_SERVER);



export const GetDistrictContactsService = (payload: any) => handlePostRequest<any>('requirements/get-district-contacts', payload, CMRF_NGO_ADMIN_SERVER);
export const FetchCateogryCountService = (payload: any) => handlePostRequest<any>('requirements/get-requirements-count', payload, CMRF_NGO_ADMIN_SERVER);

export const FetchFloodReliefLogsService = (payload: FetchFloodReliefLogsRequest) => handlePostRequest<FetchFloodReliefLogsResponse>('flood-relief/food-activity-logs', payload, CMRF_NGO_ADMIN_SERVER);

//FetchCateogryCountService

// FetchPaymentReceiptService
export const FetchPaymentReceiptStoreService = (payload:any) => handlePostRequest<any>('payment/store', payload, CMRF_NGO_ADMIN_SERVER, { 'Content-Type': 'multipart/form-data' });
export const FetchPaymentReceiptListService = (payload:any) => handlePostRequest<any>('payment/list', payload, CMRF_NGO_ADMIN_SERVER);

// FetchRequirementItemList
export const FetchRequirementItemListService = (payload:any) => handlePostRequest<any>('requirements/items-count', payload, CMRF_NGO_ADMIN_SERVER);
export const FetchRequirementListStatusService = (payload:any) => handlePostRequest<any>('payment/status', payload, CMRF_NGO_ADMIN_SERVER);

//FetchCampaignCountService
export const FetchCampaignCountService = (payload:any) => handlePostRequest<any>('donation/campaign-count', payload, CMRF_NGO_ADMIN_SERVER);


export const FetchPaymentDashboardMainCountSerivce = (payload: any) => handlePostRequest<any>('dashboard/main-count', payload, CMRF_NGO_ADMIN_SERVER);
//dashboard/transaction-type-count'
export const FetchPaymentDashboardTransactionTypeCountSerivce = (payload: any) => handlePostRequest<any>('dashboard/transaction-type-count', payload, CMRF_NGO_ADMIN_SERVER);
//dashboard/campaign-status-count
export const FetchPaymentDashboardCampaignStatusCountSerivce = (payload: any) => handlePostRequest<any>('dashboard/campaign-status-count', payload, CMRF_NGO_ADMIN_SERVER);




