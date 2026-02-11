import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TablePagination, TextField, Typography, Chip, IconButton,
    InputAdornment, Button, Avatar, Stack, Tooltip, Divider, Breadcrumbs,
    Link, Skeleton, Drawer,
    Grid
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Add as AddIcon,
    ChevronRight,
    Visibility,
    Close as CloseIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    AccountBalance as BankIcon
} from '@mui/icons-material';
import { FetchCompanyListService } from '../../../utils/services/product.service';

const CompanyList = () => {
    const navigate = useNavigate();

    // State
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);

    const inputStyles = {
        '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none', borderRadius: '0.75rem' },
        '& fieldset': { border: 'none' }
    };

    const fetchCompanies = async () => {
        setLoading(true);
        const payload = {
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            search: searchQuery,
        };
        try {
            const { code, data } = await FetchCompanyListService(payload);
            if (code === 200 && data?.data) {
                setCompanies(data.data);
                setTotalCount(data.total_count);
            } else {
                setCompanies([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [page, rowsPerPage]);

    const handleViewDetails = (company: any) => {
        setSelectedCompany(company);
        setDrawerOpen(true);
    };

    const handleEdit = (uuid: string) => {
        navigate(`/admin/company/create?uuid=${uuid}`);
    };

    // Helper to render Detail Rows in Drawer
    const DetailItem = ({ label, value }: { label: string, value: any }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#4c9a74', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label.replace(/_/g, ' ')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#0d1b15' }}>
                {value === true ? 'Yes' : value === false ? 'No' : value || 'N/A'}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f6f8f7', minHeight: '100vh' }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator={<ChevronRight fontSize="small" sx={{ color: '#4c9a74' }} />} sx={{ mb: 2 }}>
                <Link underline="hover" sx={{ color: '#4c9a74', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Dashboard</Link>
                <Typography sx={{ color: '#0d1b15', fontSize: '0.875rem', fontWeight: 600 }}>Companies</Typography>
            </Breadcrumbs>

            {/* Page Heading */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} gap={3}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0d1b15', letterSpacing: '-0.02em' }}>Companies</Typography>
                    <Typography sx={{ color: '#4c9a74', mt: 1 }}>Manage and track registered enterprises in the compliance network.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/company/create')}
                    sx={{ bgcolor: '#0fbd69', borderRadius: '0.75rem', px: 3, height: 44, fontWeight: 700, textTransform: 'none' }}
                >
                    New Company
                </Button>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e7f3ed', overflow: 'hidden' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #e7f3ed' }}>
                    <TextField
                        size="small"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchCompanies()}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#4c9a74' }} /></InputAdornment>,
                        }}
                        sx={{ ...inputStyles, width: 350 }}
                    />
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 1100 }}>
                        <TableHead sx={{ bgcolor: '#f8fbfa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Company Details</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact Info</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>GST / PAN</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={5}><Skeleton height={60} /></TableCell></TableRow>
                                ))
                            ) : (
                                companies.map((row) => (
                                    <TableRow key={row.company_uuid} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar variant="rounded" sx={{ bgcolor: '#e7f3ed', color: '#0fbd69', fontWeight: 700 }}>
                                                    {row.company_name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{row.company_name}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#4c9a74' }}>ID: {row.id}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{row.email}</Typography>
                                            <Typography variant="caption" color="text.secondary">{row.mobile}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>GST: {row.gst_no}</Typography>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>PAN: {row.pan_no}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={row.is_active ? "Active" : "Inactive"} size="small" color={row.is_active ? "success" : "default"} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="View Details">
                                                    <IconButton size="small" onClick={() => handleViewDetails(row)} sx={{ color: '#4c9a74' }}>
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => handleEdit(row.company_uuid)} sx={{ color: '#0fbd69' }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Card>

            {/* Company Details Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, p: 3, borderLeft: '1px solid #e7f3ed' } }}
            >
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#0d1b15' }}>Company Profile</Typography>
                    <IconButton onClick={() => setDrawerOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {selectedCompany && (
                    <Box sx={{ overflowY: 'auto' }}>
                        {/* Header Badge */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, bgcolor: '#f8fbfa', borderRadius: 3 }}>
                            <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: '#0fbd69' }}>
                                <BusinessIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedCompany.company_name}</Typography>
                                <Chip label={selectedCompany.is_active ? "Active" : "Inactive"} size="small" color="success" sx={{ height: 20, fontSize: 10 }} />
                            </Box>
                        </Box>

                        {/* Basic Contact Info */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="primary" /> Basic Information
                        </Typography>
                        <DetailItem label="Email" value={selectedCompany.email} />
                        <DetailItem label="Mobile" value={selectedCompany.mobile} />
                        <DetailItem label="Referral Name" value={selectedCompany.referral_name} />

                        <Divider sx={{ my: 3 }} />

                        {/* Address */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon fontSize="small" color="primary" /> Location details
                        </Typography>
                        <DetailItem label="Full Address" value={selectedCompany.address} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}><DetailItem label="City" value={selectedCompany.city} /></Grid>
                            <Grid item xs={6}><DetailItem label="State" value={selectedCompany.state} /></Grid>
                            <Grid item xs={6}><DetailItem label="Pincode" value={selectedCompany.pincode} /></Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Legal & Banking */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BankIcon fontSize="small" color="primary" /> Legal & Banking
                        </Typography>
                        <DetailItem label="GST Number" value={selectedCompany.gst_no} />
                        <DetailItem label="PAN Number" value={selectedCompany.pan_no} />
                        <DetailItem label="Bank Account" value={selectedCompany.bank_account_no} />
                        <DetailItem label="IFSC Code" value={selectedCompany.bank_ifsc_code} />

                        <Box sx={{ mt: 4, mb: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => handleEdit(selectedCompany.company_uuid)}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </Box>
    );
};

export default CompanyList;