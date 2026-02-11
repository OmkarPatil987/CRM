import { Box } from "@mui/material";
import useResponsive from "../../../hooks/useResponsive";

const PageContent = ({ children }: { children: React.ReactNode }) => {
    const { isMobile } = useResponsive()
    return (
        <Box sx={{ height: isMobile ? 'calc(100vh - 59px)' : 'calc(100vh - 59px - 32px)', overflowY: isMobile ? 'auto' : 'none' }} >
            {children}
        </Box>
    );
}

export default PageContent;
