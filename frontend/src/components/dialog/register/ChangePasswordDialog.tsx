import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { TextField, Button, Box, Grid, IconButton, InputAdornment, Avatar, Typography } from '@mui/material';
import { CheckCircleOutline, RemoveRedEyeOutlined, VisibilityOffOutlined, LockOutlined } from '@mui/icons-material';

import { closeDialog } from '../../../redux/reducer/dialogSlice';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import GlobalDialogContent from '../GlobalDialogContent';
import { ChangeUserPasswordService } from '../../../utils/services/auth.service';

interface ChangePasswordForm {
    old_password: string;
    new_password: string;
    confirm_password: string;
}
const validationSchema = Yup.object({
    old_password: Yup.string()
        .min(8, 'Old password must be at least 8 characters')
        .required('Old password is required'),
    new_password: Yup.string()
        .min(8, 'New password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('New password is required'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password')], 'Passwords must match the new password')
        .required('Confirm password is required'),
});
const ChangePasswordDialog: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const formik = useFormik<ChangePasswordForm>({
        initialValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const payloadData = {
                current_password: values.old_password,
                new_password: values.new_password,
                confirm_password: values.confirm_password,
            };

            const { code, message } = await ChangeUserPasswordService(payloadData);
            if (code === 200) {
                dispatch(showSnackbar({ type: 'success', message: message || 'Your password has been changed successfully. Please log in using your new password.' }));
                dispatch(closeDialog());
                navigate('/auth/logout')
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to change password' }));
            }
        },
    });
    return (
        <Box>
            <GlobalDialogContent
                dialogBody={
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "primary.main", width: 54, height: 54, mb: 1 }}>
                                <LockOutlined fontSize="large" />
                            </Avatar>
                            <Typography variant="h5" fontWeight={700}>
                                Change Password
                            </Typography>
                        </Box>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type={showOldPassword ? 'text' : 'password'}
                                    label={<>Old Password <span style={{ color: 'red' }}>*</span></>}
                                    name="old_password"
                                    value={formik.values.old_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.old_password && Boolean(formik.errors.old_password)}
                                    helperText={formik.touched.old_password && formik.errors.old_password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                >
                                                    {showOldPassword ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type={showNewPassword ? 'text' : 'password'}
                                    label={<>New Password <span style={{ color: 'red' }}>*</span></>}
                                    name="new_password"
                                    value={formik.values.new_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.new_password && Boolean(formik.errors.new_password)}
                                    helperText={formik.touched.new_password && formik.errors.new_password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    label={<>Confirm Password <span style={{ color: 'red' }}>*</span></>}
                                    name="confirm_password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                }
                dialogFooter={
                    <Button
                        onClick={() => formik.handleSubmit()}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<CheckCircleOutline />}
                        disabled={formik.isSubmitting}
                    >
                        Change Password
                    </Button>
                }
            />
        </Box>
    );
};
export default ChangePasswordDialog;