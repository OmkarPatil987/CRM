import React, { useEffect, useState } from 'react'
import { Box, Divider, Fab, Stack, Typography, useTheme } from '@mui/material'
import { Add, AssignmentTurnedIn, MonetizationOn, Today, ErrorOutline, Campaign, People, Contacts, LocalActivity } from '@mui/icons-material'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import StatusChip from '../../../components/admin/ui/StatusChip'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import { DashboardStatsResponse } from '../../../utils/dto/dashboard'
import { FetchDashboardStatsService } from '../../../utils/services/dashboard.service'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns'

const DashboardPage = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const { code, data, message } = await FetchDashboardStatsService()
                if (code === 200 && data) {
                    setStats(data)
                } else {
                    dispatch(showSnackbar({ type: 'error', message: message || 'Failed to load dashboard stats' }))
                }
            } catch (error: any) {
                dispatch(showSnackbar({ type: 'error', message: error.message || 'Error loading dashboard' }))
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [dispatch])

    if (loading && !stats) {
        return <PageContainer><PageHeader title="Dashboard" subtitle="Loading..." /></PageContainer>
    }

    return (
        <PageContainer>
            <PageHeader title="CRM Dashboard" subtitle="Overview of your current performance." />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                {[
                    { label: 'Total Leads', value: stats?.total_leads || 0, icon: <Campaign />, color: 'primary.main' },
                    { label: 'Total Deals', value: stats?.total_deals || 0, icon: <MonetizationOn />, color: 'success.main' },
                    { label: 'Total Contacts', value: stats?.total_contacts || 0, icon: <Contacts />, color: 'info.main' },
                    { label: 'Total Activities', value: stats?.total_activities || 0, icon: <LocalActivity />, color: 'warning.main' },
                ].map((item) => (
                    <SurfaceCard key={item.label}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    sx={{
                                        width: theme.spacing(5),
                                        height: theme.spacing(5),
                                        borderRadius: theme.shape.borderRadius,
                                        bgcolor: `${item.color.split('.')[0]}.light`, // Simple opacity fallback
                                        color: item.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.8
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {item.label}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Box mt={2}>
                            <Typography variant="h4" fontWeight="bold">{item.value}</Typography>
                        </Box>
                    </SurfaceCard>
                ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>

                {/* Recent Activities */}
                <SurfaceCard>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">Recent Activities</Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={2}>
                        {stats?.recent_activities?.length === 0 && <Typography color="text.secondary">No recent activities found.</Typography>}
                        {stats?.recent_activities?.map((activity) => (
                            <Stack key={activity.id} spacing={0.5} sx={{ p: 1, '&:hover': { bgcolor: 'action.hover', borderRadius: 1 } }}>
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                        <Typography variant="body2" fontWeight="medium">{activity.title}</Typography>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        {format(new Date(activity.scheduled_at), 'MMM dd, h:mm a')}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                                    {activity.type} - {activity.status}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </SurfaceCard>

                {/* Placeholder for future charts or lists */}
                <SurfaceCard>
                    <Typography variant="h6" fontWeight="bold">Quick Actions</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Manage your CRM directly from here.
                        </Typography>
                        {/* We can add quick action buttons here later */}
                    </Stack>
                </SurfaceCard>
            </Box>
        </PageContainer>
    )
}

export default DashboardPage
