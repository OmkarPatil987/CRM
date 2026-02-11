import { UserTypeWisePagesConfig } from '../constant';
import { BaseUrls } from './base-urls';
import { AuthUserState } from './dto/response';

import CryptoJS from 'crypto-js';

const ENC_KEY_STRING = process.env.REACT_APP_ENCRYPTION_KEY;
const IV_STRING = process.env.REACT_APP_ENCRYPTION_IV;

const getEncryptionConfig = () => {
    if (!ENC_KEY_STRING || !IV_STRING) {
        throw new Error('Encryption key or IV is not defined in environment variables.');
    }
    const key = CryptoJS.enc.Utf8.parse(ENC_KEY_STRING);
    const iv = CryptoJS.enc.Utf8.parse(IV_STRING);
    return { keySize: 128, iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, key };
};

export function encryptText(plainText: any) {
    if (!plainText) return ''
    const config = getEncryptionConfig();
    let encPassword = CryptoJS.AES.encrypt(plainText, config.key, config);
    return encPassword.ciphertext.toString(CryptoJS.enc.Base64);
}

export const decryptText = (text: unknown): string => {
    if (typeof text !== 'string' || !text.trim()) return '';
    const config = getEncryptionConfig();
    try {
        const decrypted = CryptoJS.AES.decrypt(text, config.key, config);
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        return result ?? text;
    } catch {
        try {
            const parsed = JSON.parse(text);
            return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
        } catch {
            return text;
        }
    }
};

export const isObject = (obj: any) => typeof obj === 'object' && !Array.isArray(obj) && obj !== null

export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export const getComparator = <Key extends keyof any>(order: any, orderBy: Key,): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export const isLoggedIn = (state: AuthUserState) => {
    const { token, userDetails, session_expires } = state;
    if (!userDetails || !token) return false;
    if (!session_expires) return true;
    const expiresAt = new Date(session_expires).getTime();
    if (Number.isNaN(expiresAt)) return true;
    return Date.now() < expiresAt;
}


export const isAuthorizedPage = (userType: string) => {
    // const path = window.location.pathname;
    return true
    // if (userType in UserTypeWisePagesConfig) {
    //     const pages = UserTypeWisePagesConfig[userType as keyof typeof UserTypeWisePagesConfig];
    //     return pages.indexOf(path) > -1 || pages.indexOf(path + '/') > -1;
    // }
    // return false;
}

export const handleFilePreview = ( file: File | Blob | string | null, title: string, options: { setPreviewFile: (url: string) => void; setPreviewTitle: (title: string) => void; setOpenPreview: (open: boolean) => void; }, dispatch: any ) => {
    const { setPreviewFile, setPreviewTitle, setOpenPreview } = options;
    if (!file) {
        return;
    }
    setPreviewTitle(title);
    if (file instanceof File || file instanceof Blob) {
        const fileUrl = URL.createObjectURL(file);
        if (file.type === "application/pdf") {
            window.open(fileUrl, "_blank");
        } else {
            setPreviewFile(fileUrl);
            setOpenPreview(true);
        }
        setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } else if (typeof file === "string") {
        const fullUrl = BaseUrls.S3_BASE_URL.url + file;
        window.open(fullUrl, "_blank");
    } else {
        console.error("Unsupported file type:", file);
    }
};


export const AmountDisplay = (amount: number) => {
    if (!amount) {
        return '0';
    }
    const formattedAmount = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(amount);
    return `${formattedAmount}`;
};
