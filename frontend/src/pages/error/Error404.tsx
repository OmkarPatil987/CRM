import { Box } from '@mui/material';

const Error404 = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 59px - 32px - 32px)', textAlign: 'center' }} >
            <img src="/images/404_logo.png" alt='Error 404' />
        </Box>
    );
}

export default Error404;
