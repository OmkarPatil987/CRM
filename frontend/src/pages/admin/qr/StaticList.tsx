import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Paper, Button, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Stack, TablePagination, Skeleton, Typography, Avatar,
    Switch, CircularProgress, MenuItem, Select, FormControl,
    InputLabel, Dialog, DialogContent, DialogTitle, Divider
} from "@mui/material";
import {
    Add, Edit, FileDownload, Visibility, ContentCopy,
    Business, Inventory2, RestartAlt, QrCode2, Close
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
import { FetchQRListService, FetchProductListService, FetchCompanyListService } from "../../../utils/services/product.service";

export const loadImageAsBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) return "";
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return "";
    }
};

const StaticQRList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector((state: RootState) => state.refresh.createQR);

    const [loading, setLoading] = useState(true);
    const [qrList, setQrList] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    // QR Preview Dialog State
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedQR, setSelectedQR] = useState<any>(null);

    const [payload, setPayload] = useState({
        offset: 0,
        limit: 10,
        company_uuid: "",
        product_master_uuid: "",
        type: "static",
    });

    const fetchFilterData = useCallback(async () => {
        try {
            const [compRes, prodRes] = await Promise.all([
                FetchCompanyListService({ limit: 100, offset: 0 }),
                FetchProductListService({ limit: 100, offset: 0 })
            ]);
            if (compRes.code === 200) setCompanies(compRes.data?.data ?? []);
            if (prodRes.code === 200) setProducts(prodRes.data?.data ?? []);
        } catch (err) { console.error("Filter fetch failed", err); }
    }, []);

    const getQRList = useCallback(async () => {
        setLoading(true);
        try {
            const { code, data } = await FetchQRListService(payload);
            if (code === 200) {
                setQrList(data?.data ?? []);
                setTotalCount(data?.total_count ?? 0);
                dispatch(resetRefresh());
            } else {
                setQrList([]);
                setTotalCount(0);
            }
        } catch (error) {
            dispatch(showSnackbar({ type: "error", message: "Failed to fetch Static QR list" }));
            setQrList([]);
        } finally { setLoading(false); }
    }, [payload, refresh, dispatch]);

    useEffect(() => { fetchFilterData(); }, [fetchFilterData]);
    useEffect(() => { getQRList(); }, [getQRList]);

    // Popup Handlers
    const handleOpenPreview = (row: any) => {
        setSelectedQR(row);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setSelectedQR(null);
    };

    const handleCopyLink = (qrUuid: string) => {
        const publicUrl = `${window.location.origin}/p/${qrUuid}`;
        navigator.clipboard.writeText(publicUrl);
        dispatch(showSnackbar({ type: "success", message: "Public link copied to clipboard!" }));
    };

    const handleDownloadPDF = async (row: any) => {
        if (!row.qr_path) return;
        setDownloadingId(row.detail_uuid);
        try {
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 100] });
            const base64 = await loadImageAsBase64(row.qr_path);
            if (base64) {
                doc.addImage(base64, "PNG", 15, 10, 50, 50);
          
                doc.text(`Batch: ${row.product_code || 'N/A'}`, 40, 82, { align: "center" });
                doc.save(`${row.product_name}_Static_Badge.pdf`);
                dispatch(showSnackbar({ type: "success", message: "PDF Downloaded" }));
            }
        } catch (err) {
            dispatch(showSnackbar({ type: "error", message: "Failed to generate PDF" }));
        } finally { setDownloadingId(null); }
    };

    const resetFilters = () => {
        setPayload(p => ({ ...p, company_uuid: "", product_master_uuid: "", offset: 0 }));
    };

    return (
        <Box sx={{ mx: "auto", px: 4, py: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>Static QR Inventory</Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>Filter and manage your static agricultural product labels.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/create-qr?type=static")}
                    sx={{ bgcolor: '#13ae47', height: 44, borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#0f8c39' } }}
                >
                    Generate Static QR
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Stack direction="row" spacing={2} sx={{ p: 2.5, bgcolor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Company</InputLabel>
                        <Select
                            label="Company"
                            value={payload.company_uuid}
                            onChange={(e) => setPayload(p => ({ ...p, company_uuid: e.target.value, offset: 0 }))}
                            startAdornment={<Business sx={{ mr: 1, color: '#13ae47' }} fontSize="small" />}
                        >
                            <MenuItem value="">All Companies</MenuItem>
                            {companies.map((c) => (
                                <MenuItem key={c.company_uuid} value={c.company_uuid}>{c.company_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Product</InputLabel>
                        <Select
                            label="Product"
                            value={payload.product_master_uuid}
                            onChange={(e) => setPayload(p => ({ ...p, product_master_uuid: e.target.value, offset: 0 }))}
                            startAdornment={<Inventory2 sx={{ mr: 1, color: '#13ae47' }} fontSize="small" />}
                        >
                            <MenuItem value="">All Products</MenuItem>
                            {products.map((p) => (
                                <MenuItem key={p.uuid} value={p.uuid}>{p.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <IconButton onClick={resetFilters} sx={{ color: '#64748b' }}><RestartAlt /></IconButton>
                </Stack>

                <TableContainer>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead sx={{ bgcolor: '#f9fafb' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>QR</TableCell>
                                <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Product Details</TableCell>
                                <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Batch & Dates</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={5}><Skeleton height={60} /></TableCell></TableRow>
                                ))
                            ) : qrList.length > 0 ? (
                                qrList.map((row) => (
                                    <TableRow key={row.detail_uuid} hover>
                                        <TableCell>
                                            <Tooltip title="Click to Preview">
                                                <Avatar
                                                    src={row.qr_path}
                                                    variant="rounded"
                                                    onClick={() => handleOpenPreview(row)}
                                                    sx={{ width: 48, height: 48, border: '1px solid #e2e8f0', p: 0.5, bgcolor: '#fff', cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' }, transition: '0.2s' }}
                                                />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.product_name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{row.company_name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>#{row.product_code}</Typography>
                                            <Typography variant="caption" sx={{ color: '#13ae47', fontWeight: 700 }}>Exp: {row.expiry_date}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch checked={row.status} size="small" color="success" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Preview QR">
                                                    <IconButton size="small" onClick={() => handleOpenPreview(row)} sx={{ color: '#fb8c00' }}>
                                                        <QrCode2 fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Copy Link">
                                                    <IconButton size="small" onClick={() => handleCopyLink(row.qr_uuid)} sx={{ color: '#0288d1' }}><ContentCopy fontSize="small" /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Page">
                                                    <IconButton size="small" onClick={() => window.open(`/p/${row.qr_uuid}`, '_blank')} sx={{ color: '#4c9a74' }}><Visibility fontSize="small" /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download PDF">
                                                    <IconButton size="small" onClick={() => handleDownloadPDF(row)} disabled={downloadingId === row.detail_uuid}>
                                                        {downloadingId === row.detail_uuid ? <CircularProgress size={18} /> : <FileDownload fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => navigate(`/admin/create-qr?uuid=${row.product_master_uuid}&detail_uuid=${row.qr_uuid}&type=static`)}><Edit fontSize="small" /></IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><Typography color="text.secondary">No static QRs found.</Typography></TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={payload.offset / payload.limit}
                    onPageChange={(_, page) => setPayload(p => ({ ...p, offset: page * payload.limit }))}
                    rowsPerPage={payload.limit}
                    onRowsPerPageChange={(e) => setPayload(p => ({ ...p, limit: +e.target.value, offset: 0 }))}
                />
            </Paper>

            {/* --- QR PREVIEW POPUP --- */}
            {/* --- QR PREVIEW POPUP --- */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                PaperProps={{
                    sx: {
                        borderRadius: 5,
                        width: '100%',
                        maxWidth: 420,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 3,
                    px: 3
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        QR Code Preview
                    </Typography>
                    <IconButton onClick={handleClosePreview} size="small" sx={{ bgcolor: '#f1f5f9' }}>
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 4 }}>
                    {selectedQR && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}>
                            {/* QR Image Container with centered styling */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    bgcolor: '#fff',
                                    p: 2,
                                    borderRadius: 4,
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e2e8f0',
                                    mb: 3,
                                    lineHeight: 0 // Removes extra bottom whitespace in some browsers
                                }}
                            >
                                <Box
                                    component="img"
                                    src={selectedQR.qr_path}
                                    alt="QR Preview"
                                    sx={{
                                        width: 240,
                                        height: 240,
                                        display: 'block'
                                    }}
                                />
                            </Box>

                            {/* Text Content */}
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>
                                {selectedQR.product_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 3 }}>
                                {selectedQR.company_name}
                            </Typography>

                            <Divider sx={{ width: '100%', mb: 3, borderStyle: 'dashed' }} />

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<FileDownload />}
                                    onClick={() => handleDownloadPDF(selectedQR)}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        py: 1.2,
                                        borderColor: '#e2e8f0',
                                        color: '#475569'
                                    }}
                                >
                                    PDF
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<Visibility />}
                                    onClick={() => window.open(`/p/${selectedQR.qr_uuid}`, '_blank')}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        py: 1.2,
                                        bgcolor: '#13ae47',
                                        boxShadow: '0 4px 12px rgba(19, 174, 71, 0.25)',
                                        '&:hover': { bgcolor: '#0f8c39' }
                                    }}
                                >
                                    Live Page
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default StaticQRList;