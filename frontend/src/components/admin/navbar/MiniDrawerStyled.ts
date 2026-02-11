import { styled, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { grey } from '@mui/material/colors';

const openedMixin = (theme: Theme) => ({
    width: 240,
    borderRight: '1px solid',
    borderRightColor: theme.palette.divider,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: 'hidden',
    boxShadow: 'none'
});

const closedMixin = (theme: Theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: 0,
    borderRight: 'none',
    boxShadow: theme.shadows[1]
});

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }: any) => ({
        width: 240,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                backgroundColor: theme.palette.background.paper,
                width: 240,
                borderRight: '1px solid',
                borderRightColor: theme.palette.divider,
            }
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme)
        })
    })
);

export default MiniDrawerStyled;
