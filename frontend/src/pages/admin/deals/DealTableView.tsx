import React from 'react'
import DataTable, { DataColumn } from '../../../components/admin/ui/DataTable'
import ActionMenu from '../../../components/admin/ui/ActionMenu'
import StatusChip from '../../../components/admin/ui/StatusChip'
import { DealListResponse } from '../../../utils/dto/response/deal'
import { useNavigate } from 'react-router-dom'
import { NAVIGATE_ADMIN } from '../../../constant'

interface DealTableViewProps {
    rows: DealListResponse[]
    loading: boolean
    onEdit: (deal: DealListResponse) => void
    onDelete: (id: number) => void
}

const DealTableView: React.FC<DealTableViewProps> = ({ rows, loading, onEdit, onDelete }) => {
    const navigate = useNavigate()

    const columns: DataColumn<DealListResponse>[] = [
        {
            id: 'title',
            header: 'Deal Name',
            render: (row) => (
                <div>
                    <div className="text-sm font-semibold text-slate-900">{row.title}</div>
                    <div className="text-xs text-slate-500">Prob: {row.probability}%</div>
                </div>
            ),
        },
        {
            id: 'amount',
            header: 'Amount',
            render: (row) => <span className="text-sm text-slate-700">${row.amount.toLocaleString()}</span>,
        },
        {
            id: 'stage',
            header: 'Stage',
            render: (row) => <StatusChip label={row.stage} color="default" />,
        },
        {
            id: 'expected_close_date',
            header: 'Close Date',
            render: (row) => <span className="text-sm text-slate-700">{row.expected_close_date}</span>,
        },
        {
            id: 'contact',
            header: 'Contact',
            render: (row) => <span className="text-sm text-slate-700">{row.contact_name || '-'}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            align: 'right',
            render: (row) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(row); }} className="text-blue-600 text-xs mx-2">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(row.id); }} className="text-red-600 text-xs">Delete</button>
                </div>
            ),
        },
    ]

    return (
        <DataTable
            columns={columns}
            rows={rows}
            loading={loading}
            onRowClick={(row) => navigate(NAVIGATE_ADMIN.DEAL_DETAILS_PAGE.replace(':id', row.id.toString()), { state: { id: row.id } })} // Assuming route exists
            emptyTitle="No deals found"
            emptyDescription="Try adjusting your filters."
        />
    )
}

export default DealTableView
