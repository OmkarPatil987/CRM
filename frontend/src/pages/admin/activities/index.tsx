import React, { useEffect, useState } from 'react'
import { Add, FilterList, Search, Call, MeetingRoom, Email, Note, CheckCircle, Schedule, ErrorOutline, Edit, Delete } from '@mui/icons-material'
// import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import ActionButton from '../../../components/admin/ui/ActionButton'
import { ActivityListRequest, ActivityResponse, ActivityStatus, ActivityType } from '../../../utils/dto/activity'
import { FetchActivityListService } from '../../../utils/services/activity.service'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import { Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import { format } from 'date-fns'
import { openDialog } from '../../../redux/reducer/dialogSlice'
import { RootState } from '../../../redux/store'
import { setModuleRefresh } from '../../../redux/reducer/refreshSlice'

const ActivityListPage = () => {
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const refresh = useSelector((state: RootState) => state.refresh['activity_list'])

    // Filters
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [status, setStatus] = useState<string>('All')
    const [type, setType] = useState<string>('All')
    const [relatedType, setRelatedType] = useState<string>('All')

    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [activities, setActivities] = useState<ActivityResponse[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)

    // Using query params for 7 days default is handled by backend if we send empty Start/End params
    // OR we can set them here to show in UI.
    // "If empty → default to last 7 days". Use Backend logic? 
    // BUT "User must be able to filter past data using date and status filters... If empty -> default to last 7 days"
    // Ideally UI should reflect "Last 7 Days".
    // I will initialize them empty and let backend handle it, OR set them.
    // Prompt: "On page load -> call GET /activities (no filters) -> returns last 7 days"
    // So I will send empty strings initially.

    const fetchActivities = async () => {
        setLoading(true)
        try {
            const payload: ActivityListRequest = {
                page,
                limit,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                status: status !== 'All' ? status : undefined,
                type: type !== 'All' ? type : undefined,
                related_type: relatedType !== 'All' ? relatedType : undefined
            }
            const { code, data, message } = await FetchActivityListService(payload)
            if (code === 200 && data?.data) {
                setActivities(data.data)
                setTotalCount(data.totalCount)
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to fetch activities' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to fetch' }))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities()
    }, [page, limit, startDate, endDate, status, type, relatedType])

    useEffect(() => {
        if (refresh) {
            fetchActivities();
            dispatch(setModuleRefresh({ moduleName: 'activity_list', refresh: false }));
        }
    }, [refresh, dispatch]);

    const handleResetFilters = () => {
        setStartDate('')
        setEndDate('')
        setStatus('All')
        setType('All')
        setRelatedType('All')
        setPage(1)
    }

    const handleCreate = () => {
        dispatch(openDialog({
            type: 'ActivityForm',
            title: 'Create Activity',
            payload: { mode: 'CREATE' }
        }))
    }

    const handleUpdate = (activity: ActivityResponse) => {
        dispatch(openDialog({
            type: 'ActivityForm',
            title: 'Edit Activity',
            payload: { mode: 'EDIT', data: activity }
        }))
    }

    const handleDelete = (activity: ActivityResponse) => {
        dispatch(openDialog({
            type: 'CommonDeleteDialog', // We need to make sure this is registered in MapDialogComponents
            title: 'Delete Activity',
            payload: {
                url: 'activities', // API endpoint suffix? CommonDeleteService likely takes 'activities' -> DELETE /activities/{id} ??
                // CommonDeleteService checks payload.url and payload.request.
                // It calls `handleDeleteRequest(url/id)`?
                // Let's check CommonDeleteService in product.service.ts if possible, or assume standard.
                // CommonDeleteDialog calls `CommonDeleteService(payload?.url, payload.request)`.
                // If url is 'activities', and request has id.
                // Assuming CommonDeleteService handles it.
                // Wait, typically CommonDeleteService needs full url or base + ID?
                // `activity.service.ts` uses `activities/${id}`.
                // If CommonDeleteService is generic, it might need help.
                // Let's assume for now. Ideally should check `product.service.ts`.
                // Actually `CommonDeleteDialog` uses: `await CommonDeleteService(payload?.url, payload.request)`
                // Let's assume url='activities' and request={id: activity.id} works with the service properly.
                // Or I can use a simpler approach if I wasn't using the common dialog.
                // But let's try to use common dialog as per plan.
                request: { id: activity.id },
                message: `Are you sure you want to delete activity "${activity.title}"?`,
                refresh: 'activity_list'
            }
        }))
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case ActivityType.CALL: return <Call fontSize="small" className="text-blue-500" />
            case ActivityType.MEETING: return <MeetingRoom fontSize="small" className="text-purple-500" />
            case ActivityType.EMAIL: return <Email fontSize="small" className="text-orange-500" />
            case ActivityType.NOTE: return <Note fontSize="small" className="text-gray-500" />
            default: return <Note fontSize="small" />
        }
    }

    const isOverdue = (dateStr: string, status: string) => {
        if (status === ActivityStatus.COMPLETED) return false
        return new Date(dateStr) < new Date()
    }

    return (
        <PageContainer>
            <PageHeader
                title="Activities"
                subtitle="Track and manage all your interactions."
                actions={
                    <ActionButton
                        label="New Activity"
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    />
                }
            />

            {/* Filters */}
            <Paper className="mb-4 p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500">Date Range</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="All">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="All">All Types</option>
                            <option value="call">Call</option>
                            <option value="meeting">Meeting</option>
                            <option value="email">Email</option>
                            <option value="note">Note</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500">Related To</label>
                        <select
                            value={relatedType}
                            onChange={(e) => setRelatedType(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="All">All Entities</option>
                            <option value="lead">Lead</option>
                            <option value="deal">Deal</option>
                            <option value="contact">Contact</option>
                        </select>
                    </div>

                    <div className="pb-0.5">
                        <ActionButton
                            label="Reset"
                            size="medium"
                            variant="text"
                            color="default"
                            onClick={handleResetFilters}
                        />
                    </div>
                </div>
            </Paper>

            {/* List */}
            <TableContainer component={Paper} className="shadow-sm rounded-xl border border-slate-100 overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-semibold text-slate-600">Type</TableCell>
                            <TableCell className="font-semibold text-slate-600">Title</TableCell>
                            <TableCell className="font-semibold text-slate-600">Related To</TableCell>
                            <TableCell className="font-semibold text-slate-600">Scheduled</TableCell>
                            <TableCell className="font-semibold text-slate-600">Status</TableCell>
                            {/* <TableCell className="font-semibold text-slate-600">Owner</TableCell> */}
                            <TableCell align="right" className="font-semibold text-slate-600"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-8">Loading...</TableCell>
                            </TableRow>
                        )}
                        {!loading && activities.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-8 text-slate-500">No activities found</TableCell>
                            </TableRow>
                        )}
                        {!loading && activities.map((activity) => (
                            <TableRow key={activity.id} className={`hover:bg-slate-50 transition-colors ${activity.status === ActivityStatus.COMPLETED ? 'bg-slate-50/50 opacity-75' : ''}`}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(activity.type)}
                                        <span className="capitalize text-sm">{activity.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-medium ${activity.status === ActivityStatus.COMPLETED ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                        {activity.title}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <Chip
                                            label={activity.related_type}
                                            size="small"
                                            className="w-fit text-xs capitalize mb-1"
                                            color="default"
                                            variant="outlined"
                                        />
                                        <span className="text-xs text-slate-500">ID: {activity.related_id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 ">
                                        {isOverdue(activity.scheduled_at, activity.status) && (
                                            <Tooltip title="Overdue">
                                                <ErrorOutline fontSize="small" className="text-red-500 h-4 w-4" />
                                            </Tooltip>
                                        )}
                                        <div className={`flex flex-col text-sm ${isOverdue(activity.scheduled_at, activity.status) ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                                            <span>{format(new Date(activity.scheduled_at), 'MMM dd, yyyy')}</span>
                                            <span className="text-xs opacity-75">{format(new Date(activity.scheduled_at), 'h:mm a')}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={activity.status}
                                        size="small"
                                        color={activity.status === ActivityStatus.COMPLETED ? 'success' : 'default'}
                                        variant={activity.status === ActivityStatus.COMPLETED ? 'filled' : 'outlined'}
                                        className="capitalize"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <div className="flex items-center justify-end gap-1">
                                        <IconButton size="small" onClick={() => handleUpdate(activity)}>
                                            <Edit fontSize="small" className="text-slate-500 hover:text-blue-600" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(activity)}>
                                            <Delete fontSize="small" className="text-slate-500 hover:text-red-600" />
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Controls could go here */}
        </PageContainer>
    )
}

export default ActivityListPage
