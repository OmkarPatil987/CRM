import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box, Button, Card, Typography, Chip, Tabs, Tab, IconButton, Grid,
    Stack, Divider, Paper, Container, CircularProgress, Breadcrumbs,
    Link, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
    Download, CalendarMonth, Verified, Info, QrCode2, Person,
    MoreVert, NavigateNext, ContentCopy, Visibility, PictureAsPdf,
    Details
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import { FetchProductDetailsService } from '../../../../utils/services/product.service';
import { BaseUrls } from '../../../../utils/base-urls';
import { jsPDF } from "jspdf";
import { loadImageAsBase64 } from '../../qr/StaticList';

const S3_URL = BaseUrls.S3_BASE_URL.url;
const ITEMS_PER_PAGE = 6;

const ProductDetail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [tabValue, setTabValue] = useState(0);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // Popover State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);

    const uuid = searchParams.get('uuid');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, code } = await FetchProductDetailsService({ product_master_uuid: uuid });
                if (code === 200 && data) {
                    setProduct(data);
                }
            } catch (error) {
                dispatch(showSnackbar({ type: 'error', message: 'Error loading product' }));
            } finally {
                setLoading(false);
            }
        };
        if (uuid) fetchProduct();
    }, [uuid, dispatch]);

    const filteredDetails = useMemo(() => {
        if (!product) return [];
        return product.details.filter((d: any) => tabValue === 0 ? d.type === 'static' : d.type === 'dynamic');
    }, [product, tabValue]);

    const paginatedDetails = filteredDetails.slice(0, visibleCount);
    const hasMore = filteredDetails.length > visibleCount;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, batch: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedBatch(batch);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedBatch(null);
    };

    const handleCopyLink = () => {
        if (!selectedBatch?.qr_codes?.[0]?.qr_uuid) return;
        const publicUrl = `${window.location.origin}/p/${selectedBatch.qr_codes[0].qr_uuid}`;
        navigator.clipboard.writeText(publicUrl);
        dispatch(showSnackbar({ type: 'success', message: 'Link copied to clipboard!' }));
        handleMenuClose();
    };

    const handleViewLive = () => {
        if (!selectedBatch?.qr_codes?.[0]?.qr_uuid) return;
        window.open(`/p/${selectedBatch.qr_codes[0].qr_uuid}`, '_blank');
        handleMenuClose();
    };

    const handleDownloadPDF = async (batch: any) => {
        // Access the nested path: detail -> qr_codes[0] -> qr_path
        const qrCodeData = batch.qr_codes?.[0];
        if (!qrCodeData?.qr_path) {
            dispatch(showSnackbar({ type: "error", message: "QR path not found" }));
            return;
        }

        setDownloadingId(qrCodeData.qr_id);
        try {
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 100] });
            const base64 = await loadImageAsBase64(qrCodeData.qr_path);

            if (base64) {
                doc.addImage(base64, "PNG", 15, 10, 50, 50);
        
                doc.save(`${batch.batch_name}_Badge.pdf`);
                dispatch(showSnackbar({ type: "success", message: "PDF Downloaded" }));
            }
        } catch (err) {
            dispatch(showSnackbar({ type: "error", message: "Failed to generate PDF" }));
        } finally {
            setDownloadingId(null);
            handleMenuClose();
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
            <CircularProgress sx={{ color: '#13ec83' }} />
            <Typography variant="body2" sx={{ color: '#4c9a74', fontWeight: 700 }}>Fetching Secure Metadata...</Typography>
        </Box>
    );

    if (!product) return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography mb={2}>Product Not Found</Typography>
            <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f6f8f7' }}>
            {/* The main container starts here to wrap everything including Breadcrumbs */}
            <Container maxWidth="xl" sx={{ pt: 3, flex: 1 }}>

                {/* 1. BREADCRUMBS (INSIDE CONTAINER) */}
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" sx={{ color: '#4c9a74', opacity: 0.7 }} />}
                    sx={{ mb: 3 }}
                >
                    <Link underline="hover" sx={{ color: '#4c9a74', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>Home</Link>
                    <Link underline="hover" sx={{ color: '#4c9a74', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>Products</Link>
                    <Typography sx={{ color: '#0d1b15', fontSize: '13px', fontWeight: 700 }}>{product.product_name}</Typography>
                </Breadcrumbs>

                {/* 2. PAGE HEADER (TITLE + BUTTON) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0d1b15', letterSpacing: '-0.02em', fontSize: '2.5rem' }}>
                                {product.product_name}
                            </Typography>
                            <Chip
                                label="ACTIVE"
                                size="small"
                                sx={{ bgcolor: 'rgba(19, 236, 131, 0.15)', color: '#0d1b15', fontWeight: 800, fontSize: '10px', height: 22 }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ color: '#4c9a74', fontWeight: 600, fontSize: '16px' }}>
                                {product.company_name || 'AgroCorp Industries Ltd.'}
                            </Typography>
                            <Chip
                                label="Export Grade"
                                size="small"
                                sx={{ height: 24, borderRadius: '6px', bgcolor: '#e2e8e4', color: '#0d1b15', fontWeight: 700, fontSize: '11px' }}
                            />
                        </Stack>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<QrCode2 />}
                        onClick={() => navigate(`/admin/create-qr`)}
                        sx={{
                            bgcolor: '#13ec83', color: '#0d1b15', fontWeight: 800, px: 3, py: 1.2, borderRadius: '10px',
                            textTransform: 'none', fontSize: '15px', boxShadow: '0 4px 14px 0 rgba(19, 236, 131, 0.39)',
                            '&:hover': { bgcolor: '#10c970', boxShadow: '0 6px 20px rgba(19, 236, 131, 0.23)' }, transition: '0.2s'
                        }}
                    >
                        Generate QR Code
                    </Button>
                </Box>

                {/* 3. PRODUCT METADATA CARD (MATCHING IMAGE) */}
                <Card variant="outlined" sx={{ borderRadius: '16px', borderColor: '#e7f3ed', p: 4, mb: 4, boxShadow: 'none', bgcolor: '#fff' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
                        <Box sx={{ bgcolor: '#13ec83', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                            <Info sx={{ color: '#fff', fontSize: 16 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0d1b15', fontSize: '18px' }}>Product Metadata</Typography>
                    </Stack>

                    <Grid container spacing={4} rowSpacing={5}>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Product ID</Typography>
                            <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '16px' }}>{product.product_code || 'PR/6/00001'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Category</Typography>
                            <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '16px' }}>{product.category || 'Omkar Patil'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Sub-Category</Typography>
                            <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '16px' }}>{product.sub_category || 'Omkar Patil'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Manufacturing</Typography>
                            <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '16px' }}>{new Date(product.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Last Update</Typography>
                            <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '16px' }}>{new Date(product.updated_at).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Origin</Typography>
                            <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '16px' }}>Maharashtra, India</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography sx={{ color: '#4c9a74', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>Compliance</Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#13ec83' }}>
                                <Verified sx={{ fontSize: 18 }} />
                                <Typography sx={{ fontWeight: 800, fontSize: '16px' }}>A+ Verified</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>

                {/* 4. TABS (MATCHING IMAGE INDICATOR & TEXT) */}
                <Box sx={{ borderBottom: '1px solid #e7f3ed', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, v) => { setTabValue(v); setVisibleCount(ITEMS_PER_PAGE); }}
                        sx={{
                            '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', px: 3, fontSize: '14px', color: '#4c9a74', minWidth: 'auto' },
                            '& .Mui-selected': { color: '#0d1b15 !important' },
                            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#13ec83' }
                        }}
                    >
                        <Tab label="Static QR Codes" />
                        <Tab label="Dynamic QR Codes" />
                    </Tabs>
                    <Typography variant="caption" sx={{ color: '#4c9a74', fontWeight: 700, fontSize: '12px' }}>
                        Showing {paginatedDetails.length} of {filteredDetails.length} batches
                    </Typography>
                </Box>

                {/* 5. QR CARDS GRID */}
                <Grid container spacing={3}>
                    {paginatedDetails.length > 0 ? paginatedDetails.map((detail: any) => (
                        <Grid item xs={12} md={6} lg={4} key={detail.detail_uuid}>
                            <Card variant="outlined" sx={{
                                display: 'flex', gap: 2, p: 2.5, borderRadius: '16px', borderColor: '#e7f3ed', boxShadow: 'none',
                                transition: '0.3s', '&:hover': { borderColor: '#13ec83', transform: 'translateY(-4px)' }
                            }}>
                                <Box sx={{ width: 64, height: 64, bgcolor: '#f6f8f7', borderRadius: '12px', border: '1px solid #e7f3ed', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                    <QrCode2 sx={{ fontSize: 36, color: '#0d1b15' }} />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography noWrap sx={{ fontWeight: 800, color: '#0d1b15', fontSize: '15px' }}>{detail.batch_name || 'Production Batch'}</Typography>
                                        <Box sx={{ width: 8, height: 8, bgcolor: '#13ec83', borderRadius: '50%', mt: 0.5 }} />
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2.5}>
                                        <CalendarMonth sx={{ fontSize: 14, color: '#4c9a74' }} />
                                        <Typography sx={{ fontSize: '12px', color: '#4c9a74', fontWeight: 600 }}>{new Date(detail.created_at).toLocaleDateString()}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5}>
                                        <Button
                                            fullWidth size="small" variant="contained" disableElevation
                                            startIcon={downloadingId === detail.qr_codes?.[0]?.qr_id ? <CircularProgress size={14} color="inherit" /> : <Download sx={{ fontSize: '16px !important' }} />}
                                            onClick={() => handleDownloadPDF(detail)}
                                            disabled={downloadingId !== null}
                                            sx={{
                                                bgcolor: 'rgba(19, 236, 131, 0.1)', color: '#0d1b15', fontWeight: 800, fontSize: '11px',
                                                borderRadius: '8px', textTransform: 'none', py: 0.8,
                                                '&:hover': { bgcolor: 'rgba(19, 236, 131, 0.2)' }
                                            }}
                                        >
                                            {downloadingId === detail.qr_codes?.[0]?.qr_id ? 'Wait...' : 'Download'}
                                        </Button>
                                        <IconButton
                                            sx={{ bgcolor: '#e7f3ed', borderRadius: '8px', color: '#0d1b15', p: 1 }}
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, detail)}
                                        >
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </Card>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ py: 10, textAlign: 'center', borderRadius: '16px', borderStyle: 'dashed', bgcolor: 'transparent', borderColor: '#e7f3ed' }}>
                                <Typography sx={{ color: '#4c9a74', fontWeight: 600 }}>No batch history found.</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* 6. REUSABLE MENU */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: { borderRadius: '12px', mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', minWidth: 180, border: '1px solid #e7f3ed' }
                    }}
                >
                    <MenuItem onClick={handleCopyLink} sx={{ py: 1.2 }}>
                        <ListItemIcon><ContentCopy fontSize="small" sx={{ color: '#4c9a74' }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontWeight: 700, fontSize: '13px', color: '#0d1b15' }}>Copy Link</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleViewLive} sx={{ py: 1.2 }}>
                        <ListItemIcon><Visibility fontSize="small" sx={{ color: '#4c9a74' }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontWeight: 700, fontSize: '13px', color: '#0d1b15' }}>View Live Page</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleDownloadPDF(Details)} sx={{ py: 1.2 }}>
                        <ListItemIcon><PictureAsPdf fontSize="small" sx={{ color: '#4c9a74' }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontWeight: 700, fontSize: '13px', color: '#0d1b15' }}>Export PDF</ListItemText>
                    </MenuItem>
                </Menu>

                {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                            sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', px: 4, borderColor: '#e7f3ed', color: '#0d1b15' }}
                        >
                            View More Batches
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ProductDetail;