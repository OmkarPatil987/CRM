import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { VoluntaryFormValidationSchema } from './constant'
import { Autocomplete, Box, Button, Card, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { FetchDistrictListService, FetchTalukaListService, FetchVillageListService, GetCaptchImageService, StoreVoluntaryRegistrationService, VerifyCaptchaService } from '../../../../utils/services/flood.relied.service';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import { useDispatch } from 'react-redux';
import { Refresh } from '@mui/icons-material';
export interface ValuntaryReg {
    full_name: string;
    age: number;
    gender: string;
    mobile: string;
    email: string;
    village_id: string;
    other_village:string;
    taluka_id: string;
    district_id: string;
    pin_code: string;
    skills: string[];
    other_skill: string;
    emergency_name: string;
    emergency_relation: string;
    emergency_mobile: string;
    declaration: boolean;
}
const initialValues: ValuntaryReg = {
    full_name: "",
    age: 0,
    gender: "",
    mobile: "",
    email: "",
    village_id: "",
    taluka_id: "",
    other_village:"",
    district_id: "",
    pin_code: "",
    skills: [],
    other_skill: "",
    emergency_name: "",
    emergency_relation: "",
    emergency_mobile: "",
    declaration: false,
};
interface CaptchaData {
    captcha_image: string;
    uuid: string;
}
export const skillOptions = [
    { value: "Medical_Assistance", label: "Medical Assistance (Doctor / Nurse / Paramedic / Pharmacist)" },
    { value: "Logistics_Transport", label: "Logistics & Transport (Driver, Vehicle Support, Material Handling)" },
    { value: "Relief_Distribution", label: "Relief Distribution (Food, Water, Clothes, Medicines)" },
    { value: "Data_Entry_Tech_Support", label: "Data Entry / Technical Support" },
    { value: "Communication_Awareness", label: "Communication & Awareness Campaigns" },
    { value: "Rescue_Evacuation", label: "Rescue / Evacuation Support" },
    { value: "Other", label: "Other" },
];
interface CaptchaState {
    imageSrc: CaptchaData | null;
    captchaValue: string;
    verified: boolean;
    error: string;
}
const VoluntaryRegistration = () => {
    const [captchaState, setCaptchaState] = useState<CaptchaState>({
        imageSrc: null,
        captchaValue: '',
        verified: false,
        error: '',
    });
    const [districts, setDistricts] = useState<any[]>([]);
    const [talukas, setTalukas] = useState<any[]>([]);
    const [villages, setVillages] = useState<any[]>([]);
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: VoluntaryFormValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (!captchaState.captchaValue) {
                dispatch(showSnackbar({ type: 'error', message: 'Please verify the CAPTCHA.' }));
                return;
            }
            const payload = {
                captcha_uuid: captchaState.imageSrc?.uuid,
                captcha: captchaState.captchaValue,
                full_name: values.full_name,
                age: Number(values.age),
                gender: values.gender,
                mobile: values.mobile,
                email: values.email,
                village_id: Number(values.village_id) || 0,
                taluka_id: Number(values.taluka_id) || 0,
                district_id: values.district_id,
                pin_code: values.pin_code,
                open_for_all_areas: true,
                skills: values.other_skill !== "" ? [...values.skills, values.other_skill] : values.skills,
                emergency_name: values.emergency_name,
                emergency_relation: values.emergency_relation,
                other_village: values.other_village,
                emergency_mobile: values.emergency_mobile,
                declaration: values.declaration,
                user_type: 1
            }
            const { code, message } = await StoreVoluntaryRegistrationService(payload)
            if (code === 200) {
                dispatch(showSnackbar({
                    type: 'success',
                    message: 'Your Volunteer Registration was Successful! / आपली स्वयंसेवक नोंदणी यशस्वी झाली! Tumcha login ID आणि पासवर्ड मेलवर पाठवले गेले आहेत.'
                }));
                setCaptchaState({ imageSrc: null, captchaValue: '', verified: false, error: '', });
                resetForm();
            } else if (message === 'invalid captcha' && code !== 200) {
                dispatch(showSnackbar({ type: 'error', message: 'Invalid CAPTCHA. Please try again.' }));
                return
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Something went wrong' }));
            }
            getCaptchaImage()
        },
    });

    const fetchDistricts = async () => {
        const payload = { limit: 100, offset: 0 };
        const { code, data } = await FetchDistrictListService(payload);

        if (code === 200 && data?.data) {
            setDistricts(data.data);
        } else {
            setDistricts([]);
        }
    };

    const fetchTalukas = async (district_id: number) => {
        if (!district_id) return setTalukas([]);

        const payload = { district_id, limit: 1000, offset: 0 };
        const { code, data } = await FetchTalukaListService(payload);

        if (code === 200 && data?.data) {
            setTalukas(data.data);
        } else {
            setTalukas([]);
        }

        setVillages([]);
        formik.setFieldValue("taluka_id", "");
        formik.setFieldValue("village_id", "");
    };

    const fetchVillages = async (taluka_id: number) => {
        if (!taluka_id) return setVillages([]);

        const payload = { taluka_id, limit: 1000, offset: 0 };
        const { code, data } = await FetchVillageListService(payload);

        if (code === 200 && data?.data) {
            setVillages(data.data);
        } else {
            setVillages([]);
        }

        formik.setFieldValue("village_id", "");
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    useEffect(() => {
        fetchTalukas(Number(formik.values.district_id));
    }, [formik.values.district_id]);

    useEffect(() => {
        fetchVillages(Number(formik.values.taluka_id));
    }, [formik.values.taluka_id]);

    const getCaptchaImage = async () => {
        const { code, data } = await GetCaptchImageService({});
        if (code === 200) {
            setCaptchaState((prev) => ({
                ...prev,
                imageSrc: { captcha_image: data.captcha_image, uuid: data.uuid },
                verified: false,
                captchaValue: '',
                error: '',
            }));
        }
    };

    useEffect(() => {
        getCaptchaImage()
    }, [])

    return (
        <Card sx={{ mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 2, }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, mb: 2 }}>
                <Typography component="h1" variant="h5" fontWeight={700} color="text.primary">
                    Register Here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                    Help Flood Victims – Register as a Volunteer | पूरग्रस्तांना मदत करा – स्वयंसेवक म्हणून नोंदणी करा
                </Typography>
                <Box
                    sx={{
                        width: 200,
                        height: "4px",
                        bgcolor: "#FF9933",
                        borderRadius: 5,
                        my: 1,
                    }}
                />
                <Typography variant="subtitle1" color="text.secondary">
                    Please fill accurate personal information before submission. <br />
                </Typography>
            </Box>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Full Name /  पूर्ण नाव  <span style={{ color: 'red' }}>*</span></FormLabel>
                        <TextField
                            placeholder="Full Name"
                            name="full_name"
                            fullWidth
                            value={formik.values.full_name}
                            onChange={formik.handleChange}
                            error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                            helperText={formik.touched.full_name && formik.errors.full_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Mobile Number / मोबाइल नंबर <span style={{ color: "red" }}>*</span></FormLabel>
                        <TextField
                            placeholder="Mobile Number"
                            name="mobile"
                            fullWidth
                            value={formik.values.mobile}
                            onChange={(e) => {
                                const filtered = e.target.value.replace(/\D/g, "").slice(0, 10);
                                formik.setFieldValue("mobile", filtered);
                            }}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Gender / लिंग <span style={{ color: 'red' }}>*</span></FormLabel>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                            >
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                <FormControlLabel value="Other" control={<Radio />} label="Other" />
                            </RadioGroup>
                            {formik.touched.gender && formik.errors.gender && (
                                <FormHelperText error>
                                    {formik.errors.gender}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Age / वय <span style={{ color: "red" }}>*</span></FormLabel>
                        <TextField
                            placeholder="Age"
                            name="age"
                            fullWidth
                            value={formik.values.age}
                            onChange={(e) => {
                                const filtered = e.target.value.replace(/\D/g, "").slice(0, 2);
                                formik.setFieldValue("age", filtered);
                            }}
                            error={formik.touched.age && Boolean(formik.errors.age)}
                            helperText={formik.touched.age && formik.errors.age}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Email ID / ईमेल <span style={{ color: "red" }}>*</span></FormLabel>
                        <TextField
                            placeholder="Email ID"
                            name="email"
                            fullWidth
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>
                            Pin Code / पिन कोड <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <TextField
                            placeholder="Pin Code"
                            name="pin_code"
                            fullWidth
                            value={formik.values.pin_code}
                            onChange={(e) => {
                                const filtered = e.target.value.replace(/\D/g, "").slice(0, 6);
                                formik.setFieldValue("pin_code", filtered);
                            }}
                            error={formik.touched.pin_code && Boolean(formik.errors.pin_code)}
                            helperText={formik.touched.pin_code && formik.errors.pin_code}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>
                            Work District / काम करण्यासाठी जिल्हा <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <Autocomplete
                            size="small"
                            options={districts} // API response array
                            getOptionLabel={(opt) => opt.name}
                            value={districts.find((d) => d.id === formik.values.district_id) || null}
                            onChange={(_, newVal) => {
                                formik.setFieldValue("district_id", newVal?.id || "");
                                formik.setFieldValue("taluka_id", ""); // reset Taluka
                                formik.setFieldValue("village_id", ""); // reset Village
                                if (newVal?.id) {
                                    fetchTalukas(newVal.id); // fetch talukas for this district
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select District / जिल्हा निवडा"
                                    error={formik.touched.district_id && !!formik.errors.district_id}
                                    helperText={formik.touched.district_id && formik.errors.district_id}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Work Taluka / काम करण्यासाठी तालुका</FormLabel>
                        <Autocomplete
                            size="small"
                            options={talukas} // API response array filtered by district
                            getOptionLabel={(opt) => opt.name}
                            value={talukas.find((t) => t.id === formik.values.taluka_id) || null}
                            onChange={(_, newVal) => {
                                formik.setFieldValue("taluka_id", newVal?.id || "");
                                formik.setFieldValue("village_id", ""); // reset Village
                                if (newVal?.id) {
                                    fetchVillages(newVal.id); // fetch villages for this taluka
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select Taluka / तालुका निवडा"
                                    error={formik.touched.taluka_id && !!formik.errors.taluka_id}
                                    helperText={formik.touched.taluka_id && formik.errors.taluka_id}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel>Work Village / काम करण्यासाठी गाव </FormLabel>
                        <Autocomplete
                            size="small"
                            options={villages}
                            getOptionLabel={(opt) => opt.name}
                            value={villages.find((v) => v.id === formik.values.village_id) || null}
                            onChange={(_, newVal) => formik.setFieldValue("village_id", newVal?.id || "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select Work Village / काम करण्यासाठी गाव निवडा"
                                    error={formik.touched.village_id && !!formik.errors.village_id}
                                    helperText={formik.touched.village_id && formik.errors.village_id}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormLabel> Work Village Name / काम करण्यासाठी गावाचे नाव </FormLabel>
                        <TextField
                            placeholder="Work Village Name"
                            name="other_village"
                            fullWidth
                            value={formik.values.other_village}
                            onChange={formik.handleChange}
                            error={formik.touched.other_village && Boolean(formik.errors.other_village)}
                            helperText={formik.touched.other_village && formik.errors.other_village}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl
                            component="fieldset"
                            error={formik.touched.skills && Boolean(formik.errors.skills)}
                        >
                            <FormLabel component="legend"> Area of Support / सहाय्य क्षेत्र निवडा</FormLabel>
                            <FormGroup>
                                {skillOptions.map((skill) => (
                                    <FormControlLabel
                                        key={skill.value}
                                        control={
                                            <Checkbox
                                                checked={formik.values.skills.includes(skill.value)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        formik.setFieldValue("skills", [...formik.values.skills, skill.value]);
                                                    } else {
                                                        formik.setFieldValue(
                                                            "skills",
                                                            formik.values.skills.filter((s: string) => s !== skill.value)
                                                        );
                                                    }
                                                }}
                                            />
                                        }
                                        label={skill.label}
                                    />
                                ))}
                            </FormGroup>
                            {formik.values.skills.includes("Other") && (
                                <>
                                    <FormLabel>
                                        Other Skill / इतर कौशल्ये निर्दिष्ट करा <span style={{ color: "red" }}>*</span>
                                    </FormLabel>
                                    <TextField
                                        placeholder="Specify other skill"
                                        name="other_skill"
                                        fullWidth
                                        margin="normal"
                                        value={formik.values.other_skill}
                                        onChange={formik.handleChange}
                                        error={formik.touched.other_skill && Boolean(formik.errors.other_skill)}
                                        helperText={formik.touched.other_skill && formik.errors.other_skill}
                                    />
                                </>
                            )}

                            {formik.touched.skills && formik.errors.skills && (
                                <p style={{ color: "#d32f2f", fontSize: "0.75rem" }}>{formik.errors.skills}</p>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormLabel>Emergency Contact Name / संपर्काचे नाव <span style={{ color: 'red' }}>*</span></FormLabel>
                        <TextField
                            placeholder="Emergency Name"
                            name="emergency_name"
                            fullWidth
                            value={formik.values.emergency_name}
                            onChange={formik.handleChange}
                            error={formik.touched.age && Boolean(formik.errors.emergency_name)}
                            helperText={formik.touched.emergency_name && formik.errors.emergency_name}
                        />
                    </Grid>


                    {/* Emergency Relation */}
                    <Grid item xs={12} sm={4}>
                        <FormLabel>Relation / नाते <span style={{ color: 'red' }}>*</span></FormLabel>
                        <TextField
                            placeholder="Emergency Relation"
                            name="emergency_relation"
                            fullWidth
                            value={formik.values.emergency_relation}
                            onChange={formik.handleChange}
                            error={formik.touched.emergency_relation && Boolean(formik.errors.emergency_relation)}
                            helperText={formik.touched.emergency_relation && formik.errors.emergency_relation}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormLabel>Mobile Number / मोबाइल <span style={{ color: 'red' }}>*</span></FormLabel>
                        <TextField
                            placeholder="Emergency Mo No."
                            name="emergency_mobile"
                            fullWidth
                            value={formik.values.emergency_mobile}
                            onChange={(e) => {
                                const filtered = e.target.value.replace(/\D/g, "").slice(0, 10);
                                formik.setFieldValue("emergency_mobile", filtered);
                            }}
                            error={formik.touched.emergency_mobile && Boolean(formik.errors.emergency_mobile)}
                            helperText={formik.touched.emergency_mobile && formik.errors.emergency_mobile}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl
                            component="fieldset"
                            error={formik.touched.declaration && Boolean(formik.errors.declaration)}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formik.values.declaration || false}
                                        onChange={(e) => formik.setFieldValue("declaration", e.target.checked)}
                                    />
                                }
                                label="I confirm the information is correct and agree to volunteer for flood relief, following all safety instructions. /
                                    माहिती खरी आहे, पूर मदत कार्यासाठी स्वयंसेवक होण्यास सहमत आहे, आणि सर्व सुरक्षा सूचना पाळेन."
                            />
                            {formik.touched.declaration && formik.errors.declaration && (
                                <p style={{ color: "#d32f2f", fontSize: "0.75rem" }}>
                                    {formik.errors.declaration}
                                </p>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper
                            elevation={2}
                            sx={{
                                padding: 2,
                                borderRadius: 1,
                                mb: 2,
                                backgroundColor: '#fafafa',
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                CAPTCHA Verification
                            </Typography>

                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    {captchaState.imageSrc && (
                                        <Box
                                            component="img"
                                            src={captchaState.imageSrc.captcha_image}
                                            alt="captcha"
                                            sx={{
                                                height: 50,
                                                borderRadius: 1,
                                                border: '1px solid #ccc',
                                                backgroundColor: '#fff',
                                                px: 1,
                                            }}
                                        />
                                    )}
                                </Grid>

                                <Grid item>
                                    <IconButton onClick={getCaptchaImage} aria-label="Refresh Captcha" size="large" sx={{ border: '1px solid #ccc' }}>
                                        <Refresh fontSize="small" />
                                    </IconButton>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Enter CAPTCHA"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={captchaState.captchaValue}
                                        onChange={(e) =>
                                            setCaptchaState((prev) => ({
                                                ...prev,
                                                captchaValue: e.target.value,
                                                error: '',
                                            }))
                                        }
                                        error={!!captchaState.error}
                                        helperText={captchaState.error}
                                    />
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent={'center'}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color='success'
                                        size={'large'}
                                        sx={{ minWidth: '200px' }}
                                    >
                                        Submit Registration
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                </Grid>
            </form>
        </Card>
    )
}

export default VoluntaryRegistration