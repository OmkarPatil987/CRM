import ClientsAxios from '../client-axios';
import { LoginRequest } from '../dto/request/auth';
import { ForgotPassword, LoginResponse } from '../dto/response';
import { handlePostRequest } from './requestHandler';
const { CMRF_NGO_ADMIN_SERVER } = ClientsAxios;

export const loginService = (payload: LoginRequest) => handlePostRequest<LoginResponse>('user/login', payload, CMRF_NGO_ADMIN_SERVER);

export const VerifyLoginOTPService = (payload: any) => handlePostRequest<any>('verify-otp', payload, CMRF_NGO_ADMIN_SERVER);

export const ForgotPasswordService = (payload: ForgotPassword) => handlePostRequest<LoginResponse>('password/forgot', payload, CMRF_NGO_ADMIN_SERVER);

export const ResetPasswordService = (payload: any) => handlePostRequest<any>('password/reset', payload, CMRF_NGO_ADMIN_SERVER);

export const ChangeUserPasswordService = (payload: any) => handlePostRequest<any>('change-password', payload, CMRF_NGO_ADMIN_SERVER);

