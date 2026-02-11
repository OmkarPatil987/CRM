import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ResponsiveEllipsisTitle from '../ResponsiveEllipsisTitle';

interface PageHeadProps {
    primary: React.ReactNode | string;
    secondary?: React.ReactNode | string | null;
    back?: React.ReactNode | string;
    search?: React.ReactNode;
}

const PageHead: React.FC<PageHeadProps> = ({ primary, secondary, back, search }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 2,
                p: 1,
                flexWrap: 'wrap',
            }}
        >
            {/* Left Section: Back + Title */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'space-between' : '',
                    gap: 1,
                    flexWrap: 'wrap',
                    width: isMobile ? '100%' : 'auto',
                }}
            >
                <Box display={'flex'} alignItems={'center'}>
                    {back && <Box sx={{ display: 'flex', alignItems: 'center', mr:1 }}>{back}</Box>}
                    {typeof primary === 'string' ? (
                        <ResponsiveEllipsisTitle title={primary} />
                    ) : (
                        primary
                    )}
                </Box>
                {isMobile && secondary && (typeof secondary === 'string' ? (
                    <Typography variant="h6">{secondary}</Typography>
                ) : (
                    secondary
                ))}

            </Box>
            {search && (
                <Box sx={{ mt: isMobile ? 1 : 0, width: isMobile ? '100%' : 'auto' }}>
                    {search}
                </Box>
            )}
            {/* Right Section: Secondary Text & Search */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'flex-end',
                    gap: 1,
                    width: isMobile ? '100%' : 'auto',
                }}
            >
                {!isMobile && secondary && (typeof secondary === 'string' ? (
                    <Typography variant="h6">{secondary}</Typography>
                ) : (
                    secondary
                ))}

               
            </Box>
        </Box>
    );
};

export default PageHead;
