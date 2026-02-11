import React from 'react';
import { Tooltip, Typography, tooltipClasses, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
    title: string;
    color?: string
}

// Custom styled Tooltip
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow placement="top" classes={{ popper: className } as Partial<typeof tooltipClasses>} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.grey[900],
        color: '#fff',
        fontSize: 14,
        padding: theme.spacing(1, 2),
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[4],
        maxWidth: 300,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.grey[900],
    },
}));

const ResponsiveEllipsisTitle: React.FC<Props> = ({ title, color }) => {
    return (
        <CustomTooltip title={title} arrow placement="top">
            <Typography
                variant="h6"
                noWrap
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: color || 'primary.main',
                    whiteSpace: 'nowrap',
                    cursor: 'default',
                    display: 'block',
                    fontSize: {
                        xs: '0.75rem',
                        sm: '1rem',
                        md: '1.125rem',
                        lg: '1.25rem',
                    },
                    fontWeight: 'bold',
                    maxWidth: {
                        xs: '250px',
                        sm: '300px',
                        md: '500px',
                        lg: '700px',
                    },
                }}
            >
                {title}
            </Typography>
        </CustomTooltip>
    );
};

export default ResponsiveEllipsisTitle;
