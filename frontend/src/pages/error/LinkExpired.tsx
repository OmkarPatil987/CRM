import { Box, Typography } from '@mui/material';

const LinkExpired = () => {
    return (
        <Box
            sx={{
                minHeight: '60vh',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 12s ease-in-out infinite',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 2, sm: 4 },
            }}
        >
            <Box
                sx={{
                    borderRadius: '24px',
                    p: { xs: 3, sm: 5 },
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    animation: 'fadeIn 0.8s ease-out',
                }}
            >
                <img src="/images/link-expired.png" alt="Link Expired" height={200} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: 'red',
                        my: 1,
                        fontSize: { xs: '1rem', sm: '2rem' },
                        animation: 'fadeIn 1s ease-out',
                    }}
                >
                    Link Expired!
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mt: 1,
                        color: 'text.secondary',
                        animation: 'fadeIn 1.5s ease-out',
                    }}
                >
                    Please contact your administrator for assistance.
                </Typography>
            </Box>
        </Box>
    );
};

export default LinkExpired;
