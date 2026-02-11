import { Box, Typography } from '@mui/material';
import React from 'react';

type SectionCardProps = {
    icon?: React.ReactNode;
    title?: string;
    children: React.ReactNode;
};

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, children }) => {
    return (
        <Box sx={{ borderRadius: 1, boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px', p: 2, mb: 2, backgroundColor: 'background.paper' }} >
            {icon && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '15px', }} >
                {icon}
                <Typography variant="h5" fontWeight={600}>
                    {title}
                </Typography>
            </Box>}
            {children}
        </Box>
    );
};

export default SectionCard;
