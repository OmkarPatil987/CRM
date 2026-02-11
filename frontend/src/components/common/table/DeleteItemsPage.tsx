import React from 'react';
import { Box, Typography } from '@mui/material';

interface ModuleDisplayProps {
    height?: number | string;
    itemName: string;
}

const DeleteItemsPage: React.FC<ModuleDisplayProps> = ({ height = '25vh', itemName }) => {
    return (
        <Box
            sx={{
                height,
                p: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2,
                textAlign: 'center',
            }}
        >
            <Box
                component="img"
                src="/images/3173472.jpg"
                alt="No Data"
                sx={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    mb: 1,
                }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', letterSpacing: 1 }}>
                Confirm Deletion
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
            </Typography>
        </Box>
    );
};

export default DeleteItemsPage;
