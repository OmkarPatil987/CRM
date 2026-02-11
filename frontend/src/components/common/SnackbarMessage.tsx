import { Alert, Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideSnackbar } from '../../redux/reducer/snackbarSlice';
import { RootState } from '../../redux/store';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ severity }) => ({
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontWeight: '500',
    fontSize: '14px',
    minWidth: '300px',
    color: 'white',

    ...(severity === 'error' && {
        background: '#f44336',
    }),

    ...(severity === 'warning' && {
        background: '#ff9800',
    }),

    ...(severity === 'success' && {
        background: '#4caf50',
    }),

    ...(severity === 'info' && {
        background: '#2196f3',
    }),

    '& .MuiAlert-icon': {
        color: 'white',
        fontSize: '20px',
    },

    '& .MuiAlert-message': {
        padding: '2px 0',
        display: 'flex', // Makes icon and text inline
        alignItems: 'center',
        gap: '8px',      // Spacing between icon and text
    },


    '& .MuiAlert-action': {
        paddingLeft: '12px',
        '& .MuiIconButton-root': {
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
        },
    },
}));

const SnackbarMessage = () => {
    const dispatch = useDispatch();
    const snackbars = useSelector((state: RootState) => state.snackbar.messages);

    const handleClose = (id: number) => {
        dispatch(hideSnackbar(id));
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '8px',
            maxWidth: '400px',
        }}>
            {snackbars.map((snackbar, index) => (
                <Snackbar
                    key={snackbar.id}
                    open={true}
                    autoHideDuration={4000}
                    onClose={() => handleClose(snackbar.id)}
                    style={{
                        position: 'static',
                    }}
                >
                    <StyledAlert
                        onClose={() => handleClose(snackbar.id)}
                        severity={snackbar.type}
                        variant="filled"
                    >
                        {snackbar.message}
                    </StyledAlert>
                </Snackbar>
            ))}
        </div>
    );
};

export default SnackbarMessage; 