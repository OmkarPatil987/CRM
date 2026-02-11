import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    TextField,
    Button,
    Grid,
    Divider,
    CardContent,
    useTheme,
    Autocomplete,
} from "@mui/material";
import { Circle, LocationOn } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { StyledCard, StyledCardHeader, InfoItem } from "../../common/CommonDeatilsPageComponents";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { closeDrawer } from "../../../redux/reducer/drawerSlice";
import GlobalDrawerContent from "../GlobalDrawerContent";
import { FetchDistrictListService, FetchTalukaListService, FetchVillageListService, StoreUpdateFloodDetailsService } from "../../../utils/services/flood.relied.service";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { FloodDetailsStoreRequest } from "../../../utils/dto/request/flood-relief.type";
import { FetchDistrictListData, FetchTalukaListData, FetchVillageListData } from "../../../utils/dto/response/flood-relief.type";

const validationSchema = Yup.object({
    date: Yup.date().required("Please select the date. / कृपया दिनांक निवडा."),
    district_id: Yup.number().required("Please select the district. / कृपया जिल्हा निवडा."),
    taluka_id: Yup.number().required("Please select the taluka. / कृपया तालुका निवडा."),
    village_id: Yup.number().required("Please select the village. / कृपया गाव निवडा."),
    pin_code: Yup.string()
        .matches(/^\d{6}$/, "Pin code must be exactly 6 digits. / पिन कोड नेमके 6 अंकांचे असावे."),
        // .required("Please enter the pin code. / कृपया पिन कोड प्रविष्ट करा."),
    current_condition: Yup.string().required("Please select the current condition. / कृपया सध्याची परिस्थिती निवडा."),
    water_level: Yup.number()
        .min(0, "Water level must be at least 0. / पाण्याची पातळी किमान 0 असावी.")
        .max(100, "Water level cannot exceed 100 meters. / पाण्याची पातळी 100 मीटरपेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the water level. / कृपया पाण्याची पातळी प्रविष्ट करा."),
    affected_roads: Yup.number()
        .min(0, "Number of affected roads must be at least 0. / प्रभावित रस्त्यांची संख्या किमान 0 असावी.")
        .max(100000, "Number of affected roads cannot exceed 1,00,000. / प्रभावित रस्त्यांची संख्या 1,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of affected roads. / कृपया प्रभावित रस्त्यांची संख्या प्रविष्ट करा."),
    affected_houses: Yup.number()
        .min(0, "Number of affected houses must be at least 0. / प्रभावित घरांची संख्या किमान 0 असावी.")
        .max(1000000, "Number of affected houses cannot exceed 10,00,000. / प्रभावित घरांची संख्या 10,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of affected houses. / कृपया प्रभावित घरांची संख्या प्रविष्ट करा."),
    affected_population: Yup.number()
        .min(0, "Number of affected population must be at least 0. / प्रभावित लोकसंख्येची संख्या किमान 0 असावी.")
        .max(1000000, "Number of affected population cannot exceed 10,00,000. / प्रभावित लोकसंख्येची संख्या 10,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of affected population. / कृपया प्रभावित लोकसंख्येची संख्या प्रविष्ट करा."),
    flooded_houses: Yup.number()
        .min(0, "Number of flooded houses must be at least 0. / घरात पाणी गेलेल्या घरांची संख्या किमान 0 असावी.")
        .max(1000000, "Number of flooded houses cannot exceed 10,00,000. / घरात पाणी गेलेल्या घरांची संख्या 10,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of flooded houses. / कृपया घरात पाणी गेलेल्या घरांची संख्या प्रविष्ट करा."),
    houses_damaged: Yup.number()
        .min(0, "Number of damaged houses must be at least 0. / पडझड झालेल्या घरांची संख्या किमान 0 असावी.")
        .max(1000000, "Number of damaged houses cannot exceed 10,00,000. / पडझड झालेल्या घरांची संख्या 10,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of damaged houses. / कृपया पडझड झालेल्या घरांची संख्या प्रविष्ट करा."),
    dead_animals: Yup.number()
        .min(0, "Number of dead animals must be at least 0. / मयत जनावरांची संख्या किमान 0 असावी.")
        .max(100000, "Number of dead animals cannot exceed 1,00,000. / मयत जनावरांची संख्या 1,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of dead animals. / कृपया मयत जनावरांची संख्या प्रविष्ट करा."),
    lost_animals: Yup.number()
        .min(0, "Number of lost animals must be at least 0. / हरवलेले जनावरांची संख्या किमान 0 असावी.")
        .max(100000, "Number of lost animals cannot exceed 1,00,000. / हरवलेले जनावरांची संख्या 1,00,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of lost animals. / कृपया हरवलेले जनावरांची संख्या प्रविष्ट करा."),
    shifted_population: Yup.number()
        .min(0, "Number of shifted population must be at least 0. / स्थलांतरित लोकसंख्येची संख्या किमान 0 असावी.")
        .max(10000000, "Number of shifted population cannot exceed 10,000,000. / स्थलांतरित लोकसंख्येची संख्या 10,000,000 पेक्षा जास्त असू शकत नाही."),
        // .required("Please enter the number of shifted population. / कृपया स्थलांतरित लोकसंख्येची संख्या प्रविष्ट करा."),
    remark: Yup.string()
        .max(500, "Remark cannot exceed 500 characters. / टिप्पणी 500 अक्षरांपेक्षा जास्त असू शकत नाही.")
        .optional(),
});

interface FloodReportFormValues {
    uuid: string;
    date: Dayjs | null;
    district_id: number | null;
    taluka_id: number | null;
    village_id: number | null;
    pin_code: string;
    current_condition: string;
    water_level: string;
    affected_roads: string;
    affected_houses: string;
    affected_population: string;
    flooded_houses: string;
    houses_damaged: string;
    dead_animals: string;
    lost_animals: string;
    shifted_population: string;
    remark: string;
}

interface ConditionOption {
    label: string;
    value: string;
    icon: React.ReactNode;
}

const conditionOptions: ConditionOption[] = [
    { label: "Green / हिरवा (Safe / सुरक्षित)", value: "safe", icon: <Circle color="success" sx={{ fontSize: 12, ml: 1 }} /> },
    { label: "Amber / अंबर (Warning / इशारा)", value: "warning", icon: <Circle color="warning" sx={{ fontSize: 12, ml: 1 }} /> },
    { label: "Red / लाल (Danger / धोका)", value: "danger", icon: <Circle color="error" sx={{ fontSize: 12, ml: 1 }} /> },
    { label: "Yellow / पिवळा (Caution / खबरदारी)", value: "caution", icon: <Circle color="info" sx={{ fontSize: 12, ml: 1 }} /> },
];

const FloodReportForm = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { drawerData } = useSelector((state: RootState) => state.drawer);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [districts, setDistricts] = useState<FetchDistrictListData[]>([]);
    const [talukas, setTalukas] = useState<FetchTalukaListData[]>([]);
    const [villages, setVillages] = useState<FetchVillageListData[]>([]);

    const fetchDistricts = useCallback(async () => {
        const { code, data } = await FetchDistrictListService({ limit: 100, offset: 0 });
        if (code === 200 && data?.data) {
            setDistricts(data.data);
        } else {
            setDistricts([]);
        }
    }, []);

    const fetchTalukas = useCallback(async (district_id: number) => {
        const { code, data } = await FetchTalukaListService({ district_id, limit: 100, offset: 0 });
        if (code === 200 && data?.data) {
            setTalukas(data.data);
        } else {
            setTalukas([]);
        }
    }, []);

    const fetchVillages = useCallback(async (taluka_id: number) => {
        const { code, data } = await FetchVillageListService({ taluka_id, limit: 100, offset: 0 });
        if (code === 200 && data?.data) {
            setVillages(data.data);
        } else {
            setVillages([]);
        }
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [fetchDistricts]);



    const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, max: number) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= max)) {
            formik.setFieldValue(field, value);
        }
    };

    const handleDecimalInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, max: number) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        if ((value.match(/\./g) || []).length <= 1 && /^\d*\.?\d{0,4}$/.test(value)) {
            const numValue = parseFloat(value);
            if (value === "" || (numValue >= 0 && numValue <= max)) {
                formik.setFieldValue(field, value);
            }
        }
    };

    const handlePinCodeInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);

        formik.setFieldValue(field, value);
        formik.validateField(field);
    };

    const formik = useFormik<FloodReportFormValues>({
        initialValues: {
            uuid: drawerData?.uuid || "",
            date: drawerData?.date ? dayjs(drawerData.date) : null,
            district_id: drawerData?.district_id || null,
            taluka_id: drawerData?.taluka_id || null,
            village_id: drawerData?.village_id || null,
            pin_code: drawerData?.pin_code || "",
            current_condition: drawerData?.current_condition || "",
            water_level: drawerData?.water_level || "",
            affected_roads: drawerData?.affected_roads || "",
            affected_houses: drawerData?.affected_houses || "",
            affected_population: drawerData?.affected_population || "",
            flooded_houses: drawerData?.flooded_houses || "",
            houses_damaged: drawerData?.houses_damaged || "",
            dead_animals: drawerData?.dead_animals || "",
            lost_animals: drawerData?.lost_animals || "",
            shifted_population: drawerData?.shifted_population || "",
            remark: drawerData?.remark || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const payloadData: FloodDetailsStoreRequest = {
                ...(drawerData?.uuid && { uuid: values?.uuid }),
                date: values?.date?.format('YYYY-MM-DD') || "",
                district_id: values?.district_id,
                taluka_id: values?.taluka_id,
                village_id: values?.village_id,
                pin_code: values?.pin_code || "",
                current_condition: values?.current_condition,
                // water_level: parseFloat(values.water_level) || 0,
                water_level: values.water_level || "",
                affected_roads: parseInt(values.affected_roads) || 0,
                affected_houses: parseInt(values.affected_houses) || 0,
                affected_population: parseInt(values.affected_population) || 0,
                flooded_houses: parseInt(values.flooded_houses) || 0,
                houses_damaged: parseInt(values.houses_damaged) || 0,
                dead_animals: parseInt(values.dead_animals) || 0,
                lost_animals: parseInt(values.lost_animals) || 0,
                shifted_population: parseInt(values.shifted_population) || 0,
                remark: values.remark || "",
            };

            const { code, message } = await StoreUpdateFloodDetailsService(payloadData, Boolean(drawerData?.uuid));
            if (code === 200) {
                dispatch(showSnackbar({ type: "success", message: "Flood report submitted successfully / पूर अहवाल यशस्वीरित्या सादर केला" }));
                dispatch(setModuleRefresh({ moduleName: 'flood-relief', refresh: true }));
                dispatch(closeDrawer());
            } else {
                dispatch(showSnackbar({ type: "error", message: message || "Failed to submit flood report / पूर अहवाल सादर करण्यात अयशस्वी" }));
            }
            setIsSubmitting(false);
        },
    });

    useEffect(() => {
        if (formik.values.district_id) {
            fetchTalukas(formik.values.district_id);
            if (!drawerData?.district_id) {
                formik.setFieldValue("taluka_id", "");
                formik.setFieldValue("village_id", "");
                setTalukas([]);
                setVillages([]);
            }
        } else {
            setTalukas([]);
            setVillages([]);
        }
    }, [formik.values.district_id, fetchTalukas]);

    useEffect(() => {
        if (formik.values.taluka_id) {
            fetchVillages(formik.values.taluka_id);
            if (!drawerData?.taluka_id) {
                formik.setFieldValue("village_id", "");
                setVillages([]);
            }
        } else {
            setVillages([]);
        }
    }, [formik.values.taluka_id, fetchVillages]);

    return (
        <GlobalDrawerContent
            drawerBody={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box px={1}>
                        <StyledCard sx={{ mb: 2.5 }}>
                            <StyledCardHeader avatar={<LocationOn />} title="General Information / सामान्य माहिती" />
                            <Divider sx={{ borderColor: theme.palette.divider }} />
                            <CardContent sx={{ pt: 1, pb: 1 }}>
                                <Grid container spacing={2}>
                                    <InfoItem
                                        label={<>Date / दिनांक <span style={{ color: "red" }}>*</span></>}
                                        // md={3}
                                        value={
                                            <DatePicker
                                                value={formik.values.date}
                                                onChange={(value) => formik.setFieldValue("date", value)}
                                                format="DD/MM/YYYY"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        error: formik.touched.date && !!formik.errors.date,
                                                        helperText: formik.touched.date && formik.errors.date,
                                                        InputProps: {
                                                            sx: {
                                                                "& .MuiSvgIcon-root": {
                                                                    mr: 1,
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>District / जिल्हा <span style={{ color: "red" }}>*</span></>}
                                        // md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={districts}
                                                getOptionLabel={(opt) => opt.name}
                                                value={districts.find((d) => d.id === formik.values.district_id) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("district_id", newVal?.id || null)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select District / जिल्हा निवडा"
                                                        error={formik.touched.district_id && !!formik.errors.district_id}
                                                        helperText={formik.touched.district_id && formik.errors.district_id}
                                                    />
                                                )}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Taluka / तालुका <span style={{ color: "red" }}>*</span></>}
                                        // md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={talukas}
                                                getOptionLabel={(opt) => opt.name}
                                                value={talukas.find((t) => t.id === formik.values.taluka_id || drawerData?.taluka_id) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("taluka_id", newVal?.id || null)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select Taluka / तालुका निवडा"
                                                        error={formik.touched.taluka_id && !!formik.errors.taluka_id}
                                                        helperText={formik.touched.taluka_id && formik.errors.taluka_id}
                                                    />
                                                )}
                                                disabled={!formik.values.district_id}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Village / गाव <span style={{ color: "red" }}>*</span></>}
                                        // md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={villages}
                                                getOptionLabel={(opt) => opt.name}
                                                value={villages.find((v) => v.id === formik.values.village_id ||  drawerData?.village_id) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("village_id", newVal?.id || null)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select Village / गाव निवडा"
                                                        error={formik.touched.village_id && !!formik.errors.village_id}
                                                        helperText={formik.touched.village_id && formik.errors.village_id}
                                                    />
                                                )}
                                                disabled={!formik.values.taluka_id}
                                            />
                                        }
                                    />

                                    <InfoItem
                                        label={<>Pin Code / पिन कोड </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Pin Code / पिन कोड प्रविष्ट करा"
                                                value={formik.values.pin_code}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePinCodeInput(e, "pin_code")}
                                                onBlur={() => formik.validateField("pin_code")}
                                                error={formik.touched.pin_code && !!formik.errors.pin_code}
                                                helperText={formik.touched.pin_code && formik.errors.pin_code}
                                            />
                                        }
                                    />
                                </Grid>
                            </CardContent>
                        </StyledCard>
                        <StyledCard sx={{ mb: 2.5 }}>
                            <StyledCardHeader avatar={<LocationOn />} title="Flood Condition / पूर परिस्थिती" />
                            <Divider sx={{ borderColor: theme.palette.divider }} />
                            <CardContent sx={{ pt: 1, pb: 1 }}>
                                <Grid container spacing={2}>
                                    <InfoItem
                                        label={<>Current Condition / सध्याची परिस्थिती </>}
                                        // md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={conditionOptions}
                                                getOptionLabel={(opt) => opt.label}
                                                value={conditionOptions.find((c) => c.value === formik.values.current_condition) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("current_condition", newVal?.value || "")}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select Condition / परिस्थिती निवडा"
                                                        error={formik.touched.current_condition && !!formik.errors.current_condition}
                                                        helperText={formik.touched.current_condition && formik.errors.current_condition}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <li {...props}>
                                                        {option.label}
                                                        {option.icon}
                                                    </li>
                                                )}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Water Level (Meters) / पाण्याची पातळी (मीटर) </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Water Level / पाण्याची पातळी प्रविष्ट करा"
                                                value={formik.values.water_level}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDecimalInput(e, "water_level", 100)}
                                                error={formik.touched.water_level && !!formik.errors.water_level}
                                                helperText={formik.touched.water_level && formik.errors.water_level}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Affected Roads / प्रभावित रस्ते </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Affected Roads / प्रभावित रस्त्यांची संख्या प्रविष्ट करा"
                                                value={formik.values.affected_roads}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "affected_roads", 10000)}
                                                error={formik.touched.affected_roads && !!formik.errors.affected_roads}
                                                helperText={formik.touched.affected_roads && formik.errors.affected_roads}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Affected Houses / प्रभावित घरे </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Affected Houses / प्रभावित घरांची संख्या प्रविष्ट करा"
                                                value={formik.values.affected_houses}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "affected_houses", 100000)}
                                                error={formik.touched.affected_houses && !!formik.errors.affected_houses}
                                                helperText={formik.touched.affected_houses && formik.errors.affected_houses}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Affected Population / प्रभावित लोकसंख्या </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Affected Population / प्रभावित लोकसंख्येची संख्या प्रविष्ट करा"
                                                value={formik.values.affected_population}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "affected_population", 1000000)}
                                                error={formik.touched.affected_population && !!formik.errors.affected_population}
                                                helperText={formik.touched.affected_population && formik.errors.affected_population}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Flooded Houses / घरात पाणी गेलेले </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Flooded Houses / घरात पाणी गेलेल्या घरांची संख्या प्रविष्ट करा"
                                                value={formik.values.flooded_houses}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "flooded_houses", 100000)}
                                                error={formik.touched.flooded_houses && !!formik.errors.flooded_houses}
                                                helperText={formik.touched.flooded_houses && formik.errors.flooded_houses}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Houses Damaged / घर पडझड </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Damaged Houses / पडझड झालेल्या घरांची संख्या प्रविष्ट करा"
                                                value={formik.values.houses_damaged}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "houses_damaged", 100000)}
                                                error={formik.touched.houses_damaged && !!formik.errors.houses_damaged}
                                                helperText={formik.touched.houses_damaged && formik.errors.houses_damaged}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Dead Animals Found / मयत जनावरे (सापडलेले) </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Dead Animals / मयत जनावरांची संख्या प्रविष्ट करा"
                                                value={formik.values.dead_animals}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "dead_animals", 10000)}
                                                error={formik.touched.dead_animals && !!formik.errors.dead_animals}
                                                helperText={formik.touched.dead_animals && formik.errors.dead_animals}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Lost Animals / जनावरे वाय/गेलेले </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Lost Animals / हरवलेले जनावरांची संख्या प्रविष्ट करा"
                                                value={formik.values.lost_animals}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "lost_animals", 10000)}
                                                error={formik.touched.lost_animals && !!formik.errors.lost_animals}
                                                helperText={formik.touched.lost_animals && formik.errors.lost_animals}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Shifted Population (Estimated) / स्थलांतरित लोकसंख्या (अंदाजे) </>}
                                        // md={3}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Number of Shifted Population / स्थलांतरित लोकसंख्येची संख्या प्रविष्ट करा"
                                                value={formik.values.shifted_population}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInput(e, "shifted_population", 1000000)}
                                                error={formik.touched.shifted_population && !!formik.errors.shifted_population}
                                                helperText={formik.touched.shifted_population && formik.errors.shifted_population}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label={<>Remarks / टिप्पणी</>}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Remarks / टिप्पणी प्रविष्ट करा"
                                                value={formik.values.remark}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue("remark", e.target.value)}
                                                error={formik.touched.remark && !!formik.errors.remark}
                                                helperText={formik.touched.remark && formik.errors.remark}
                                                multiline
                                                rows={3}
                                            />
                                        }
                                    />
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Box>
                </LocalizationProvider>
            }
            drawerFooter={
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    onClick={() => formik.handleSubmit()}
                >
                    {isSubmitting ? "Submitting... / सादर करत आहे..." : "Submit / सादर करा"}
                </Button>
            }
        />
    );
};

export default FloodReportForm;