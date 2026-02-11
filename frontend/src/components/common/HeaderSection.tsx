import { Box, Grid, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { NAVIGATE_ADMIN, NAVIGATE_GUEST } from '../../constant';

interface HeaderSectionProps {
    title: string;
    subtitle: string;
}

const HeaderSection = ({ title, subtitle }: HeaderSectionProps) => {
    const navigate = useNavigate();

    return (
        <Box
            component="header"
            sx={{
                mb: 6,
                py: 4,
                px: 2,
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    mx: 'auto',
                }}
            >
                <Grid container alignItems="center" spacing={3} sx={{ width: 'auto' }}>
                    {/* Back button */}
                    <Grid item>
                        <IconButton onClick={() => navigate(NAVIGATE_GUEST.HOME)} color="primary">
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>

                    {/* Logo */}
                    {/* <Grid item>
                        <Box
                            component="img"
                            src="/images/emb.png"
                            alt="Government of Maharashtra Logo"
                            sx={{
                                height: 80,
                                width: 'auto',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                            }}
                        />
                    </Grid> */}

                    {/* Title and Subtitle */}
                    <Grid item>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    fontSize: { xs: '1.75rem', sm: '2rem' },
                                    lineHeight: 1.2,
                                    mb: 1,
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 400,
                                    fontSize: { xs: '1rem', sm: '1rem' },
                                    lineHeight: 1.4,
                                }}
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HeaderSection;
