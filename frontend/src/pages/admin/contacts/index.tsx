import React, { useEffect, useMemo, useState } from 'react'
import { Add, FilterList, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DataTable, { DataColumn } from '../../../components/admin/ui/DataTable'
import StatusChip from '../../../components/admin/ui/StatusChip'
import ActionMenu from '../../../components/admin/ui/ActionMenu'
import ActionButton from '../../../components/admin/ui/ActionButton'
import { NAVIGATE_ADMIN } from '../../../constant'
import { contacts, ContactRecord } from '../mockData'

const ContactListPage = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'All' | ContactRecord['status']>('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filtered = useMemo(() => {
    const base = status === 'All' ? contacts : contacts.filter((c) => c.status === status)
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q)
    )
  }, [status, query])

  useEffect(() => {
    setPage(1)
  }, [status, query])

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns: DataColumn<ContactRecord>[] = [
    {
      id: 'name',
      header: 'Contact',
      render: (row) => (
        <div>
          <div className="text-sm font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">{row.title}</div>
        </div>
      ),
    },
    {
      id: 'company',
      header: 'Company',
      render: (row) => <span className="text-sm text-slate-700">{row.company}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      render: (row) => (
        <StatusChip label={row.status} color={row.status === 'VIP' ? 'warning' : row.status === 'Active' ? 'success' : 'default'} />
      ),
    },
    {
      id: 'owner',
      header: 'Owner',
      render: (row) => <span className="text-sm text-slate-700">{row.owner}</span>,
    },
    {
      id: 'lastContact',
      header: 'Last Contact',
      render: (row) => (
        <span className="text-xs font-medium text-slate-500">{row.lastContact}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <ActionMenu onView={() => navigate(NAVIGATE_ADMIN.CONTACT_DETAILS, { state: { id: row.id } })} />
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Contact Management"
        subtitle="Track and manage your key people across accounts."
        actions={
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Export" variant="outlined" />
            <ActionButton label="New Contact" variant="contained" startIcon={<Add />} />
          </div>
        }
      />

      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search
            fontSize="inherit"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search contacts by name, company, or owner..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="VIP">VIP</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ActionButton label="Filters" variant="outlined" startIcon={<FilterList />} />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        onRowClick={(row) => navigate(NAVIGATE_ADMIN.CONTACT_DETAILS, { state: { id: row.id } })}
        emptyTitle="No contacts found"
        emptyDescription="Try adjusting your filters."
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-slate-500">
          Showing {rows.length} of {filtered.length} contacts
        </span>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((p) => (
            <ActionButton
              key={p}
              label={`${p}`}
              variant={p === page ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setPage(p)}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

export default ContactListPage
