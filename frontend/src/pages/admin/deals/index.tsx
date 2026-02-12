import React, { useEffect, useState } from 'react'
import { Add, FilterList, Search, ViewKanban, TableRows } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import ActionButton from '../../../components/admin/ui/ActionButton'
import { DealListResponse } from '../../../utils/dto/response/deal'
import {
    FetchDealListService,
    CreateDealService,
    UpdateDealService,
    DeleteDealService,
    FetchDealDetailsService,
    UpdateDealStageService,
} from '../../../utils/services/deal.service'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import DealCreateUpdateModal from './DealCreateUpdateModal'
import DealTableView from './DealTableView'
import DealKanbanBoard from './DealKanbanBoard'
import { DealCreateRequest, DealUpdateRequest } from '../../../utils/dto/request/deal'
import { DropResult } from '@hello-pangea/dnd'
import { NAVIGATE_ADMIN } from '../../../constant'

const DealListPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
    const [status, setStatus] = useState<'All' | string>('All')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 50 // Larger page size for Kanban to be useful
    const [loading, setLoading] = useState(false)
    const [deals, setDeals] = useState<DealListResponse[]>([])
    const [totalCount, setTotalCount] = useState(0)

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedDeal, setSelectedDeal] = useState<DealUpdateRequest | undefined>(undefined)

    const fetchDeals = async () => {
        setLoading(true)
        try {
            const payload = {
                page,
                limit: pageSize,
                search: query.trim() ? query.trim() : undefined,
                stage: status === 'All' ? undefined : status, // Using status filter as stage filter
            }
            const { code, data, message } = await FetchDealListService(payload)
            if (code === 200 && data?.data) {
                setDeals(data.data)
                setTotalCount(data.totalCount ?? data.data.length)
            } else {
                setDeals([])
                setTotalCount(0)
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to fetch deals.' }))
            }
        } catch (error: any) {
            setDeals([])
            setTotalCount(0)
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to fetch deals.' }))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDeals()
    }, [page, pageSize, query, status, dispatch])

    const handleCreateUpdate = async (values: DealCreateRequest | DealUpdateRequest) => {
        try {
            let res;
            if (isEdit) {
                res = await UpdateDealService(values as DealUpdateRequest)
            } else {
                res = await CreateDealService(values as DealCreateRequest)
            }

            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: res.message || 'Success' }))
                fetchDeals()
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this deal?')) return
        try {
            const res = await DeleteDealService(id)
            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Deal deleted successfully' }))
                fetchDeals()
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to delete' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error deleting deal' }))
        }
    }

    const openCreateModal = () => {
        setIsEdit(false)
        setSelectedDeal(undefined)
        setModalOpen(true)
    }

    const openEditModal = async (row: DealListResponse) => {
        setLoading(true)
        try {
            // Fetch details to ensure we have all fields
            const { code, data } = await FetchDealDetailsService(row.id)
            if (code === 200 && data) {
                setIsEdit(true)
                setSelectedDeal({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    amount: data.amount,
                    stage: data.stage,
                    status: data.status,
                    probability: data.probability,
                    expected_close_date: data.expected_close_date,
                    contact_id: data.contact_id,
                    lead_id: data.lead_id,
                    owner_id: data.owner_id,
                    notes: data.notes,
                })
                setModalOpen(true)
            } else {
                dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch deal details' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        } finally {
            setLoading(false)
        }
    }

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            // Optimistic update
            const movedDealId = parseInt(draggableId);
            const newStage = destination.droppableId;

            const updatedDeals = deals.map(d =>
                d.id === movedDealId ? { ...d, stage: newStage as any } : d
            );
            setDeals(updatedDeals);

            // API Call
            try {
                await UpdateDealStageService({ id: movedDealId, stage: newStage });
                dispatch(showSnackbar({ type: 'success', message: `Deal moved to ${newStage}` }));
            } catch (error) {
                dispatch(showSnackbar({ type: 'error', message: 'Failed to move deal' }));
                fetchDeals(); // Revert on failure
            }
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title="Deals Pipeline"
                subtitle="Manage your sales pipeline and track deal progress."
                actions={
                    <div className="flex flex-wrap gap-2">
                        <div className="flex bg-slate-100 rounded-lg p-1 mr-2">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <ViewKanban fontSize="small" className="mr-1" /> Board
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <TableRows fontSize="small" className="mr-1" /> List
                            </button>
                        </div>
                        <ActionButton
                            label="New Deal"
                            variant="contained"
                            startIcon={<Add />}
                            onClick={openCreateModal}
                        />
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
                        placeholder="Search deals..."
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
                        <option value="All">Stage: All</option>
                        {['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <ActionButton label="Filters" variant="outlined" startIcon={<FilterList />} />
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <div className="h-[calc(100vh-250px)] overflow-hidden">
                    <DealKanbanBoard
                        deals={deals}
                        onDragEnd={onDragEnd}
                        onDealClick={(id) => navigate(NAVIGATE_ADMIN.DEAL_DETAILS_PAGE.replace(':id', id.toString()))}
                    />
                </div>
            ) : (
                <DealTableView
                    rows={deals}
                    loading={loading}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                />
            )}

            {viewMode === 'table' && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-slate-500">
                        Showing {deals.length} of {totalCount} deals
                    </span>
                    {/* Pagination for table view - simplistic for now */}
                    <div className="flex flex-wrap gap-2">
                        <ActionButton label="Prev" variant="outlined" size="small" onClick={() => setPage(Math.max(1, page - 1))} />
                        <ActionButton label={`${page}`} variant="contained" size="small" />
                        <ActionButton label="Next" variant="outlined" size="small" onClick={() => setPage(page + 1)} />
                    </div>
                </div>
            )}

            <DealCreateUpdateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateUpdate}
                initialValues={selectedDeal}
                isEdit={isEdit}
            />
        </PageContainer>
    )
}

export default DealListPage
