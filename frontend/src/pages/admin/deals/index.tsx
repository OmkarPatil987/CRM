import React from 'react'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DataTable, { DataColumn } from '../../../components/admin/ui/DataTable'
import StatusChip from '../../../components/admin/ui/StatusChip'
import ActionMenu from '../../../components/admin/ui/ActionMenu'
import ActionButton from '../../../components/admin/ui/ActionButton'
import { NAVIGATE_ADMIN } from '../../../constant'
import { deals, DealRecord } from '../mockData'

const DealsPipelinePage = () => {
  const navigate = useNavigate()
  const columns: DataColumn<DealRecord>[] = [
    {
      id: 'name',
      header: 'Deal',
      render: (row) => <span className="text-sm font-semibold text-slate-900">{row.name}</span>,
    },
    {
      id: 'stage',
      header: 'Stage',
      render: (row) => (
        <StatusChip
          label={row.stage}
          color={row.stage === 'Closed Won' ? 'success' : row.stage === 'Negotiation' ? 'warning' : 'info'}
        />
      ),
    },
    {
      id: 'value',
      header: 'Value',
      render: (row) => <span className="text-sm text-slate-700">{row.value}</span>,
    },
    {
      id: 'owner',
      header: 'Owner',
      render: (row) => <span className="text-sm text-slate-700">{row.owner}</span>,
    },
    {
      id: 'probability',
      header: 'Probability',
      render: (row) => <span className="text-xs font-medium text-slate-500">{row.probability}</span>,
    },
    {
      id: 'closeDate',
      header: 'Close Date',
      render: (row) => <span className="text-xs font-medium text-slate-500">{row.closeDate}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <ActionMenu onView={() => navigate(NAVIGATE_ADMIN.DEAL_DETAILS, { state: { id: row.id } })} />
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Deals Pipeline"
        subtitle="Track deals across your pipeline stages."
        actions={
          <div className="flex flex-wrap gap-2">
            <ActionButton label="New Deal" variant="contained" startIcon={<Add />} />
          </div>
        }
      />

      <DataTable
        columns={columns}
        rows={deals}
        onRowClick={(row) => navigate(NAVIGATE_ADMIN.DEAL_DETAILS, { state: { id: row.id } })}
        emptyTitle="No deals found"
      />
    </PageContainer>
  )
}

export default DealsPipelinePage
