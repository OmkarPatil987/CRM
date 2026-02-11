import React from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import StatusChip from '../../../components/admin/ui/StatusChip'
import ActionButton from '../../../components/admin/ui/ActionButton'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'

const ReportsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Sales Analytics Reports"
        subtitle="Real-time performance metrics and pipeline health for your team."
        actions={
          <Stack direction="row" spacing={2}>
            <ActionButton label="Last 30 Days" variant="outlined" />
            <ActionButton label="Export" variant="contained" />
          </Stack>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {[
          { label: 'Total Pipeline', value: '$420,000', chip: { label: '+12%', color: 'success' as const } },
          { label: 'Avg. Deal Size', value: '$12,500', chip: { label: '-2%', color: 'error' as const } },
          { label: 'Win Rate', value: '34%', chip: { label: '+5%', color: 'success' as const } },
          { label: 'Active Activities', value: '158', chip: { label: '+8%', color: 'success' as const } },
        ].map((item) => (
          <SurfaceCard key={item.label}>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
              <Typography variant="subtitle1">{item.value}</Typography>
              <StatusChip label={item.chip.label} color={item.chip.color} />
            </Stack>
          </SurfaceCard>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>
        <SurfaceCard>
          <Typography variant="subtitle1">Pipeline by Stage</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {[
              { label: 'Discovery', value: '$145,000 (12 deals)' },
              { label: 'Proposal Sent', value: '$112,000 (8 deals)' },
              { label: 'Negotiation', value: '$98,000 (5 deals)' },
              { label: 'Closing', value: '$65,000 (3 deals)' },
            ].map((row) => (
              <Stack key={row.label} direction="row" justifyContent="space-between">
                <Typography variant="body2">{row.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </SurfaceCard>
        <SurfaceCard>
          <Typography variant="subtitle1">Pipeline Health</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5">75%</Typography>
          <Typography variant="caption" color="text.secondary">
            Healthy
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">At Risk Deals</Typography>
              <Typography variant="body2" color="error">
                4
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Stagnant Deals</Typography>
              <Typography variant="body2" color="warning">
                7
              </Typography>
            </Stack>
          </Stack>
          <ActionButton label="View All Risks" variant="outlined" size="small" />
        </SurfaceCard>
      </Box>

      <SurfaceCard>
        <Typography variant="subtitle1">Recent Activities</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {[
            { activity: 'Outbound Call', deal: 'Acme Corp Expansion', owner: 'Sarah Johnson', date: 'Oct 24, 2023', status: 'Completed' },
            { activity: 'Product Demo', deal: 'Stark Industries SaaS', owner: 'Mike Ross', date: 'Oct 23, 2023', status: 'Pending' },
            { activity: 'Email Follow-up', deal: 'Global Logistics Contract', owner: 'Sarah Johnson', date: 'Oct 22, 2023', status: 'Completed' },
          ].map((row) => (
            <Stack key={row.activity} direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {row.activity}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {row.deal}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {row.owner}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ width: 140 }}>
                {row.date}
              </Typography>
              <StatusChip label={row.status} color={row.status === 'Completed' ? 'success' : 'warning'} />
            </Stack>
          ))}
        </Stack>
      </SurfaceCard>
    </PageContainer>
  )
}

export default ReportsPage
