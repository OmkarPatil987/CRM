import React, { useEffect, useMemo, useState } from 'react'
import { Add, FilterList, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DataTable, { DataColumn } from '../../../components/admin/ui/DataTable'
import StatusChip from '../../../components/admin/ui/StatusChip'
import ActionMenu from '../../../components/admin/ui/ActionMenu'
import ActionButton from '../../../components/admin/ui/ActionButton'
import { NAVIGATE_ADMIN } from '../../../constant'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import { FetchLeadListService } from '../../../utils/services/lead.service'
import { LeadListItem } from '../../../utils/dto/response/lead'

const LeadListPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [status, setStatus] = useState<'All' | string>('All')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<LeadListItem[]>([])
    const [totalCount, setTotalCount] = useState(0)

    const statusOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Unqualified', value: 'unqualified' },
        { label: 'Closed Won', value: 'closed_won' },
        { label: 'Closed Lost', value: 'closed_lost' },
    ]

    useEffect(() => {
        setPage(1)
    }, [status, query])

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true)
            try {
                const payload = {
                    page,
                    limit: pageSize,
                    search: query.trim() ? query.trim() : undefined,
                    status: status === 'All' ? undefined : status,
                }
                const { code, data, message } = await FetchLeadListService(payload)
                if (code === 200 && data?.data) {
                    setRows(data.data)
                    setTotalCount(data.totalCount ?? data.data.length)
                } else {
                    setRows([])
                    setTotalCount(0)
                    dispatch(showSnackbar({ type: 'error', message: message || 'Failed to fetch leads.' }))
                }
            } catch (error: any) {
                setRows([])
                setTotalCount(0)
                dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to fetch leads.' }))
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [page, pageSize, query, status, dispatch])

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

    const statusColor = (value: string) => {
        if (value.toLowerCase() === 'qualified' || value.toLowerCase() === 'closed_won') return 'success'
        if (value.toLowerCase() === 'unqualified' || value.toLowerCase() === 'closed_lost') return 'error'
        if (value.toLowerCase() === 'contacted' || value.toLowerCase() === 'nurturing') return 'warning'
        return 'info'
    }

    const formatStatus = (value: string) => {
        return value
            .toLowerCase()
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
    }

    const formatDate = (value?: string | null) => {
        if (!value) return '-'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return value
        return d.toLocaleString()
    }

    const columns: DataColumn<LeadListItem>[] = [
        {
            id: 'name',
            header: 'Lead Name',
            render: (row) => <span className="text-sm font-semibold text-slate-900">{row.name}</span>,
        },
        {
            id: 'mobile',
            header: 'Mobile',
            render: (row) => <span className="text-sm text-slate-700">{row.mobile}</span>,
        },
        {
            id: 'email',
            header: 'Email',
            render: (row) => <span className="text-sm text-slate-700">{row.email || '-'}</span>,
        },
        {
            id: 'enquiry',
            header: 'Enquiry',
            render: (row) => <span className="text-xs text-slate-600">{row.enquiry || '-'}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            render: (row) => <StatusChip label={formatStatus(row.status)} color={statusColor(row.status) as any} />,
        },
        {
            id: 'created',
            header: 'Created',
            render: (row) => <span className="text-xs font-medium text-slate-500">{formatDate(row.created_at)}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            align: 'right',
            render: (row) => (
                <ActionMenu onView={() => navigate(NAVIGATE_ADMIN.LEAD_DETAILS_PAGE.replace(':uuid', row.lead_uuid))} />
            ),
        },
    ]

    return (
        <PageContainer>
            <PageHeader
                title="Lead Management"
                subtitle="Track, qualify and convert your sales opportunities."
                actions={
                    <div className="flex flex-wrap gap-2">
                        <ActionButton label="Export" variant="outlined" />
                        <ActionButton
                            label="New Lead"
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate(NAVIGATE_ADMIN.LEAD_CREATE_PAGE)}
                        />
                    </div>
                }
            />

            <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200/60">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1">
                            <Search
                                fontSize="inherit"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search leads by name, phone, or title..."
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
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ActionButton label="Filters" variant="outlined" startIcon={<FilterList />} />
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    onRowClick={(row) => navigate(NAVIGATE_ADMIN.LEAD_DETAILS_PAGE.replace(':uuid', row.lead_uuid))}
                    emptyTitle="No leads found"
                    emptyDescription="Try adjusting your filters."
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-slate-500">
                        Showing {rows.length} of {totalCount} leads
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <ActionButton label="Prev" variant="outlined" size="small" onClick={() => setPage(Math.max(1, page - 1))} />
                        <ActionButton label={`${page}`} variant="contained" size="small" />
                        <ActionButton label="Next" variant="outlined" size="small" onClick={() => setPage(Math.min(totalPages, page + 1))} />
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}

export default LeadListPage
