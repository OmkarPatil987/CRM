import { Box } from '@mui/material';

interface NewBadgeProps {
    text?: string;
}

const NewBadge = ({ text = 'NEW' }: NewBadgeProps) => {
    return (
        <Box
            component="span"
            sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg,rgb(255, 0, 0) 0%,rgb(255, 34, 34) 100%)',
                color: '#fff',
                px: 1.8,
                py: 0.4,
                pr: 3,
                borderRadius: '12px',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                animation: 'fadeBlink 2s ease-in-out infinite',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease-in-out',

                '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: 5,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: '6px solid white',
                },

                '@keyframes fadeBlink': {
                    '0%, 100%': {
                        opacity: 1,
                        transform: 'scale(1)',
                    },
                    '50%': {
                        opacity: 0.6,
                        transform: 'scale(1.05)',
                    },
                },
            }}
        >
            {text}
        </Box>
    );
};

export default NewBadge;
