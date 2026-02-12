export const USER_TYPE = {
    HOME: '/',
    GUEST: '',
    ADMIN: '/admin',
} as const;

export const NAVIGATE_AUTH = {
    AUTH: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    get LOGIN_PAGE() { return `${NAVIGATE_AUTH.AUTH}${NAVIGATE_AUTH.LOGIN}`; },
    get LOGOUT_PAGE() { return `${NAVIGATE_AUTH.AUTH}${NAVIGATE_AUTH.LOGOUT}`; },
} as const;

export const ERROR = {
    ERROR_403: '/403',
    get ERROR_403_PAGE() { return ERROR.ERROR_403; },
} as const;

export const NAVIGATE_MODULES = {
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
} as const;



export const NAVIGATE_ADMIN = {
    DASHBAORD: '/dashboard',
    PRODUCT: '/products',
    PRODUCT_CREATE: '/products/create',
    PRODUCT_DETAILS: '/products/details',
    LEADS: '/leads',
    LEAD_CREATE: '/leads/create',
    LEAD_DETAILS: '/leads/details/:uuid',
    CONTACTS: '/contacts',
    CONTACT_DETAILS: '/contacts/details/:id',
    DEALS_PIPELINE: '/deals-pipeline',
    DEAL_DETAILS: '/deals/details/:id',
    ACTIVITIES: '/activities',
    ACTIVITY_DETAILS: '/activities/details',
    REPORTS: '/reports',
    USERS: '/users',
    ///campanies
    CAMPANIES: '/companies',
    CAMPANIES_CREATE: '/company/create',
    QR_STATIC: '/static-qr',
    QR_DYNAMIC: '/dynamic-qr',
    QR_CREATE: '/create-qr',
    get DASHBOARD_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.DASHBAORD}`; },
    get LEADS_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.LEADS}`; },
    get LEAD_CREATE_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.LEAD_CREATE}`; },
    get LEAD_DETAILS_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.LEAD_DETAILS}`; },
    get CONTACTS_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.CONTACTS}`; },
    get CONTACT_DETAILS_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.CONTACT_DETAILS}`; },
    get DEALS_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.DEALS_PIPELINE}`; },
    get DEAL_DETAILS_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.DEAL_DETAILS}`; },
}

export const UserTypeWisePagesConfig: Record<keyof typeof USER_TYPE, string[]> = {
    HOME: [],
    GUEST: [],
    ADMIN: [USER_TYPE.ADMIN],
};

export const NAVIGATE_GUEST = {
    HOME: "/home",

}
