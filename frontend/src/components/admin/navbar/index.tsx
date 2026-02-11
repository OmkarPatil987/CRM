import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Theme, alpha, useTheme } from '@mui/material/styles'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Collapse,
  Typography,
} from '@mui/material'
import {
  Description,
  ExpandLess,
  Dashboard,
  ExpandMore,
  AccountTree,
  Ballot,
  WaterDamage,
  Assignment,
  PhotoLibrary,
  MonetizationOn,
  PersonAdd,
  VolunteerActivism,
  Category,
  ReceiptLong,
  Business,
  Inventory,
  QrCode,
  QrCodeScanner,
  RocketLaunch,
  Groups,
  ContactPage,
  BarChart,
  ViewKanban,
  Timeline,
} from '@mui/icons-material'

import { RootState } from '../../../redux/store'
import MiniDrawerStyled from './MiniDrawerStyled'
import { useSettings } from '../../../providers/SettingsProvider'
import { clearSorting } from '../../../redux/reducer/sortingSlice'
import { handleNav } from '../../../utils/permission'
const Icons = {
  Description,
  Dashboard,
  AccountTree,
  Ballot,
  WaterDamage,
  Assignment,
  PhotoLibrary,
  MonetizationOn,
  PersonAdd,
  VolunteerActivism,
  Category,
  ReceiptLong,
  Business,
  Inventory,
  QrCode,
  QrCodeScanner,
  Groups,
  ContactPage,
  BarChart,
  ViewKanban,
  Timeline,
}

interface MenuItem {
  id: number
  title: string
  icon: keyof typeof Icons
  url: string
  uuid: string
  subMenus: MenuItem[]
}

const handleIcons = (iconName: keyof typeof Icons, color: string) => {
  if (!iconName || !(iconName in Icons)) return null
  const IconComponent = Icons[iconName]
  return <IconComponent sx={{ fontSize: '22px', color }} />
}

const RenderNavs = ({ authUser }: { authUser: any }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  const [navigationTabs, setNavigationTabs] = useState<MenuItem[]>([])
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const underOfselectedSubMenus: any = useSelector(
    (state: RootState) => state.permission?.getFilterPermissionsObject?.parent_id ?? ''
  )

  const theme = useTheme()
  const primary = theme.palette.primary.main
  const text = theme.palette.text.primary
  const subtle = theme.palette.text.secondary

  useEffect(() => {
    !openDropdowns?.hasOwnProperty(underOfselectedSubMenus) &&
      underOfselectedSubMenus !== '' &&
      underOfselectedSubMenus !== '0' &&
      handleShowSubMenus(underOfselectedSubMenus ?? '')
  }, [underOfselectedSubMenus, openDropdowns])

  useEffect(() => {
    const navigation_Tabs: any = handleNav(dispatch)
    setNavigationTabs(navigation_Tabs ?? [])
  }, [openDropdowns, dispatch])

  const handleShowSubMenus = (menuSlug: string) => {
    setOpenDropdowns((prevState) => {
      return { ...prevState, [menuSlug]: !prevState[menuSlug] }
    })
  }

  const isMenuActive = (menu: MenuItem): boolean => {
    return location.pathname.startsWith(menu.url)
  }

  const isMasterActive = (menu: MenuItem): boolean => {
    return menu.subMenus?.some((subMenu: MenuItem) => isMenuActive(subMenu))
  }

  const handleSideNavClick = () => {
    dispatch(clearSorting())
  }

  const renderMenuItems = (menu: MenuItem, depth: number = 0.3) => {
    const hasSubMenus = menu?.subMenus && menu?.subMenus.length > 0
    const active = hasSubMenus ? isMasterActive(menu) : isMenuActive(menu)

    return (
      <React.Fragment key={menu.uuid}>
        <ListItem disablePadding sx={{ mb: 0.4 }} onClick={handleSideNavClick}>
          <NavLink
            to={!hasSubMenus ? menu.url || '' : ''}
            onClick={(e) => {
              if (hasSubMenus) {
                e.preventDefault()
                handleShowSubMenus(menu.uuid)
              }
            }}
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <ListItemButton
              sx={{
                borderRadius: '12px',
                px: 1.5,
                py: 1.2,
                pl: depth * 3.5,
                color: active ? primary : text,
                backgroundColor: active ? alpha(primary, 0.08) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(primary, 0.1),
                  color: primary,
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: '32px', color: active ? primary : subtle }}>
                {handleIcons(menu.icon as any, active ? primary : subtle)}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontWeight: active ? 700 : 600,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '-0.01em',
                }}
                primary={menu.title}
              />
              {hasSubMenus && (
                <ListItemIcon sx={{ minWidth: '30px', color: active ? primary : subtle }}>
                  {openDropdowns[menu.uuid] ? <ExpandLess sx={{ fontSize: 22 }} /> : <ExpandMore sx={{ fontSize: 22 }} />}
                </ListItemIcon>
              )}
            </ListItemButton>
          </NavLink>
        </ListItem>
        {hasSubMenus && (
          <Collapse in={openDropdowns[menu.uuid] ?? false} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menu?.subMenus?.map((subMenu) => renderMenuItems(subMenu, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  return (
    <Box sx={{ pt: 3, px: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1, pb: 2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 10,
            bgcolor: primary,
            display: 'grid',
            placeItems: 'center',
            boxShadow: theme.shadows[3],
          }}
        >
          <RocketLaunch sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
              color: text,
              lineHeight: 1,
              fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            SalesCRM
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: subtle,
              letterSpacing: 0.8,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            SMALL TEAM CRM
          </Typography>
        </Box>
      </Box>

      <List component="nav" sx={{ pt: 1, px: 0.5 }}>
        {navigationTabs.map((menu) => renderMenuItems(menu))}
      </List>
    </Box>
  )
}

const AdminNavBar = ({ window }: any) => {
  const authUser = useSelector((state: RootState) => state.authUser)
  const { isDashboardDrawerOpened, setIsDashboardDrawerOpened } = useSettings()
  const container = window !== undefined ? () => window().document.body : undefined
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 100, mt: '59px' }} aria-label="sidebar navigation">
      {!matchDownMD ? (
        <MiniDrawerStyled variant="permanent" open={isDashboardDrawerOpened}>
          <RenderNavs authUser={authUser} />
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={isDashboardDrawerOpened}
          onClose={setIsDashboardDrawerOpened}
          ModalProps={{ keepMounted: true }}
          sx={{
            zIndex: 100,
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 260,
              borderRight: '1px solid',
              borderRightColor: 'divider',
              backgroundColor: 'background.paper',
              boxShadow: 'inherit',
            },
          }}
        >
          <RenderNavs authUser={authUser} />
        </Drawer>
      )}
    </Box>
  )
}

export default AdminNavBar
