import React from "react";
import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import GlobalDialogContent from "../../dialog/GlobalDialogContent";

const ViewDocumentDescription = () => {
    const description = useSelector((state: any) => state.dialog.payload);
    return (
        <GlobalDialogContent
            dialogBody={
                <Box>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {description}
                    </Typography>
                </Box>
            }
            dialogFooter={false}
        />
    );
};

export default ViewDocumentDescription;
