import { Typography } from "@mui/material";
import { TabPanelProps } from "../../../utils/dto/response/common_Type";

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography component={'div'}>{children}</Typography>
            )}
        </div>
    );
};

export default TabPanel;