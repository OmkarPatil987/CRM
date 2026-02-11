const ISLIVE = process.env.REACT_APP_IS_LIVE === '1'

export const BaseUrls: any = {
	S3_BASE_URL : {
		url: ISLIVE ? process.env.REACT_APP_S3_BUCKET_URL_LIVE : process.env.REACT_APP_S3_BUCKET_URL_UAT
	},
	CMRF_NGO_ADMIN_SERVER : {
		url: ISLIVE ? process.env.REACT_APP_API_BASE_URL_LIVE : process.env.REACT_APP_API_BASE_URL_UAT
	}
}

export const IMAGE_PATHS = {
	emailBackground: '/rugna-mitra/email-bg.jpg',
};