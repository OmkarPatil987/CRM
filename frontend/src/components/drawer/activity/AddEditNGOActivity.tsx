import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, TextField, Button, Grid, InputAdornment, Divider, CardContent, useTheme, Autocomplete, } from "@mui/material";
import { CheckCircleOutline, LocationOn, Person } from "@mui/icons-material";
import GlobalDrawerContent from "../GlobalDrawerContent";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InfoItem, StyledCard, StyledCardHeader } from "../../common/CommonDeatilsPageComponents";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AddEditNgoActivitySerivce } from "../../../utils/services/ngo.registration.service";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { closeDrawer } from "../../../redux/reducer/drawerSlice";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { FetchDistrictListData, FetchTalukaListData, FetchVillageListData } from "../../../utils/dto/response/flood-relief.type";
import { FetchDistrictListService, FetchTalukaListService, FetchVillageListService } from "../../../utils/services/flood.relied.service";

const validationSchema = Yup.object({
    title: Yup.string().required("Please enter the activity title."),
    start_date: Yup.date()
        .required("Please select the start date.")
        .typeError("Invalid date format."),
    address: Yup.string().required("Please provide the address for the activity."),
    pincode: Yup.string()
        .required("Please enter the pincode.")
        .matches(/^\d{6}$/, "Pincode must be exactly 6 digits."),
    taluka_id: Yup.number().notRequired(),
    district_id: Yup.number().required("Please enter the district."),
    village_id: Yup.number().notRequired(),
    village_name: Yup.string().max(50, "Village Name cannot exceed 50 characters.").notRequired(),
    remarks: Yup.string().max(500, "Remarks cannot exceed 500 characters."),
    sub_category_id: Yup.number()
        .required("Please select a sub-category.")
        .min(1, "Please select a valid sub-category."),
    category_id: Yup.number()
        .required("Please select a category.")
        .min(1, "Please select a valid category."),
});


interface NGOActivityFormValues {
    title: string;
    start_date: Dayjs;
    address: string;
    pincode: string;
    village_name: string
    district_id: number | null;
    taluka_id: number | null;
    village_id: number | null;
    taluka_name: string;
    remarks: string,
    category_id: number,
    sub_category_id: number,
    beneficiary_count:string
    // created_by: string | null | undefined
}
type StatusType = "planed" | "completed";
interface SubCategory {
    id: number;
    name: string;
    slug: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    sub_categories: SubCategory[];
}
const categories: Category[] = [
    {
        "id": 1,
        "name": "Rescue & Evacuation",
        "slug": "rescue-evacuation",
        "sub_categories": [
            {
                "id": 11,
                "name": "Family Evacuation",
                "slug": "family-evacuation"
            },
            {
                "id": 12,
                "name": "Transport & Guidance",
                "slug": "transport-guidance"
            },
            {
                "id": 13,
                "name": "Special Rescue Operations",
                "slug": "special-rescue-operations"
            },
            {
                "id": 14,
                "name": "Emergency Setup",
                "slug": "emergency-setup"
            }
        ]
    },
    {
        "id": 2,
        "name": "Relief Distribution",
        "slug": "relief-distribution",
        "sub_categories": [
            {
                "id": 15,
                "name": "Basic Supplies",
                "slug": "basic-supplies"
            },
            {
                "id": 16,
                "name": "Coordination",
                "slug": "coordination"
            },
            {
                "id": 17,
                "name": "Special Needs Supplies",
                "slug": "special-needs-supplies"
            }
        ]
    },
    {
        "id": 3,
        "name": "Medical & Health Support",
        "slug": "medical-health-support",
        "sub_categories": [
            {
                "id": 18,
                "name": "First Aid & Health Services",
                "slug": "first-aid-health-services"
            },
            {
                "id": 19,
                "name": "Health Records & Monitoring",
                "slug": "health-records-monitoring"
            },
            {
                "id": 20,
                "name": "Public Health Awareness",
                "slug": "public-health-awareness"
            }
        ]
    },
    {
        "id": 4,
        "name": "Shelter Management",
        "slug": "shelter-management",
        "sub_categories": [
            {
                "id": 21,
                "name": "Setup & Organization",
                "slug": "setup-organization"
            },
            {
                "id": 22,
                "name": "Maintenance & Sanitation",
                "slug": "maintenance-sanitation"
            },
            {
                "id": 23,
                "name": "Volunteer Coordination",
                "slug": "volunteer-coordination"
            }
        ]
    },
    {
        "id": 5,
        "name": "Communication & Coordination",
        "slug": "communication-coordination",
        "sub_categories": [
            {
                "id": 24,
                "name": "Information Dissemination",
                "slug": "information-dissemination"
            },
            {
                "id": 25,
                "name": "Coordination",
                "slug": "coordination-communication"
            },
            {
                "id": 26,
                "name": "Documentation & Reporting",
                "slug": "documentation-reporting"
            },
            {
                "id": 27,
                "name": "Helpline Management",
                "slug": "helpline-management"
            }
        ]
    },
    {
        "id": 6,
        "name": "Psychological & Emotional Support",
        "slug": "psychological-emotional-support",
        "sub_categories": [
            {
                "id": 28,
                "name": "Victim Support",
                "slug": "victim-support"
            },
            {
                "id": 29,
                "name": "Children & Recreational Activities",
                "slug": "children-recreational-activities"
            },
            {
                "id": 30,
                "name": "Counseling Support",
                "slug": "counseling-support"
            }
        ]
    },
    {
        "id": 7,
        "name": "Post-Flood Recovery",
        "slug": "post-flood-recovery",
        "sub_categories": [
            {
                "id": 31,
                "name": "Cleanup & Restoration",
                "slug": "cleanup-restoration"
            },
            {
                "id": 32,
                "name": "Community Rehabilitation",
                "slug": "community-rehabilitation"
            },
            {
                "id": 33,
                "name": "Assessment & Surveys",
                "slug": "assessment-surveys"
            }
        ]
    },
    {
        "id": 8,
        "name": "Awareness & Education",
        "slug": "awareness-education",
        "sub_categories": [
            {
                "id": 34,
                "name": "Preparedness Training",
                "slug": "preparedness-training"
            },
            {
                "id": 35,
                "name": "Health & Safety Awareness",
                "slug": "health-safety-awareness"
            }
        ]
    },
    {
        "id": 9,
        "name": "Logistics & Support",
        "slug": "logistics-support",
        "sub_categories": [
            {
                "id": 36,
                "name": "Transportation & Storage",
                "slug": "transportation-storage"
            },
            {
                "id": 37,
                "name": "Resource Management",
                "slug": "resource-management"
            },
            {
                "id": 38,
                "name": "Camp Setup",
                "slug": "camp-setup"
            },
            {
                "id": 39,
                "name": "Donations",
                "slug": "donations"
            }
        ]
    },
    {
        "id": 10,
        "name": "Special Assistance",
        "slug": "special-assistance",
        "sub_categories": [
            {
                "id": 40,
                "name": "Vulnerable Groups Support",
                "slug": "vulnerable-groups-support"
            },
            {
                "id": 41,
                "name": "Legal & Documentation",
                "slug": "legal-documentation"
            },
            {
                "id": 42,
                "name": "NGO Coordination",
                "slug": "ngo-coordination"
            }
        ]
    }
]

const AddEditNGOActivity = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { drawerData } = useSelector((state: RootState) => state.drawer);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [districts, setDistricts] = useState<FetchDistrictListData[]>([]);
    const [talukas, setTalukas] = useState<FetchTalukaListData[]>([]);
    const [villages, setVillages] = useState<FetchVillageListData[]>([]);

    const theme = useTheme();
    const dispatch = useDispatch()
    const isUpdate: boolean = !!drawerData?.uuid;

    const formik = useFormik<NGOActivityFormValues>({
        initialValues: {
            title: drawerData?.title || '',
            start_date: drawerData?.start_date ? dayjs(drawerData.start_date) : dayjs(),
            address: drawerData?.address || "",
            pincode: drawerData?.pincode || "",
            taluka_id: drawerData?.taluka_id || "",
            village_name: drawerData?.other_village_name || "",
            district_id: drawerData?.district_id || "",
            village_id: drawerData?.village_id || "",
            remarks: drawerData?.remarks || "",
            sub_category_id: drawerData?.sub_category_id,
            category_id: drawerData?.category_id,
            taluka_name: drawerData?.taluka_name || "",
            beneficiary_count: drawerData?.beneficiary_count || ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            if (isUpdate && drawerData?.uuid) {
                formData.append("activity_uuid", drawerData?.uuid);
            }
            formData.append("title", values.title);
            formData.append("start_date", dayjs(values.start_date).format("YYYY-MM-DD"));
            formData.append("address", values.address);
            formData.append("pincode", values.pincode);

            // formData.append("taluka_id", String(values.taluka_id));
            formData.append("district_id", String(values.district_id));
            // formData.append("village_id", String(values.village_id));
            formData.append("other_village_name", values.village_name);
            formData.append("other_taluka_name", values.taluka_name);

            formData.append("remarks", values.remarks);

            formData.append("category_id", String(values.category_id));
            formData.append("sub_category_id", String(values.sub_category_id));
            formData.append("expected_beneficiary", String(values.beneficiary_count));

            setIsSubmitting(true)
            const { code, message } = await AddEditNgoActivitySerivce(formData, isUpdate);
            if (code === 200) {
                dispatch(closeDrawer());
                dispatch(setModuleRefresh({ moduleName: 'activity', refresh: true }))
                dispatch(showSnackbar({ type: "success", message: message || "Activity Added Successfully" }));
            } else {
                dispatch(showSnackbar({ type: "error", message: message || "Activity Failed to add" }));

            }
            setIsSubmitting(false);
        },
    });


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

    useEffect(() => {
        if (formik.values.district_id) {
            fetchTalukas(formik.values.district_id);
            formik.setFieldValue("taluka_id", "");
            formik.setFieldValue("village_id", "");
            setTalukas([]);
            setVillages([]);
        } else {
            setTalukas([]);
            setVillages([]);
        }
    }, [formik.values.district_id, fetchTalukas]);

    useEffect(() => {
        if (formik.values.taluka_id) {
            fetchVillages(formik.values.taluka_id);
            formik.setFieldValue("village_id", "");
            setVillages([]);
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
                            <StyledCardHeader avatar={<Person />} title="Activity Details" />
                            <Divider sx={{ borderColor: theme.palette.divider }} />
                            <CardContent sx={{ pt: 1, pb: 1 }}>
                                <Grid container spacing={2}>
                                    <InfoItem
                                        label="Title *"
                                        md={12}
                                        value={
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={2}
                                                size="small"
                                                placeholder="Enter activity title"
                                                {...formik.getFieldProps("title")}
                                                error={formik.touched.title && !!formik.errors.title}
                                                helperText={formik.touched.title && formik.errors.title}
                                            />
                                        }
                                    />
                                    <InfoItem
                                        label="Category *"
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={categories}
                                                getOptionLabel={(opt) => opt.name}
                                                value={
                                                    categories.find((c) => c.id === formik.values.category_id) ||
                                                    null
                                                }
                                                onChange={(_, newVal) => {
                                                    const id = newVal?.id ? newVal.id : "";
                                                    formik.setFieldValue("category_id", id);
                                                    formik.setFieldValue("sub_category_id", ""); // reset sub-cat
                                                    setSubCategories(newVal?.sub_categories || []);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        name="category_id"
                                                        error={
                                                            formik.touched.category_id && Boolean(formik.errors.category_id)
                                                        }
                                                        helperText={formik.touched.category_id && formik.errors.category_id}
                                                    />
                                                )}
                                            />
                                        }
                                        md={4}
                                    />

                                    <InfoItem
                                        label="Sub-Category *"
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={subCategories}
                                                getOptionLabel={(opt) => opt.name}
                                                value={
                                                    subCategories.find(
                                                        (sc) => sc.id === formik.values.sub_category_id
                                                    ) || null
                                                }
                                                onChange={(_, newVal) =>
                                                    formik.setFieldValue("sub_category_id", newVal?.id ? newVal.id : 0)
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        name="sub_category_id"
                                                        error={
                                                            formik.touched.sub_category_id &&
                                                            Boolean(formik.errors.sub_category_id)
                                                        }
                                                        helperText={
                                                            formik.touched.sub_category_id && formik.errors.sub_category_id
                                                        }
                                                    />
                                                )}
                                                disabled={subCategories.length === 0}
                                            />
                                        }
                                        md={4}
                                    />

                                    <InfoItem
                                        label="Activity Date"
                                        value={
                                            <DatePicker
                                                minDate={dayjs()}
                                                value={formik.values.start_date}
                                                onChange={(value) => formik.setFieldValue("start_date", value)}
                                                sx={{ '.MuiButtonBase-root': { marginRight: 0 } }}
                                                format="DD/MM/YYYY"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        error: !!formik.errors.start_date,
                                                        helperText: formik.errors.start_date ? String(formik.errors.start_date) : '',
                                                    },
                                                }}
                                            />
                                        }
                                        md={4}
                                    />

                                    <InfoItem
                                        label="Expected Beneficiary "
                                        md={3}
                                        value={
                                            <TextField size='small' fullWidth placeholder="Enter Beneficiary Count"
                                                name='beneficiary_count'
                                                onChange={(e) => {
                                                    const pincode = e.target.value;
                                                    formik.setFieldValue('beneficiary_count', pincode);
                                                }}
                                                value={formik.values.beneficiary_count}
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    onKeyDown: (e) => {
                                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    },
                                                }}
                                                error={!!formik.errors.beneficiary_count && formik.touched.beneficiary_count}
                                                helperText={formik.touched.beneficiary_count && formik.errors.beneficiary_count}
                                            />
                                        } />
                                </Grid>
                            </CardContent>
                        </StyledCard>
                        <StyledCard sx={{ mb: 2.5 }}>
                            <StyledCardHeader avatar={<Person />} title="Activity Location Details" />
                            <Divider sx={{ borderColor: theme.palette.divider }} />
                            <CardContent sx={{ pt: 1, pb: 1 }}>
                                <Grid container spacing={2}>
                                   
                                    <InfoItem
                                        label="Pincode *"
                                        md={3}
                                        value={
                                            <TextField size='small' fullWidth placeholder="Enter Pincode"
                                                name='pincode'
                                                onChange={(e) => {
                                                    const pincode = e.target.value;
                                                    formik.setFieldValue('pincode', pincode);
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
                                                error={!!formik.errors.pincode && formik.touched.pincode}
                                                helperText={formik.touched.pincode && formik.errors.pincode}
                                            />
                                        } />

                                    <InfoItem
                                        label={<>District / जिल्हा <span style={{ color: "red" }}>*</span></>}
                                        md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={districts}
                                                getOptionLabel={(opt) => opt.name}
                                                value={districts.find((d) => d.id === formik.values.district_id) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("district_id", newVal?.id || 0)}
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
                                        md={3}
                                        label={<>Taluka / तालुका</>}
                                        value={
                                            <TextField
                                                placeholder="Enter तालुका नाव / Taluka Name:"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="end">
                                                            <LocationOn />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                {...formik.getFieldProps("taluka_name")}
                                                error={formik.touched.taluka_name && !!formik.errors.taluka_name}
                                                helperText={formik.touched.taluka_name && formik.errors.taluka_name}
                                            />
                                        } />
                                    {/* <InfoItem
                                        label={<>Taluka / तालुका</>}
                                        md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={talukas}
                                                getOptionLabel={(opt) => opt.name}
                                                value={talukas.find((t) => t.id === formik.values.taluka_id) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("taluka_id", newVal?.id || 0)}
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
                                        label={<>Village / गाव </>}
                                        md={3}
                                        value={
                                            <Autocomplete
                                                size="small"
                                                options={villages}
                                                getOptionLabel={(opt) => opt.name}
                                                value={villages.find((v) => v.id === formik.values.village_id) || null}
                                                onChange={(_, newVal) => formik.setFieldValue("village_id", newVal?.id || 0)}
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
                                    /> */}
                                    {/* {JSON.stringify(formik.values)} */}
                                    <InfoItem
                                        md={3}
                                        label="गावाचे नाव / Village Name: *"
                                        value={
                                            <TextField
                                                placeholder="Enter गावाचे नाव / Village Name:"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="end">
                                                            <LocationOn />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                {...formik.getFieldProps("village_name")}
                                                error={formik.touched.village_name && !!formik.errors.village_name}
                                                helperText={formik.touched.village_name && formik.errors.village_name}
                                            />
                                        } />
                                    <InfoItem
                                        md={8}
                                        label="Address *"
                                        value={
                                            <TextField
                                                placeholder="Enter activity  address"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="end">
                                                            <LocationOn />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                {...formik.getFieldProps("address")}
                                                error={formik.touched.address && !!formik.errors.address}
                                                helperText={formik.touched.address && formik.errors.address}
                                            />
                                        } />
                                    <InfoItem
                                        label="Remarks"
                                        md={12}
                                        value={
                                            <TextField
                                                fullWidth
                                                size="small"
                                                multiline
                                                rows={2}
                                                placeholder="Please Enter Remarks"
                                                {...formik.getFieldProps("remarks")}
                                                error={formik.touched.remarks && !!formik.errors.remarks}
                                                helperText={formik.touched.remarks && formik.errors.remarks}
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
                <Button type="submit" disabled={isSubmitting} endIcon={<CheckCircleOutline />} variant="contained" color="success" onClick={() => formik.handleSubmit()}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            }
        />
    );
};

export default AddEditNGOActivity;
