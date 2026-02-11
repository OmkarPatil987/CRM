import { Card, CardHeader, Grid, styled, Typography, useTheme } from "@mui/material";
import React from "react";

export const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
}));

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1.5, 2),
    "& .MuiCardHeader-title": {
        fontWeight: 500,
        fontSize: "1rem",
        color: theme.palette.text.primary,
    },
    "& .MuiCardHeader-avatar": {
        color: theme.palette.primary.main,
        fontSize: "1.5rem",
    },
}));

export const InfoItem = ({ label, value, md }: { label: React.ReactNode; value: string | number | null | React.ReactNode, md?: number }) => {
    const theme = useTheme();
    return (
        <Grid item xs={12} sm={6} md={md || 4}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500, textTransform: "uppercase", mb: 0.5 }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    color: value ? theme.palette.text.primary : theme.palette.text.disabled,
                }}
            >
                {value !== null && value !== "" ? value : "N/A"}
            </Typography>
        </Grid>
    );
};
