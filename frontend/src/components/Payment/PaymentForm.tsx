import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import store from '../../redux/store';
import { BaseUrls } from '../../utils/base-urls';

// Dynamic Razorpay Script Loader
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PaymentForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const token = store.getState().authUser?.token;
    // Fallback URL if env is not perfect, assuming standard local setup or using the base-url util
    // We'll use the one from redux/utils if possible, or relative path if proxy is set up
    // But for safety, let's look at how ChatContext did it or just use relative if we trust the setup
    // ChatContext used: BaseUrls.CMRF_NGO_ADMIN_SERVER.url
    const baseURL = BaseUrls.CMRF_NGO_ADMIN_SERVER.url?.replace(/\/$/, '') || 'http://localhost:8080';

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            mobile: Yup.string()
                .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
                .required('Mobile number is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                // 1. Load Razorpay SDK
                const res = await loadRazorpay();
                if (!res) {
                    throw new Error('Razorpay SDK failed to load. Are you online?');
                }

                // 2. Create Order Backend
                // We'll hardcode amount 500 INR for this demo
                const amount = 500;

                const orderPayload = {
                    name: values.name,
                    email: values.email,
                    mobile: values.mobile,
                    amount: amount,
                };

                const orderResponse = await fetch(`${baseURL}/payment/create-order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}` // If route is protected
                    },
                    body: JSON.stringify(orderPayload),
                });

                if (!orderResponse.ok) {
                    const errData = await orderResponse.json();
                    throw new Error(errData.message || 'Failed to create order');
                }

                const orderData = await orderResponse.json();
                // Expecting: { status: "success", order_id: "order_xyz", key_id: "rzp_test_..." }

                // 3. Open Razorpay Options
                const options = {
                    key: orderData.key_id,
                    amount: amount * 100, // paise
                    currency: 'INR',
                    name: 'Camp CRM Payment',
                    description: 'Test Transaction',
                    image: 'https://example.com/your_logo', // Optional
                    order_id: orderData.order_id,
                    handler: async function (response: any) {
                        // 4. Verify Payment on Backend
                        try {
                            const verifyPayload = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            };

                            const verifyRes = await fetch(`${baseURL}/payment/verify-payment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(verifyPayload),
                            });

                            const verifyData = await verifyRes.json();
                            if (verifyRes.ok) {
                                setSuccess('Payment Successful! ID: ' + verifyData.body.payment_id);
                                formik.resetForm();
                            } else {
                                setError('Payment Verification Failed: ' + verifyData.message);
                            }
                        } catch (e: any) {
                            setError('Verification Error: ' + e.message);
                        }
                    },
                    prefill: {
                        name: values.name,
                        email: values.email,
                        contact: values.mobile,
                    },
                    theme: {
                        color: '#3399cc',
                    },
                };

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.on('payment.failed', function (response: any) {
                    setError('Payment Failed: ' + response.error.description);
                });
                rzp1.open();

            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Secure Payment
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                    Pay ₹500 for Test Order
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Full Name"
                        margin="normal"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        margin="normal"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        id="mobile"
                        name="mobile"
                        label="Mobile Number"
                        margin="normal"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                        helperText={formik.touched.mobile && formik.errors.mobile}
                    />

                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        disabled={loading}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default PaymentForm;
