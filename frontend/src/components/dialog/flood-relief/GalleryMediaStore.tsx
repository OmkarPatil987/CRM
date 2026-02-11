import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { CheckOutlined, DeleteOutline, UploadFileOutlined } from "@mui/icons-material";
import GlobalDialogContent from "../GlobalDialogContent";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { closeDialog } from "../../../redux/reducer/dialogSlice";
import { UploadGalleryReportFileService } from "../../../utils/services/flood.relied.service";
import { RootState } from "../../../redux/store";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const validationSchema = Yup.object({
  file_type: Yup.string()
    .required("File type is required / फाइल प्रकार आवश्यक आहे.")
    .oneOf(
      ["image", "video"],
      "Only image or video files are allowed / फक्त प्रतिमा किंवा व्हिडिओ फायली परवानगी आहेत."
    ),
  files: Yup.array()
    .of(
      Yup.mixed<File>()
        .required(
          "Please upload at least one file before submitting the form / कृपया फॉर्म सबमिट करण्यापूर्वी किमान एक फाइल अपलोड करा."
        )
        .test(
          "fileSize",
          "File is too large. Maximum size allowed is 5MB / फाइल खूप मोठी आहे. कमाल आकार 5MB आहे.",
          (value: File | null) => !value || (value && value.size <= MAX_FILE_SIZE)
        )
        .test(
          "fileType",
          "Unsupported file type. Only images (JPEG, PNG, JPG) and videos (MP4, MOV, AVI, MKV) are allowed / असमर्थित फाइल प्रकार. फक्त प्रतिमा (JPEG, PNG, JPG) आणि व्हिडिओ (MP4, MOV, AVI, MKV) परवानगी आहेत.",
          (value: File | null) =>
            !value ||
            (value &&
              [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "video/mp4",
                "video/quicktime",
                "video/x-msvideo",
                "video/x-matroska",
              ].includes(value.type))
        )
    )
    .min(1, "Please upload at least one file / कृपया किमान एक फाइल अपलोड करा.")
    .required("Files are required / फायली आवश्यक आहेत."),
});

const AddFloodGalleryMedia: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uuid = useSelector((state: RootState) => state.dialog.payload);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      file_type: "",
      files: [] as File[],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("flood_uuid", uuid);
      formData.append("file_type", values.file_type);
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });
      const { code, message } = await UploadGalleryReportFileService(formData);
      if (code === 200) {
        dispatch(setModuleRefresh({ moduleName: "media", refresh: true }));
        dispatch(
          showSnackbar({
            type: "success",
            message: "Gallery media added successfully / गॅलरी मीडिया यशस्वीरित्या जोडले गेले.",
          })
        );
        formik.resetForm();
        dispatch(closeDialog());
        setSelectedFiles([]);
      } else {
        dispatch(
          showSnackbar({
            type: "error",
            message:
              message ||
              "Failed to upload gallery media / गॅलरी मीडिया अपलोड करण्यात अयशस्वी.",
          })
        );
      }
      setLoading(false);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files (e.g., due to size or type)
      rejectedFiles.forEach((rejected) => {
        rejected.errors.forEach((error) => {
          if (error.code === "file-too-large") {
            dispatch(
              showSnackbar({
                type: "error",
                message: `File "${rejected.file.name}" is too large. Maximum size allowed is 5MB / फाइल "${rejected.file.name}" खूप मोठी आहे. कमाल आकार 5MB आहे.`,
              })
            );
          } else if (error.code === "file-invalid-type") {
            dispatch(
              showSnackbar({
                type: "error",
                message: `File "${rejected.file.name}" has an unsupported type. Only images (JPEG, PNG, JPG) and videos (MP4, MOV, AVI, MKV) are allowed / फाइल "${rejected.file.name}" चा प्रकार समर्थित नाही. फक्त प्रतिमा (JPEG, PNG, JPG) आणि व्हिडिओ (MP4, MOV, AVI, MKV) परवानगी आहेत.`,
              })
            );
          }
        });
      });

      // Handle accepted files
      const validFiles = acceptedFiles.filter(
        (file) =>
          file.size <= MAX_FILE_SIZE &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "video/mp4",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska",
          ].includes(file.type)
      );
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        formik.setFieldValue("files", [...selectedFiles, ...validFiles]);
        const fileType = validFiles[0].type.startsWith("image/") ? "image" : "video";
        formik.setFieldValue("file_type", fileType);
      }
    },
    [formik, selectedFiles, dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/x-msvideo": [".avi"],
      "video/x-matroska": [".mkv"],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    formik.setFieldValue("files", updatedFiles);
    if (updatedFiles.length === 0) {
      formik.setFieldValue("file_type", "");
    } else {
      const fileType = updatedFiles[0].type.startsWith("image/") ? "image" : "video";
      formik.setFieldValue("file_type", fileType);
    }
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
                    ? "Drop the files here / फाइल्स येथे ड्रॉप करा..."
                    : "Drag & drop files here, or click to select / फाइल्स येथे ड्रॅग आणि ड्रॉप करा किंवा निवडण्यासाठी क्लिक करा"}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  (Only images and videos up to 5MB each are allowed / फक्त प्रतिमा आणि व्हिडिओ प्रत्येकी 5MB पर्यंत परवानगी आहेत)
                </Typography>
              </Box>

              {selectedFiles.length > 0 && (
                <Box sx={{ width: "100%", mt: 1 }}>
                  {selectedFiles.map((file, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        width: "100%",
                        justifyContent: "space-between",
                        border: "1px solid #ccc",
                        p: 1,
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2">
                          <strong>File / फाइल:</strong> {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Size / आकार: {(file.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveFile(index)}
                        size="small"
                        color="error"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Stack>
                  ))}
                </Box>
              )}

              {formik.touched.files && formik.errors.files && (
                <FormHelperText error>{String(formik.errors.files)}</FormHelperText>
              )}
              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
            disabled={selectedFiles.length === 0 || loading}
          >
            Submit / सबमिट
          </Button>
        }
      />
    </Box>
  );
};

export default AddFloodGalleryMedia;
