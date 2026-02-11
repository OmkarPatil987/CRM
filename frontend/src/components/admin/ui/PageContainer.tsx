import React from 'react';
import { Box } from '@mui/material';

const PageContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                minHeight: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                // Matching your Tailwind bg-gradient-to-br
                background: 'linear-gradient(to bottom right, #f8fafc, #ffffff, #f1f5f9)',
                // Standardized padding that matches the AdminLayout
                p: { xs: 2, sm: 3, md: 4 },
            }}
        >
            {/* Indigo Blur Circle */}
            <Box sx={{
                pointerEvents: 'none',
                position: 'absolute',
                top: -80,
                right: 0,
                height: 288,
                width: 288,
                borderRadius: '50%',
                bgcolor: 'rgba(199, 210, 254, 0.4)',
                filter: 'blur(64px)',
                zIndex: 0
            }} />

            {/* Sky Blur Circle */}
            <Box sx={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 96,
                left: -96,
                height: 256,
                width: 256,
                borderRadius: '50%',
                bgcolor: 'rgba(186, 230, 253, 0.3)',
                filter: 'blur(64px)',
                zIndex: 0
            }} />

            {/* Content Wrapper */}
            <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '1600px', mx: 'auto' }}>
                {children}
            </Box>
        </Box>
    );
};

export default PageContainer;