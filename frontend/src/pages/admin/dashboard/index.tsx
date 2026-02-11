import React from 'react'
import { Box, Divider, Fab, Stack, Typography, useTheme } from '@mui/material'
import { Add, AssignmentTurnedIn, MonetizationOn, Today, ErrorOutline } from '@mui/icons-material'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import StatusChip from '../../../components/admin/ui/StatusChip'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'

const DashboardPage = () => {
  const theme = useTheme()

  return (
    <PageContainer>
      <PageHeader title="Sales Dashboard" subtitle="Overview of current performance." />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {[
          { label: 'My Open Deals', value: '24', chip: { label: '+12%', color: 'success' as const }, icon: <AssignmentTurnedIn /> },
          { label: 'Deal Value', value: '$142,500', chip: { label: '+8%', color: 'success' as const }, icon: <MonetizationOn /> },
          { label: 'Tasks Due Today', value: '8', chip: { label: 'Today', color: 'info' as const }, icon: <Today /> },
          { label: 'Overdue Items', value: '3', chip: { label: 'High Priority', color: 'error' as const }, icon: <ErrorOutline /> },
        ].map((item) => (
          <SurfaceCard key={item.label}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: theme.spacing(4),
                    height: theme.spacing(4),
                    borderRadius: theme.shape.borderRadius,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.label.toUpperCase()}
                </Typography>
              </Stack>
              <StatusChip label={item.chip.label} color={item.chip.color} />
            </Stack>
            <Typography variant="subtitle1">{item.value}</Typography>
          </SurfaceCard>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>
        <SurfaceCard>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="subtitle1">Pipeline by Stage</Typography>
              <Typography variant="caption" color="text.secondary">
                Distribution of deals across your sales funnel
              </Typography>
            </Box>
            <StatusChip label="Current Quarter" color="info" />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'center' }}>
            <Box sx={{ position: 'relative', width: 160, height: 160, mx: 'auto' }}>
              <Box
                component="svg"
                viewBox="0 0 100 100"
                sx={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
              >
                <circle cx="50" cy="50" r="40" stroke={theme.palette.grey[200]} strokeWidth="12" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke={theme.palette.primary.main} strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="62.8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke={theme.palette.secondary.main} strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="150" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke={theme.palette.warning.main} strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="210" fill="transparent" />
              </Box>
              <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1">$450k</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Stack spacing={2}>
              {[
                { label: 'Lead Stage', value: '$180,000', color: theme.palette.primary.main },
                { label: 'Qualification', value: '$125,000', color: theme.palette.secondary.main },
                { label: 'Proposal Sent', value: '$95,000', color: theme.palette.warning.main },
                { label: 'Other', value: '$50,000', color: theme.palette.grey[400] },
              ].map((row) => (
                <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: row.color }} />
                    <Typography variant="body2">{row.label}</Typography>
                  </Stack>
                  <Typography variant="body2">{row.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </SurfaceCard>

        <SurfaceCard>
          <Typography variant="subtitle1">Recent Activity</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {[
              { title: 'Deal Closed: Acme Corp Hardware', meta: 'Closed by Alex Rivera for $12,400', time: '2 hours ago', color: 'success.main' },
              { title: 'New Lead Added: Sarah Jenkins', meta: 'Inbound form via marketing site', time: '5 hours ago', color: 'info.main' },
              { title: 'Email Sent: Proposal Follow-up', meta: 'Sent to Global Industries', time: 'Yesterday', color: 'warning.main' },
              { title: 'Deal Updated: Project Solar', meta: "Moved from 'Lead' to 'Qualification'", time: 'Yesterday', color: 'text.secondary' },
            ].map((item) => (
              <Stack key={item.title} spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                  <Typography variant="caption" color="text.secondary">
                    {item.time}
                  </Typography>
                </Stack>
                <Typography variant="body2">{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.meta}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" justifyContent="center" mt={2}>
            <StatusChip label="View All Activity" color="info" />
          </Stack>
        </SurfaceCard>
      </Box>

      <Fab color="primary" sx={{ position: 'fixed', bottom: theme.spacing(4), right: theme.spacing(4) }}>
        <Add />
      </Fab>
    </PageContainer>
  )
}

export default DashboardPage
