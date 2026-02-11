import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                py: 1.5,
                zIndex: 3,
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Container maxWidth="xl">
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: {
                            xs: '0.75rem',  
                            sm: '0.875rem', 
                        },
                        px: 2,
                        lineHeight: 1.4,
                    }}
                >
                    © {currentYear} Chief Minister's Relief Fund and Charitable Hospital Help Desk / मुख्यमंत्री सहाय्यता निधी व धर्मादाय रुग्णालय मदत कक्ष, Maharashtra


                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
