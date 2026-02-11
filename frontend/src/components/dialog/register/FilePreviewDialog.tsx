import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import GlobalDialogContent from "../GlobalDialogContent";
import { BaseUrls } from "../../../utils/base-urls";

const getMimeTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase();
    switch (extension) {
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "pdf":
            return "application/pdf";
        case "mp4":
            return "video/mp4";
        case "webm":
            return "video/webm";
        default:
            return "unknown";
    }
};

const FilePreviewDialog: React.FC = () => {
    const fileUrl = useSelector((state: RootState) => state.dialog.payload);
    const S3_URL = BaseUrls.S3_BASE_URL.url;
    const mimeType = fileUrl ? getMimeTypeFromUrl(fileUrl) : "";
    const isImage = mimeType.startsWith("image/");
    const isPdf = mimeType === "application/pdf";
    const isVideo = mimeType.startsWith("video/");

    return (
        <GlobalDialogContent
            dialogBody={
                <Box p={2} display="flex" justifyContent="center" alignItems="center" height="60vh">
                    {isImage && (
                        <Box display="flex" justifyContent="center">
                            <img
                                src={S3_URL + fileUrl}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 4 }}
                            />
                        </Box>
                    )}

                    {isPdf && (
                        <Box display="flex" justifyContent="center" width="100%">
                            <iframe
                                src={S3_URL + fileUrl}
                                title="PDF Preview"
                                style={{ width: "100%", height: "85vh", border: "none" }}
                            />
                        </Box>
                    )}

                    {isVideo && (
                        <Box display="flex" justifyContent="center" width="100%">
                            <video
                                controls
                                style={{ width: "100%", maxHeight: "85vh", borderRadius: 4 }}
                            >
                                <source src={S3_URL + fileUrl} type={mimeType} />
                                <track kind="captions" srcLang="en" label="English captions" src="" default />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    )}

                    {!isImage && !isPdf && !isVideo && (
                        <Typography color="error" textAlign="center">Unsupported file type</Typography>
                    )}
                </Box>
            }
        />
    );
};

export default FilePreviewDialog;
