import React, { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    IconButton,
    InputAdornment,
    FormHelperText,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import GlobalDialogContent from "../GlobalDialogContent";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { StoreMOUpdfService } from "../../../utils/services/ngo.registration.service";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { closeDialog } from "../../../redux/reducer/dialogSlice";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";


const SignatureSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    name: Yup.string().required("Name is required"),
    designation: Yup.string().required("Designation is required"),
});

const ValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    date: Yup.string().required("MOU date is required"),
    year_of_bond: Yup.string().required("Year of bond is required"),
    signatures: Yup.array().of(SignatureSchema).min(1, "At least one signature"),
});

export default function MOUCreateForm() {
    const dispatch = useDispatch()
    const data = useSelector((state: RootState) => state.dialog.payload);
    const refresh = useSelector((state: RootState) => state.refresh)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const initialValues = {
        title: '',
        date: dayjs(),
        year_of_bond: dayjs(),
        signatures: [
            { type: "For the Chief Minister's Relief Fund (CMRF)", name: "Shri Ramesh Patil", designation: "Joint Secretary", date: dayjs().format("YYYY-MM-DD") },
            { type: "For", name: data?.orgnisation_name || 'NA', designation: "NGO", date: dayjs().format("YYYY-MM-DD") },
            { type: "Witness 1", name: "", designation: "" },
            { type: "Witness 2", name: "", designation: "" },
        ],
    };
    const handleSubmit = async (values: any) => {
        const payload = { ...values, date: dayjs(values.date).format("YYYY-MM-DD"), ngo_uuid: data?.uuid, year_of_bond: dayjs(values.year_of_bond).format("YYYY") };
        setIsSubmitting(true)
        const { code, message } = await StoreMOUpdfService(payload)
        if (code === 200) {
            dispatch(showSnackbar({ message: message, type: 'success' }))
            dispatch(closeDialog());
            dispatch(setModuleRefresh({ moduleName: 'mou', refresh: !refresh }))

        } else {
            dispatch(showSnackbar({ message: message, type: 'error' }))
        }
        setIsSubmitting(false)
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Formik initialValues={initialValues} validationSchema={ValidationSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange, setFieldValue }) => (
                    <Form>
                        <GlobalDialogContent
                            dialogBody={
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Title *"
                                            name={'title'}
                                            placeholder="Enter title"
                                            value={values.title}
                                            onChange={handleChange}
                                            error={Boolean(touched.title && errors.title)}
                                            helperText={touched.title && (errors.title as string)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <DatePicker
                                            label="Form Date"
                                            sx={{ '.MuiButtonBase-root': { marginRight: 0 } }}
                                            format="YYYY-MM-DD"
                                            value={values.date ? dayjs(values.date) : null}
                                            onChange={(newVal) =>
                                                setFieldValue("date", newVal ? newVal.format("YYYY-MM-DD") : "")
                                            }
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    error: Boolean(touched.date && errors.date),
                                                    helperText: touched.date && (errors.date as string),
                                                    fullWidth: true,
                                                    placeholder: "YYYY-MM-DD",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <DatePicker
                                            label="Year of Bond"
                                            views={["year"]}
                                            value={values.year_of_bond ? dayjs(values.year_of_bond, "YYYY") : null}
                                            onChange={(newVal) =>
                                                setFieldValue("year_of_bond", newVal ? newVal.format("YYYY") : "")
                                            }
                                            sx={{ '.MuiButtonBase-root': { marginRight: 0 } }}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    error: Boolean(touched.year_of_bond && errors.year_of_bond),
                                                    helperText: touched.year_of_bond && (errors.year_of_bond as string),
                                                    fullWidth: true,
                                                    placeholder: "2025",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="h6" fontWeight={600}>
                                                Signatures
                                            </Typography>
                                            <Button
                                                size="small"
                                                startIcon={<AddCircleOutlineIcon />}
                                                onClick={() =>
                                                    setFieldValue("signatures", [
                                                        ...values.signatures,
                                                        { type: "", name: "", designation: "", signature: "", date: "" },
                                                    ])
                                                }
                                            >
                                                Add Signature
                                            </Button>
                                        </Box>
                                        <FieldArray name="signatures">
                                            {({ remove, push }) => (
                                                <>
                                                    {values.signatures?.map((_: any, index: number) => {
                                                        const prefix = `signatures.${index}`;
                                                        const errFor = (field: string) => (errors as any)?.signatures?.[index]?.[field];
                                                        const touchedFor = (field: string) => (touched as any)?.signatures?.[index]?.[field];
                                                        return (
                                                            <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                                                                <Grid container spacing={2} alignItems="center">
                                                                    <Grid item xs={12} md={4}>
                                                                        <TextField
                                                                            fullWidth
                                                                            size="small"
                                                                            label="Type"
                                                                            disabled={index < 4}
                                                                            name={`${prefix}.type`}
                                                                            placeholder="e.g. For the Chief Minister's Relief Fund (CMRF)"
                                                                            value={values.signatures[index].type}
                                                                            onChange={handleChange}
                                                                            error={Boolean(touchedFor("type") && errFor("type"))}
                                                                            helperText={touchedFor("type") && errFor("type")}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} md={3}>
                                                                        <TextField
                                                                            fullWidth
                                                                            size="small"
                                                                            disabled={values.signatures[index].type === 'For'}
                                                                            label="Name"
                                                                            name={`${prefix}.name`}
                                                                            placeholder="Enter full name"
                                                                            value={values.signatures[index].name}
                                                                            onChange={handleChange}
                                                                            error={Boolean(touchedFor("name") && errFor("name"))}
                                                                            helperText={touchedFor("name") && errFor("name")}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} md={3}>
                                                                        <TextField
                                                                            fullWidth
                                                                            size="small"
                                                                            label="Designation"
                                                                            name={`${prefix}.designation`}
                                                                            placeholder="e.g. President / Joint Secretary"
                                                                            value={values.signatures[index].designation}
                                                                            onChange={handleChange}
                                                                            error={Boolean(touchedFor("designation") && errFor("designation"))}
                                                                            helperText={touchedFor("designation") && errFor("designation")}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} md={2}>
                                                                        <Button disabled={values.signatures.length <= 4} variant="outlined" size="small" startIcon={<RemoveCircleOutlineIcon />} color="error" onClick={() => remove(index)}>
                                                                            Remove
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Paper>
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </FieldArray>
                                    </Grid>

                                </Grid>

                            }
                            dialogFooter={
                                <Button variant="contained" disabled={isSubmitting} color="success" type="submit" >
                                    {isSubmitting ? 'Submitting... ' : 'Create MoU'}
                                </Button>
                            }
                        />
                    </Form>
                )}
            </Formik>
        </LocalizationProvider>
    );
}
