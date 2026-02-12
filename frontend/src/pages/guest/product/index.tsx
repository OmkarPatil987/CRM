import { Link, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip,
    Grid,
    Stack,
    Divider,
    Paper,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import {
    Verified,
    Security,
    Description,
    Science,
    Event,
    EventBusy,
    VerifiedUser,
    QrCodeScanner,
    Domain,
    History
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { GuestProductDetailsService } from '../../../utils/services/guest.service';
import dayjs from 'dayjs';

// --- Interfaces based on new API structure ---
interface QRData {
    qr_id: number;
    qr_type: string;
    qr_path: string;
    created_at: string;
    updated_at: string;
}

interface ProductMaster {
    id: number;
    uuid: string;
    product_code: string;
    name: string;
    description: string;
    category: string;
    sub_category: string;
    status: boolean;
    created_at: string;
}

interface ProductDetail {
    id: number;
    uuid: string;
    type: string;
    gazette_notification_number: string;
    gazette_notification_date: string;
    biostimulant_title: string;
    biostimulant_composition: string;
    crops: string;
    doses: string;
    application_method: string;
    manufacturer_details: string;
    batch_name: string;
    company_name: string;
    manufacturing_date: string;
    expiry_date: string;
}

interface Company {
    id: number;
    company_name: string;
    address: string;
    gst_no: string;
}

interface ProductDetailsResponse {
    qr: QRData;
    product_master: ProductMaster;
    product_detail: ProductDetail;
    company: Company;
}

const GuestProductDetail: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [data, setData] = useState<ProductDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!uuid) return;
            setLoading(true);
            const res = await GuestProductDetailsService({ qr_uuid: uuid });
            if (res.code === 200 && res.data) {
                setData(res.data);
            } else {
                dispatch(showSnackbar({ type: 'error', message: 'Verification failed or product not found' }));
            }
            setLoading(false);
        };
        fetchProduct();
    }, [uuid, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
                <CircularProgress sx={{ color: '#13ae47' }} />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 3 }}>
                <Security sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight={700}>Verification Failed</Typography>
                <Typography color="text.secondary">This product code is invalid or has been revoked.</Typography>
            </Box>
        );
    }

    const { qr, product_master, product_detail, company } = data;

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>

            <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 2 }}>
                {/* Title Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Chip
                        label={`Authenticated Code: ${product_master.product_code}`}
                        sx={{ bgcolor: alpha('#13ae47', 0.1), color: '#13ae47', fontWeight: 800, fontSize: '11px', mb: 2, height: 28 }}
                    />
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', mb: 1 }}>
                        {product_master.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Verified Agricultural Product Details
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Left Side: Product Specs */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
                                    <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                        <Description fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>Product Specification</Typography>
                                </Stack>
                                <Grid container spacing={4}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Category</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{product_master.category}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Sub-category</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{product_master.sub_category}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Product Description</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mt: 0.5 }}>
                                            {product_master.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
                                    <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                        <Science fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>Batch & Usage Guidance</Typography>
                                </Stack>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Batch Identifier</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#13ae47' }}>{product_detail.batch_name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Recommended Dosage</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{product_detail.doses}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Manufacturing Date</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Event sx={{ fontSize: 18, color: 'text.disabled' }} />
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{dayjs(product_detail.manufacturing_date).format('MMM DD, YYYY')}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Expiration Date</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <EventBusy sx={{ fontSize: 18, color: 'text.disabled' }} />
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{dayjs(product_detail.expiry_date).format('MMM DD, YYYY')}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>Suitable For Following Crops</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {product_detail.crops.split(',').map((crop) => (
                                                <Chip key={crop} label={crop.trim()} variant="outlined" size="small" sx={{ borderRadius: '50px', fontWeight: 600, px: 1 }} />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* Right Side Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Compliance Card */}
                            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: alpha('#13ae47', 0.05), border: '1px solid', borderColor: alpha('#13ae47', 0.2), borderRadius: 4 }}>
                                <VerifiedUser sx={{ fontSize: 48, color: '#13ae47', mb: 2 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 3 }}>Compliance Status</Typography>
                                <Stack spacing={2} textAlign="left">
                                    <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: alpha('#13ae47', 0.1) }}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Gazette ID</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{product_detail.gazette_notification_number}</Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: alpha('#13ae47', 0.1) }}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Approval Date</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{dayjs(product_detail.gazette_notification_date).format('MMMM DD, YYYY')}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* Verification Metadata */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={3} color="text.disabled">
                                    <QrCodeScanner fontSize="small" />
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Verification Details</Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Code Type</Typography>
                                        <Typography variant="caption" fontWeight={800}>Secure {qr.qr_type}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Verification Date</Typography>
                                        <Typography variant="caption" fontWeight={800}>{dayjs().format('MMM DD, YYYY')}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* Manufacturer Info (Full Width) */}
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
                                <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                    <Domain fontSize="small" />
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>Manufacturer Information</Typography>
                            </Stack>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Company Name</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{company.company_name}</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" mt={1} color="text.secondary">
                                        <History sx={{ fontSize: 14 }} />
                                        <Typography variant="caption">Authorized Manufacturer</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Registration (GSTIN)</Typography>
                                    <Box sx={{ px: 2, py: 1, bgcolor: alpha('#13ae47', 0.05), border: '1px solid', borderColor: alpha('#13ae47', 0.1), borderRadius: 1, display: 'inline-block' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#13ae47' }}>
                                            {company.gst_no}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Registered Address</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                        {company.address}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>


            </Box>
        </Box>
    );
};

export default GuestProductDetail;