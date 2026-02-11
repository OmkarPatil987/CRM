import React from 'react'
import { Add, FilterList } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DataTable, { DataColumn } from '../../../components/admin/ui/DataTable'
import ActionMenu from '../../../components/admin/ui/ActionMenu'
import ActionButton from '../../../components/admin/ui/ActionButton'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import { NAVIGATE_ADMIN } from '../../../constant'
import { activities, ActivityRecord } from '../mockData'

const ActivitiesPage = () => {
  const navigate = useNavigate()
  const columns: DataColumn<ActivityRecord>[] = [
    {
      id: 'type',
      header: 'Type',
      render: (row) => <span className="text-sm font-semibold text-slate-900">{row.type}</span>,
    },
    {
      id: 'subject',
      header: 'Subject',
      render: (row) => <span className="text-sm text-slate-700">{row.subject}</span>,
    },
    {
      id: 'account',
      header: 'Account',
      render: (row) => <span className="text-sm text-slate-700">{row.account}</span>,
    },
    {
      id: 'time',
      header: 'Time',
      render: (row) => (
        <span className="text-xs font-medium text-slate-500">{row.time}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <ActionMenu onView={() => navigate(NAVIGATE_ADMIN.ACTIVITY_DETAILS, { state: { id: row.id } })} />
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Activities & Tasks"
        subtitle="Keep track of customer interactions and your daily to-dos."
        actions={
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Filter" variant="outlined" startIcon={<FilterList />} />
            <ActionButton label="New Activity" variant="contained" startIcon={<Add />} />
          </div>
        }
      />

      <div className="space-y-6">
        <DataTable
          columns={columns}
          rows={activities}
          onRowClick={(row) => navigate(NAVIGATE_ADMIN.ACTIVITY_DETAILS, { state: { id: row.id } })}
          emptyTitle="No activities found"
        />

        <SurfaceCard>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900">Tasks</h3>
          </div>
          <div className="my-3 h-px bg-slate-200" />
          <div className="space-y-3">
            {[
              { id: 't1', title: 'Review Q4 Revenue Report', due: 'Due Today' },
              { id: 't2', title: 'Send contract to Stark Ind.', due: 'Tomorrow' },
              { id: 't3', title: 'Draft intro email for new leads', due: 'Completed', completed: true },
            ].map((task) => (
              <label key={task.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!task.completed}
                  readOnly
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                />
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500">{task.due}</p>
                </div>
              </label>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </PageContainer>
  )
}

export default ActivitiesPage
