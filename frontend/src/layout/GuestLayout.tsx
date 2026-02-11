import React from 'react'
import { Box } from '@mui/material';
import RegisterTopbar from '../components/admin/topbar/RegisterTopbar';
const GuestLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', height: 'auto', position: 'relative', minWidth: '290px', overflow: 'hidden' }}>
           {/* <RegisterTopbar /> */}
            <Box sx={{ width: '100%', height: '100%', flex: '1 1', backgroundColor: 'white' }}>
                <Box sx={{ flexGrow: 1, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'grey.400' }}>
                    <Box sx={{ position: 'relative', minHeight: '100%' }}>
                        {children}
                    </Box>
                </Box>
            </Box>
            
        </Box>
    )
}

export default GuestLayout;