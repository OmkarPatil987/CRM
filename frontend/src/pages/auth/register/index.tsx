import ValuntaryReg from './components/ValuntaryReg';
import { Box, Container, Grid, ImageList, ImageListItem, Typography } from '@mui/material';

const floodImages = [
    '/images/reg4.jpeg',
    '/images/RegisterPage.jpg',
    // '/images/reg2.jpg',
    '/images/reg3.jpg',
    '/images/reg1.jpg',

];

const VoluntaryRegistrationPage = () => {
    return (
        <Container
            component="main"
            maxWidth="xl"
            sx={{ background: `#f2f5f8`, my: 2, mt: 3, borderRadius: 2, p: 2 }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5} >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", justifyContent: "center", }} >
                        <Box
                            component="img"
                            src='/images/logo1.png'
                            alt="Dindi Cartoon"
                            sx={{
                                width: "100%",
                                maxWidth: 200,
                                mb:1,
                                // filter: "drop-shadow(0px 8px 15px rgba(255, 136, 0, 0.49))",
                                borderRadius: "16px",
                            }}
                        />
                        <Box
                            sx={{
                                width: 300,
                                height: "4px",
                                bgcolor: "#FF9933",
                                borderRadius: 5,
                                my: 1,
                            }}
                        />
                    </Box>
              
                    <Box sx={{ textAlign: 'center', py: 2, px: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 'medium',
                                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                color: '#333',
                            }}
                        >
                            • पूरग्रस्त समुदायांना मदत करण्यासाठी हात पुढे करा – आजच स्वयंसेवक म्हणून नोंदणी करा
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 'medium',
                                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                color: '#333',
                            }}
                        >
                            • बदल घडवा! पूर मदत कार्यासाठी स्वयंसेवक व्हा आणि फरक निर्माण करा
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 'medium',
                                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                color: '#333',
                            }}
                        >
                            • सेवा करा, मदत करा, जीव वाचवा – पूर मदत स्वयंसेवक म्हणून नोंदणी करा
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", overflowX: { xs: "scroll", sm: "hidden" }, }} >
                        <ImageList
                            sx={{
                                width: "100%",
                                maxWidth: 850,
                                flexWrap: { xs: "nowrap", sm: "wrap" },
                                transform: "translateZ(0)",
                            }}
                            gap={20}
                        >
                            {floodImages.map((img, idx) => (
                                <ImageListItem key={idx} sx={{ cursor: "pointer" }}>
                                    <Box
                                        component="img"
                                        src={img}
                                        alt={`Flood Image ${idx + 1}`}
                                        loading="lazy"
                                        sx={{
                                            width: "100%",
                                            borderRadius: 3,
                                            height: '100%',
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                        }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                  

                
                </Grid>
                <Grid item xs={12} sm={7}>
                    <ValuntaryReg />
                </Grid>
            </Grid>
        </Container>
    );
};

export default VoluntaryRegistrationPage;
