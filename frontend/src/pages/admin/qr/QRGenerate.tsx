import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";

// MUI Imports
import {
    Box, Button, Card, Grid, TextField,
    IconButton, Autocomplete, CircularProgress,
    Typography, Breadcrumbs, Link,
    Divider, Stack
} from "@mui/material";
import {
    ArrowBack, InfoOutlined, GavelOutlined,
    ChevronRight, Sync, QrCode2, Layers
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Redux & Services
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import PageHead from "../../../components/common/page/PageHead";
import { FetchProductListService, FetchQRDetailsService, StoreQRService, UpdateQRService } from "../../../utils/services/product.service";

interface FormValues {
    product_master_uuid: string;
    type: "static" | "dynamic" | "bulk";
    gazette_notification_number: string;
    gazette_notification_date: Dayjs | null;
    biostimulant_title: string;
    biostimulant_composition: string;
    crops: string;
    doses: string;
    application_method: string;
    manufacturer_details: string;
    company_name: string;
    batch_name: string;
    manufacturing_date: Dayjs | null;
    expiry_date: Dayjs | null;
}

const qrValidationSchema = Yup.object().shape({
    product_master_uuid: Yup.string().required("Product selection is required"),
    batch_name: Yup.string().required("Batch name/number is required"),
    company_name: Yup.string().required("Company name is required"),
    manufacturing_date: Yup.date().nullable().required("Mfg Date is required"),
    expiry_date: Yup.date().nullable().min(Yup.ref('manufacturing_date'), "Expiry must be after Mfg Date").required("Expiry Date is required"),
    gazette_notification_number: Yup.string().required("Gazette No. is required"),
    gazette_notification_date: Yup.date().nullable().required("Gazette Date is required"),
    type: Yup.string().required("QR Type is required"),
});

const QRForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const uuid = searchParams.get("uuid");
    const urlType = searchParams.get("type");
    const isEdit = Boolean(uuid);
    const initialType = (urlType === "dynamic" || urlType === "static" || urlType === "bulk") ? urlType : "static";

    const [initialValues, setInitialValues] = useState<FormValues>({
        product_master_uuid: "",
        type: initialType as any,
        gazette_notification_number: "",
        gazette_notification_date: null,
        biostimulant_title: "",
        biostimulant_composition: "",
        crops: "",
        doses: "",
        application_method: "",
        manufacturer_details: "",
        company_name: "",
        batch_name: "",
        manufacturing_date: null,
        expiry_date: null,
    });

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);

    const inputStyles = {
        '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
        '& fieldset': { border: 'none' }
    };

    // Helper to determine back navigation path based on type
    const getBackPath = (type: string) => {
        if (type === "dynamic") return "/admin/dynamic-qr";
        return "/admin/static-qr";
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { code, data } = await FetchProductListService({ offset: 0, limit: 1000 });
                if (code === 200 && data?.data) setProducts(data.data);

                if (isEdit && uuid) {
                    setLoading(true);
                    const res = await FetchQRDetailsService({ qr_uuid: uuid });
                    if (res.code === 200 && res.data) {
                        // MAPPING BASED ON YOUR PROVIDED JSON STRUCTURE
                        const detail = res.data.product_detail;
                        const master = res.data.product_master;

                        setInitialValues({
                            product_master_uuid: master?.uuid || "",
                            type: detail?.type || "static",
                            gazette_notification_number: detail?.gazette_notification_number || "",
                            gazette_notification_date: detail?.gazette_notification_date ? dayjs(detail.gazette_notification_date) : null,
                            biostimulant_title: detail?.biostimulant_title || "",
                            biostimulant_composition: detail?.biostimulant_composition || "",
                            crops: detail?.crops || "",
                            doses: detail?.doses || "",
                            application_method: detail?.application_method || "",
                            manufacturer_details: detail?.manufacturer_details || "",
                            company_name: detail?.company_name || "",
                            batch_name: detail?.batch_name || "",
                            manufacturing_date: detail?.manufacturing_date ? dayjs(detail.manufacturing_date) : null,
                            expiry_date: detail?.expiry_date ? dayjs(detail.expiry_date) : null,
                        });
                    }
                }
            } finally { setLoading(false); }
        };
        fetchInitialData();
    }, [isEdit, uuid]);

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const payload = {
            ...values,
            gazette_notification_date: values.gazette_notification_date?.format('YYYY-MM-DD'),
            manufacturing_date: values.manufacturing_date?.format('YYYY-MM-DD'),
            expiry_date: values.expiry_date?.format('YYYY-MM-DD'),
        };
        const response = isEdit ? await UpdateQRService({ ...payload, qr_uuid: uuid }) : await StoreQRService(payload);

        if (response.code === 200) {
            dispatch(showSnackbar({ type: "success", message: "QR Processed Successfully" }));
            navigate(getBackPath(values.type));
        }
        setSubmitting(false);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#06f957' }} /></Box>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: '1024px', mx: 'auto', p: { xs: 2, md: 4 }, fontFamily: 'Manrope' }}>

                {/* BREADCRUMBS: Product navigates based on type */}
                <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 3 }}>
                    <Link
                        underline="hover"
                        sx={{ color: '#4c9a74', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate(getBackPath(initialValues.type))}
                    >
                        {initialValues.type === "dynamic" ? "Dynamic QR Management" : "Static QR Management"}
                    </Link>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                        {isEdit ? 'Edit QR Code' : 'Generate QR Code'}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ mb: 4 }}>
                    <PageHead
                        primary={isEdit ? "Edit QR Code" : "Generate QR Code"}
                        secondary="Provide batch and regulatory details for compliance."
                        back={
                            <IconButton onClick={() => navigate(getBackPath(initialValues.type))} size="small" sx={{ mr: 1 }}>
                                <ArrowBack />
                            </IconButton>
                        }
                    />
                </Box>

                <Formik initialValues={initialValues} validationSchema={qrValidationSchema} onSubmit={handleSubmit} enableReinitialize>
                    {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
                        <Form>
                            {/* QR Type Toggle */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#888', textTransform: 'uppercase', mb: 1.5, display: 'block', letterSpacing: 1 }}>
                                    QR Code Type
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    {[
                                        { id: 'dynamic', label: 'Dynamic', icon: <Sync /> },
                                        { id: 'static', label: 'Static', icon: <QrCode2 /> },
                                        // { id: 'bulk', label: 'Bulk', icon: <Layers /> }
                                    ].map((item) => (
                                        <Box
                                            key={item.id}
                                            onClick={() => setFieldValue('type', item.id)}
                                            sx={{
                                                flex: 1, cursor: 'pointer', height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '20px',
                                                border: values.type === item.id ? '2px solid #06f957' : '1px solid #e0e0e0',
                                                bgcolor: values.type === item.id ? 'rgba(6, 249, 87, 0.05)' : '#fff',
                                                transition: 'all 0.2s ease', '&:hover': { borderColor: '#06f957' }
                                            }}
                                        >
                                            <Box sx={{ color: values.type === item.id ? '#0f2316' : '#999', mb: 0.5 }}>
                                                {React.cloneElement(item.icon as React.ReactElement, { sx: { fontSize: 24 } })}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: values.type === item.id ? '#0f2316' : '#999' }}>{item.label}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>

                            <Card sx={{ borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                                <Box sx={{ p: 4 }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                                        <Box sx={{ bgcolor: 'rgba(6, 249, 87, 0.1)', p: 1, borderRadius: 2, display: 'flex' }}><InfoOutlined sx={{ color: '#06f957' }} /></Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Section 1: Core Information</Typography>
                                    </Stack>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Select Product</Typography>
                                            <Autocomplete
                                                options={products} getOptionLabel={(option) => option.name || ""}
                                                value={products.find(p => p.uuid === values.product_master_uuid) || null}
                                                onChange={(_, val) => {
                                                    setFieldValue("product_master_uuid", val ? val.uuid : "");
                                                    // Auto-fill company name if product is selected
                                                    if (val?.company_name) setFieldValue("company_name", val.company_name);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params}
                                                        placeholder="Choose product..."
                                                        error={touched.product_master_uuid && !!errors.product_master_uuid}
                                                        helperText={touched.product_master_uuid && errors.product_master_uuid}
                                                        sx={inputStyles}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Company Name</Typography>
                                            <TextField
                                                fullWidth name="company_name"
                                                placeholder="Choice Agro..."
                                                value={values.company_name} onChange={handleChange}
                                                error={touched.company_name && !!errors.company_name}
                                                helperText={touched.company_name && errors.company_name}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Batch Name / Number</Typography>
                                            <TextField
                                                fullWidth name="batch_name"
                                                placeholder="e.g. BT-2024-XP-001"
                                                value={values.batch_name} onChange={handleChange}
                                                error={touched.batch_name && !!errors.batch_name}
                                                helperText={touched.batch_name && errors.batch_name}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Manufacturing Date</Typography>
                                            <DatePicker
                                                value={values.manufacturing_date}
                                                onChange={(val) => setFieldValue("manufacturing_date", val)}
                                                slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.manufacturing_date && !!errors.manufacturing_date, helperText: touched.manufacturing_date && (errors.manufacturing_date as string) } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Expiry Date</Typography>
                                            <DatePicker
                                                value={values.expiry_date}
                                                onChange={(val) => setFieldValue("expiry_date", val)}
                                                slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.expiry_date && !!errors.expiry_date, helperText: touched.expiry_date && (errors.expiry_date as string) } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Manufacturer Details</Typography>
                                            <TextField
                                                fullWidth multiline rows={2}
                                                name="manufacturer_details"
                                                placeholder="Enter full manufacturing address..."
                                                value={values.manufacturer_details} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderColor: '#f0f0f0' }} />

                                <Box sx={{ p: 4, bgcolor: '#fafafa' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                                        <Box sx={{ bgcolor: 'rgba(6, 249, 87, 0.1)', p: 1, borderRadius: 2, display: 'flex' }}><GavelOutlined sx={{ color: '#06f957' }} /></Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Section 2: Regulatory Details</Typography>
                                    </Stack>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Gazette No.</Typography>
                                            <TextField
                                                fullWidth name="gazette_notification_number"
                                                placeholder="e.g. REG-2024-001"
                                                value={values.gazette_notification_number} onChange={handleChange}
                                                error={touched.gazette_notification_number && !!errors.gazette_notification_number}
                                                helperText={touched.gazette_notification_number && errors.gazette_notification_number}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Gazette Date</Typography>
                                            <DatePicker
                                                value={values.gazette_notification_date}
                                                onChange={(val) => setFieldValue("gazette_notification_date", val)}
                                                slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.gazette_notification_date && !!errors.gazette_notification_date, helperText: touched.gazette_notification_date && (errors.gazette_notification_date as string) } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Biostimulant Title</Typography>
                                            <TextField
                                                fullWidth name="biostimulant_title"
                                                placeholder="Enter official title..."
                                                value={values.biostimulant_title} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Chemical Composition (%)</Typography>
                                            <TextField
                                                fullWidth multiline rows={3}
                                                name="biostimulant_composition"
                                                placeholder="List active ingredients..."
                                                value={values.biostimulant_composition} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Target Crops</Typography>
                                            <TextField
                                                fullWidth name="crops"
                                                placeholder="e.g. Wheat, Rice"
                                                value={values.crops} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Doses</Typography>
                                            <TextField
                                                fullWidth name="doses"
                                                placeholder="e.g. 2ml/L"
                                                value={values.doses} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Application Method</Typography>
                                            <TextField
                                                fullWidth name="application_method"
                                                placeholder="e.g. Foliar Spray"
                                                value={values.application_method} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: '#fff' }}>
                                    <Button variant="outlined" onClick={() => navigate(getBackPath(values.type))} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>Cancel</Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#06f957', color: '#000', borderRadius: 2, px: 5, fontWeight: 800, boxShadow: '0 8px 16px rgba(6, 249, 87, 0.2)', '&:hover': { bgcolor: '#05e64f' } }}>
                                        {isSubmitting ? "Processing..." : (isEdit ? "Update QR" : "Generate QR")}
                                    </Button>
                                </Box>
                            </Card>
                        </Form>
                    )}
                </Formik>
            </Box>
        </LocalizationProvider>
    );
};

export default QRForm;