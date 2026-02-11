import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Box, TextField, Button, Typography, IconButton, Stack, CircularProgress, FormHelperText, } from "@mui/material";
import { CheckOutlined, DeleteOutline, UploadFileOutlined } from "@mui/icons-material";

import GlobalDialogContent from "../GlobalDialogContent";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { closeDialog } from "../../../redux/reducer/dialogSlice";
import { StoreNgoActivityDocumentSerivce } from "../../../utils/services/ngo.registration.service";
import { RootState } from "../../../redux/store";

const validationSchema = Yup.object({
    document_title: Yup.string()
        .required("Please enter a document title. It cannot be left blank."),
    description: Yup.string()
        .required("A short description is required to proceed."),
    file_type: Yup.string().optional(),
    files: Yup.mixed<File>()
        .required("Please upload a file before submitting the form.")
        .test(
            "fileSize",
            "File is too large. Maximum size allowed is 5MB.",
            (value: File | null) => !value || (value && value.size <= 5 * 1024 * 1024)
        )
        .test(
            "fileType",
            "Unsupported file type. Only PDF, images, and video files are allowed.",
            (value: File | null) =>
                !value ||
                (value &&
                    [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "video/mp4",
                        "video/quicktime", 
                        "video/x-msvideo",
                        "video/x-matroska"
                    ].includes(value.type)
                )
        )

});

const AddGlobalMediaStore = () => {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const uuid = useSelector((state: RootState) => state.dialog.payload);
    const refresh = useSelector((state: RootState) => state.refresh.media);

    const [loading, setLoading] = useState<boolean>(false);
    const formik = useFormik({
        initialValues: {
            document_title: "",
            description: "",
            file_type: "",
            files: null as File | null,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const formData = new FormData();
            formData.append("document_title", values.document_title);
            formData.append("description", values.description);
            formData.append("file_type", values.file_type);
            formData.append("document_type", 'Ngo Activity')
            formData.append("ngo_activity_uuid", uuid);
            if (selectedFile) {
                formData.append("files", selectedFile);
            }
            const { code, message } = await StoreNgoActivityDocumentSerivce(formData);
            if (code === 200) {
                dispatch(setModuleRefresh({ moduleName: "media", refresh: !refresh }));
                dispatch(showSnackbar({ type: "success", message: "Activity document added successfully" }));
                formik.resetForm();
                dispatch(closeDialog());
                setSelectedFile(null);
            } else {
                dispatch(showSnackbar({ type: "error", message: message || "Failed to fetch store Activity media document" }));
            }
            setLoading(false);
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file) {
                setSelectedFile(file);
                formik.setFieldValue("files", file);
                formik.setFieldValue("file_type", file.type);
            }
        }
    }, [formik]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            "application/pdf": [],
            "image/*": [],
            "video/*": []
        }
    });

    const handleRemoveFile = () => {
        setSelectedFile(null);
        formik.setFieldValue("file_type", "");
    };

    return (
        <Box>
            <GlobalDialogContent
                dialogBody={
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                justifyContent: "center",
                                alignItems: "center",
                                p: 1,
                            }}
                        >
                            <TextField
                                fullWidth
                                name="document_title"
                                size="small"
                                placeholder="Enter document title"
                                label="Document Title *"
                                value={formik.values.document_title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.touched.document_title && formik.errors.document_title)}
                                helperText={formik.touched.document_title && formik.errors.document_title}
                            />

                            <TextField
                                fullWidth
                                name="description"
                                label="Description *"
                                multiline
                                minRows={3}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.touched.description && formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />


                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: "2px dashed #aaa",
                                    borderRadius: 2,
                                    padding: 2,
                                    width: "100%",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                    },
                                }}
                            >
                                <input {...getInputProps()} />
                                <UploadFileOutlined sx={{ mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {isDragActive
                                        ? "Drop the file here..."
                                        : "Drag & drop a file here, or click to select"}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    (Only PDF, image, and video files are allowed)
                                </Typography>
                            </Box>

                            {selectedFile && (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{
                                        mt: 1,
                                        width: "100%",
                                        justifyContent: "space-between",
                                        border: "1px solid #ccc",
                                        p: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2">
                                            <strong>File:</strong> {selectedFile.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Size: {(selectedFile.size / 1024).toFixed(2)} KB
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={handleRemoveFile}
                                        size="small"
                                        color="error"
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </Stack>
                            )}

                            {formik.touched.files && formik.errors.files && (
                                <FormHelperText error>
                                    {formik.errors.files}
                                </FormHelperText>
                            )}
                            {(loading) && (
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </form>
                }
                dialogFooter={
                    <Button
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                        variant="contained"
                        color="success"
                        startIcon={<CheckOutlined />}
                        disabled={!selectedFile || loading}
                    >
                        Submit
                    </Button>
                }
            />
        </Box>
    );
};

export default AddGlobalMediaStore;
