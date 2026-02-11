import React from "react";
import { Stack, Stepper, Step, StepLabel, Typography, useMediaQuery, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import { StepIconProps } from "@mui/material/StepIcon";

interface CustomStepperProps {
    steps: string[];
    activeStep: number;
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: "#013E5E",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor:"#013E5E",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: "#eaeaf0",
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
    background: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
    zIndex: 1,
    color: "#fff",
    width: 45,
    height: 45,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    ...(ownerState.active && {
        background: "linear-gradient(135deg,rgb(238, 255, 0) 0%,rgb(255, 196, 0) 50%,rgb(241, 183, 97) 100%)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)",
    }),
    ...(ownerState.completed && {
        background: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)",
    }),
}));

const ColorlibStepIcon: React.FC<StepIconProps> = (props) => {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <BuildIcon fontSize="medium" />,
        2: <PeopleIcon fontSize="medium" />,
        3: <PeopleIcon fontSize="medium" />,
        4: <StarIcon fontSize="medium" />, 
        5: <PlayCircleFilledIcon fontSize="medium" />,
        6: <PlayCircleFilledIcon fontSize="medium" />,
        7: <CheckCircleIcon fontSize="medium" />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
};
const CustomStepper: React.FC<CustomStepperProps> = ({ steps, activeStep }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTab = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Stack sx={{ width: "100%", alignItems: "center", maxHeight:'20vh', overflowY:"auto" }} spacing={2} mb={2}>
            <Stepper
                alternativeLabel={!isMobile}
                activeStep={activeStep}
                connector={isMobile  ? <></> :<ColorlibConnector />}
                orientation={isMobile ? "vertical" : "horizontal"}
            >
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>
                            <Typography
                                variant={isMobile ? "caption" : isTab ? "body2" : "body1"}
                                sx={{
                                    width: isMobile ? "auto" : isTab ? "120px" : "170px",
                                    textAlign: "center",
                                    wordBreak: "break-word",
                                    fontWeight: 600,
                                }}
                            >
                                {label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Stack>
    );
};

export default CustomStepper;