import React from 'react';
import { Box, Typography } from '@mui/material';

interface ModuleDisplayProps {
    height: number | string;
    moduleName: string;
}

const NoDataFound: React.FC<ModuleDisplayProps> = ({ height, moduleName }) => {
    return (
        <Box
            sx={{
                height,
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                backgroundColor: 'background.paper',
                textAlign: 'center',
            }}
        >
            <Box>
                <Box
                    component="img"
                    src="/images/no-data.gif"
                    alt="No Data"
                    sx={{
                        width: 180,
                        height: 180,
                        mb: 2,
                        borderRadius: '40%',
                        objectFit: 'cover',
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 1,
                        letterSpacing: 0.5,
                    }}
                >
                    No {moduleName} Found
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        maxWidth: 600,
                        mx: 'auto',
                    }}
                >
                    We couldn’t find any data related to <strong>{moduleName}</strong> at the moment.
                    Please make sure the information is available or try again later.
                </Typography>
            </Box>
        </Box>
    );
};

export default NoDataFound;
