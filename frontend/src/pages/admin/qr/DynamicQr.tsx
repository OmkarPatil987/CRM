import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// MUI Imports
import {
    Box, Paper, Button, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Stack, TablePagination, Skeleton, Typography, Avatar,
    Switch, CircularProgress, MenuItem, Select, FormControl,
    InputLabel, Dialog, DialogContent, DialogTitle, Divider
} from "@mui/material";

// Icons
import {
    Add, Edit, FileDownload, Visibility, ContentCopy,
    Business, Inventory2, RestartAlt, QrCode2, Close
} from "@mui/icons-material";

import { jsPDF } from "jspdf";
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
import { FetchQRListService, FetchProductListService, FetchCompanyListService } from "../../../utils/services/product.service";

const loadImageAsBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
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

const DynamicQRList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector((state: RootState) => state.refresh.createQR);

    const [loading, setLoading] = useState(true);
    const [qrList, setQrList] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    // Popup State
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedQR, setSelectedQR] = useState<any>(null);

    const [payload, setPayload] = useState({
        offset: 0,
        limit: 10,
        company_uuid: "",
        product_master_uuid: "",
        type: "dynamic",
    });

    const fetchFilterData = useCallback(async () => {
        try {
            const [compRes, prodRes] = await Promise.all([
                FetchCompanyListService({ limit: 100, offset: 0 }),
                FetchProductListService({ limit: 100, offset: 0 })
            ]);
            if (compRes.code === 200) setCompanies(compRes.data?.data ?? []);
            if (prodRes.code === 200) setProducts(prodRes.data?.data ?? []);
        } catch (err) {
            console.error("Filter fetch failed", err);
        }
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
            dispatch(showSnackbar({ type: "error", message: "Failed to fetch QR list" }));
            setQrList([]);
        } finally {
            setLoading(false);
        }
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

    const handleDownload = async (row: any) => {
        if (!row.qr_path) return;
        setDownloadingId(row.detail_uuid);
        try {
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 100] });
            const base64 = await loadImageAsBase64(row.qr_path);
            if (base64) doc.addImage(base64, "PNG", 15, 10, 50, 50);
            doc.setFont("helvetica", "bold");
     
            doc.save(`${row.product_name}_QR.pdf`);
            dispatch(showSnackbar({ type: "success", message: "PDF Downloaded" }));
        } finally {
            setDownloadingId(null);
        }
    };

    const resetFilters = () => {
        setPayload(p => ({ ...p, company_uuid: "", product_master_uuid: "", offset: 0 }));
    };

    return (
        <Box sx={{ mx: "auto", px: 4, py: 4, bgcolor: "#f6f9f7", minHeight: "100vh" }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#0e1b12" }}>Dynamic QR Inventory</Typography>
                    <Typography variant="body2" sx={{ color: "#509574" }}>Manage your dynamic tracking labels.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/create-qr?type=dynamic")}
                    sx={{ bgcolor: '#13ae47', height: 44, borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#0f8c39' } }}
                >
                    Generate Dynamic QR
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #d1e6dc', overflow: 'hidden' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2.5, bgcolor: '#fff', borderBottom: '1px solid #d1e6dc' }}>
                    <FormControl size="small" sx={{ minWidth: 240 }}>
                        <InputLabel>Select Company</InputLabel>
                        <Select
                            label="Select Company"
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

                    <FormControl size="small" sx={{ minWidth: 240 }}>
                        <InputLabel>Select Product</InputLabel>
                        <Select
                            label="Select Product"
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

                    <IconButton onClick={resetFilters} sx={{ color: '#509574' }} title="Reset Filters">
                        <RestartAlt />
                    </IconButton>
                </Stack>

                <TableContainer>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead sx={{ bgcolor: '#f8fbfa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Preview</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Product & Manufacturer</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Batch Details</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={5}><Skeleton height={60} /></TableCell></TableRow>
                                ))
                            ) : qrList.length > 0 ? (
                                qrList.map((row) => (
                                    <TableRow key={row.detail_uuid} hover sx={{ '&:hover': { bgcolor: '#f0f9f4' } }}>
                                        <TableCell>
                                            <Tooltip title="Click to Preview">
                                                <Avatar
                                                    src={row.qr_path}
                                                    variant="rounded"
                                                    onClick={() => handleOpenPreview(row)}
                                                    sx={{ width: 48, height: 48, border: '1px solid #d1e6dc', cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                                                />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.product_name}</Typography>
                                            <Typography variant="caption" sx={{ color: '#509574' }}>{row.company_name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.product_code}</Typography>
                                            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Expiry: {row.expiry_date}</Typography>
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
                                                <Tooltip title="Copy Public Link">
                                                    <IconButton size="small" onClick={() => handleCopyLink(row.qr_uuid)} sx={{ color: '#0288d1' }}>
                                                        <ContentCopy fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Live Page">
                                                    <IconButton size="small" onClick={() => window.open(`/p/${row.qr_uuid}`, '_blank')} sx={{ color: '#509574' }}>
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download PDF">
                                                    <IconButton size="small" onClick={() => handleDownload(row)} disabled={downloadingId === row.detail_uuid}>
                                                        {downloadingId === row.detail_uuid ? <CircularProgress size={18} /> : <FileDownload fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => navigate(`/admin/create-qr?uuid=${row.product_master_uuid}&detail_uuid=${row.qr_uuid}`)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, color: '#509574' }}>No data available.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ borderTop: '1px solid #d1e6dc', bgcolor: '#f8fbfa' }}>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={payload.offset / payload.limit}
                        onPageChange={(_, page) => setPayload(p => ({ ...p, offset: page * p.limit }))}
                        rowsPerPage={payload.limit}
                        onRowsPerPageChange={(e) => setPayload(p => ({ ...p, limit: +e.target.value, offset: 0 }))}
                    />
                </Box>
            </Paper>

            {/* Centered QR Preview Popup */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                PaperProps={{ sx: { borderRadius: 5, width: '100%', maxWidth: 420, overflow: 'hidden' } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3, px: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>QR Preview</Typography>
                    <IconButton onClick={handleClosePreview} size="small" sx={{ bgcolor: '#f1f5f9' }}><Close fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    {selectedQR && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', mb: 3 }}>
                                <Box component="img" src={selectedQR.qr_path} alt="QR" sx={{ width: 240, height: 240, display: 'block' }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>{selectedQR.product_name}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>{selectedQR.company_name}</Typography>
                            <Divider sx={{ width: '100%', mb: 3, borderStyle: 'dashed' }} />
                            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                                <Button fullWidth variant="outlined" startIcon={<FileDownload />} onClick={() => handleDownload(selectedQR)} sx={{ borderRadius: 3, fontWeight: 700 }}>PDF</Button>
                                <Button fullWidth variant="contained" startIcon={<Visibility />} onClick={() => window.open(`/p/${selectedQR.qr_uuid}`, '_blank')} sx={{ borderRadius: 3, fontWeight: 700, bgcolor: '#13ae47', '&:hover': { bgcolor: '#0f8c39' } }}>Live Page</Button>
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default DynamicQRList;