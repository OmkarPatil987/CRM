export interface AuthUserState {
    userDetails: UserDetails | null;
    token: string | null;
    session_expires: string | null;
}

export interface LoginResponse {
    token: string | null;
    user: UserDetails | null;
}
export interface UserDetails {
    id: number;
    uuid: string;
    name: string;
    email: string;
    mobile: string;
    user_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user_id: string;
}
export type ForgotPassword = {
    email: string;
}
