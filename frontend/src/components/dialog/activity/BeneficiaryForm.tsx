import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography, InputAdornment, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PublicIcon from "@mui/icons-material/Public";
import GlobalDialogContent from "../GlobalDialogContent";
import { CheckOutlined } from "@mui/icons-material";
import { GetPincodeDetailsService, StoreActivityBeneficiarySerivce } from "../../../utils/services/ngo.registration.service";
import { closeDialog } from "../../../redux/reducer/dialogSlice";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { RootState } from "../../../redux/store";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").optional(),
    mobile_no: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
        .required("Pincode is required"),
    taluka: Yup.string().required("Taluka is required"),
    district: Yup.string().required("District is required"),
});

const BeneficiaryForm: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const uuid = useSelector((state: RootState) => state.dialog.payload)
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobile_no: "",
            address: "",
            pincode: "",
            taluka: "",
            district: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!uuid) {
                return
            }
            const payload = {
                ...values, activity_uuid: uuid
            }
            setLoading(true)
            const { code, message } = await StoreActivityBeneficiarySerivce(payload);
            if (code === 200) {
                dispatch(closeDialog());
                dispatch(setModuleRefresh({ moduleName: 'beneficiary', refresh: true }))
                dispatch(showSnackbar({ type: "success", message: message || "Beneficiary Added Successfully" }));
            } else {
                dispatch(showSnackbar({ type: "error", message: message || "Beneficiary Failed to add" }));

            }
            setLoading(false)

        },
    });
    const fetchPincodeDetails = async (pincode: string) => {
        const { code, data } = await GetPincodeDetailsService({ pincode: Number(pincode) });
        if (code === 200 && data) {
            formik.setFieldValue('taluka', data.taluka ?? '');
            formik.setFieldValue('district', data.district ?? '');
        } else {
            formik.setFieldValue('taluka', '');
            formik.setFieldValue('district', '');
        }
    };
    return (
        <GlobalDialogContent
            dialogBody={
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="name"
                            label="Full Name *"
                            placeholder="Enter Full Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && !!formik.errors.name}
                            helperText={formik.touched.name && formik.errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            placeholder="Enter Email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && !!formik.errors.email}
                            helperText={formik.touched.email && formik.errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="mobile_no"
                            placeholder="Enter Mobile Number"
                            label="Mobile Number *"
                            value={formik.values.mobile_no}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mobile_no && !!formik.errors.mobile_no}
                            helperText={formik.touched.mobile_no && formik.errors.mobile_no}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <PhoneIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="address"
                            placeholder="Enter Address"
                            label="Address *"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && !!formik.errors.address}
                            helperText={formik.touched.address && formik.errors.address}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <HomeIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField size='small'
                            fullWidth placeholder="Enter Pincode"
                            label='Pincode *'
                            name='pincode'
                            onChange={(e) => {
                                const pincode = e.target.value;
                                formik.setFieldValue('pincode', pincode);
                                if (pincode.length === 6) {
                                    fetchPincodeDetails(pincode);
                                } else {
                                    formik.setFieldValue('taluka', '');
                                    formik.setFieldValue('district', '');
                                }
                            }}
                            value={formik.values.pincode}
                            type="number"
                            inputProps={{
                                min: 0,
                                onKeyDown: (e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <PinDropIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!formik.errors.pincode && formik.touched.pincode}
                            helperText={formik.touched.pincode && formik.errors.pincode}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            name="taluka"
                            label="Taluka"
                            value={formik.values.taluka}
                            error={formik.touched.taluka && !!formik.errors.taluka}
                            helperText={formik.touched.taluka && formik.errors.taluka}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <LocationCityIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            name="district"
                            label="District"
                            value={formik.values.district}
                            error={formik.touched.district && !!formik.errors.district}
                            helperText={formik.touched.district && formik.errors.district}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <PublicIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            }
            dialogFooter={
                <Button
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    variant="contained"
                    color="success"
                    startIcon={<CheckOutlined />}
                    disabled={loading}
                >
                    Submit
                </Button>
            } />
    );
};

export default BeneficiaryForm;
