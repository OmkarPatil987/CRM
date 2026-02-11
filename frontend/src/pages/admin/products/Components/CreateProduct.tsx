import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Grid,
    TextField,
    CircularProgress,
    Typography,
    Breadcrumbs,
    Link,
    Paper
} from '@mui/material';
import { ChevronRight, InfoOutlined, CheckCircle, LightbulbOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import { StoreProductService, FetchProductDetailsService, UpdateProductService, FetchCompanyListService } from '../../../../utils/services/product.service';
import Autocomplete from '@mui/material/Autocomplete';

interface FormValues {
    company_id: number | null;
    name: string;
    description: string;
    category: string;
    sub_category: string;
}

const productValidationSchema = Yup.object().shape({
    company_id: Yup.number().typeError('Company must be selected').required('Company is required').nullable(),
    name: Yup.string().required('Product name is required').trim(),
    category: Yup.string().required('Category is required').trim(),
    sub_category: Yup.string().nullable().notRequired(),
    description: Yup.string().nullable().notRequired(),
});

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const uuid = searchParams.get('uuid');
    const isEdit = Boolean(uuid);

    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);

    const formik = useFormik<FormValues>({
        initialValues: {
            company_id: null,
            name: '',
            description: '',
            category: '',
            sub_category: '',
        },
        validationSchema: productValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = { ...values, product_name: values.name };
                let response: any;
                if (isEdit && uuid) {
                    response = await UpdateProductService({ ...payload, product_master_uuid: uuid });
                } else {
                    response = await StoreProductService(payload);
                }

                if (response?.code === 200) {
                    dispatch(showSnackbar({ type: 'success', message: isEdit ? 'Product updated' : 'Product saved' }));
                    navigate('/admin/products');
                }
            } catch (error) {
                dispatch(showSnackbar({ type: 'error', message: 'Failed to save product.' }));
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const compRes = await FetchCompanyListService({ offset: 0, limit: 1000, status: 'active' });
                if (compRes.code === 200) setCompanies(compRes.data.data);

                if (isEdit && uuid) {
                    setLoading(true);
                    const { data, code } = await FetchProductDetailsService({ product_master_uuid: uuid });
                    if (code === 200) {
                        formik.setValues({
                            company_id: data.company_id,
                            name: data.product_name || '',
                            description: data.description || '',
                            category: data.category || '',
                            sub_category: data.sub_category || '',
                        });
                    }
                }
            } finally { setLoading(false); }
        };
        fetchData();
    }, [isEdit, uuid]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="primary" /></Box>;

    return (
        <Box sx={{ maxWidth: '1024px', mx: 'auto', w: '100%', p: 4, fontFamily: 'Manrope, sans-serif' }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator={<ChevronRight sx={{ fontSize: 16, color: '#4c9a74' }} />} sx={{ mb: 2 }}>
                <Link underline="hover" sx={{ color: '#4c9a74', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>
                    Products
                </Link>
                <Typography sx={{ color: '#0d1b15', fontSize: '0.875rem', fontWeight: 500 }}>
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </Typography>
            </Breadcrumbs>

            {/* Page Heading */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#0d1b15', letterSpacing: '-0.02em', fontSize: '2.25rem' }}>
                    {isEdit ? 'Edit Product' : 'Add Product'}
                </Typography>
                <Typography sx={{ color: '#4c9a74', mt: 1 }}>
                    Register or update agricultural product details in the central compliance database.
                </Typography>
            </Box>

            {/* Form Card */}
            <Paper elevation={0} sx={{ border: '1px solid #e7f3ed', borderRadius: '0.75rem', overflow: 'hidden', bgcolor: '#fff' }}>
                <Box sx={{ p: 4, borderBottom: '1px solid #e7f3ed' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0d1b15', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <InfoOutlined sx={{ color: '#0fbd69' }} /> Basic Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4c9a74', mt: 0.5 }}>
                        Provide essential information about the product and its origin.
                    </Typography>
                </Box>

                <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        {/* Company Selection */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, color: '#0d1b15' }}>
                                Select Company <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <Autocomplete
                                options={companies}
                                getOptionLabel={(option) => option.company_name || ""}
                                value={companies.find(c => c.id === formik.values.company_id) || null}
                                onChange={(_, newValue) => formik.setFieldValue('company_id', newValue ? newValue.id : null)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose enterprise..."
                                        error={formik.touched.company_id && Boolean(formik.errors.company_id)}
                                        helperText={formik.touched.company_id && formik.errors.company_id}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
                                            '& fieldset': { border: 'none' }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Product Name */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, color: '#0d1b15' }}>
                                Product Name <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                name="name"
                                placeholder="e.g. Organic Nitrogen Fertilizer"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                sx={{
                                    '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
                                    '& fieldset': { border: 'none' }
                                }}
                            />
                        </Grid>

                        {/* Category (Changed to TextField) */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, color: '#0d1b15' }}>
                                Category <span style={{ color: '#ef4444' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                name="category"
                                placeholder="e.g. Fertilizers"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                error={formik.touched.category && Boolean(formik.errors.category)}
                                helperText={formik.touched.category && formik.errors.category}
                                sx={{
                                    '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
                                    '& fieldset': { border: 'none' }
                                }}
                            />
                        </Grid>

                        {/* Sub Category */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, color: '#0d1b15' }}>
                                Sub Category
                            </Typography>
                            <TextField
                                fullWidth
                                name="sub_category"
                                placeholder="e.g. Liquid Nutrients"
                                value={formik.values.sub_category}
                                onChange={formik.handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
                                    '& fieldset': { border: 'none' }
                                }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, color: '#0d1b15' }}>
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                name="description"
                                placeholder="Provide detailed specifications or compliance information..."
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
                                    '& fieldset': { border: 'none' }
                                }}
                            />
                            <Typography variant="caption" sx={{ color: '#4c9a74', mt: 1, display: 'block' }}>
                                Maximum 2000 characters. Please be specific for faster compliance review.
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Footer Actions */}
                    <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid #e7f3ed', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            onClick={() => navigate('/admin/products')}
                            sx={{ color: '#4c9a74', fontWeight: 700, px: 3 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={formik.isSubmitting}
                            startIcon={!formik.isSubmitting && <CheckCircle />}
                            sx={{
                                bgcolor: '#0fbd69',
                                '&:hover': { bgcolor: '#0da65a' },
                                borderRadius: '0.5rem',
                                px: 4, py: 1.2,
                                fontWeight: 800,
                                textTransform: 'none',
                                boxShadow: '0 8px 16px rgba(15, 189, 105, 0.2)'
                            }}
                        >
                            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Product'}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Pro Tip Box */}
            <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(15, 189, 105, 0.05)', border: '1px solid rgba(15, 189, 105, 0.2)', borderRadius: '0.5rem', display: 'flex', gap: 2 }}>
                <LightbulbOutlined sx={{ color: '#0fbd69' }} />
                <Typography variant="body2" sx={{ color: '#4c9a74' }}>
                    <strong>Pro Tip:</strong> Ensure that the "Product Name" matches the name listed on the manufacturer's compliance certificate. This will automatically speed up the validation process.
                </Typography>
            </Box>
        </Box>
    );
};

export default ProductForm;