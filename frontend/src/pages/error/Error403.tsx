import React from "react";

import { Box, Typography, Button } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import PageContent from "../../components/common/page/PageContent";
import { useNavigate } from "react-router-dom";
import { NAVIGATE_ADMIN } from "../../constant";

const NoPermissionMessage: React.FC = () => {
    const navigae = useNavigate();
    return (
        <PageContent>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" textAlign="center" sx={{ borderRadius: 2, p: 4, maxWidth: 450, margin: "0 auto" }} >
                <Box sx={{ width: "100%", maxWidth: 150, height: 170, mb: 2, display: "flex", justifyContent: "center", }} >
                    <img
                        src="/images/accesD.png"
                        alt="No Permission"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Box>
                <Typography variant="h4" color="#0288d1" fontWeight={600} gutterBottom>
                    Access Restricted
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={400} mb={2} sx={{ whiteSpace: "nowrap" }}>
                    You do not have the necessary permissions to access this page.
                </Typography>
                <Typography variant="body2" color="error" fontWeight={400} mb={3}>
                    If you believe this is an error, please contact your administrator.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigae(NAVIGATE_ADMIN.DASHBOARD_PAGE )} sx={{ mt: 2, px: 4 }} endIcon={<HomeOutlinedIcon />} >
                    Go to Home
                </Button>
            </Box>
        </PageContent>
    );
};

export default NoPermissionMessage;
