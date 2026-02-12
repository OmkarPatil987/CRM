import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DetailView from '../../../components/admin/ui/DetailView'
import DetailTabs from '../../../components/admin/ui/DetailTabs'
import StatusChip from '../../../components/admin/ui/StatusChip'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import LoadingState from '../../../components/admin/ui/LoadingState'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import {
    AddLeadCommentService,
    AddLeadFollowUpService,
    FetchLeadActivitiesService,
    FetchLeadCommentsService,
    FetchLeadDetailsService,
    FetchLeadFollowUpsService,
} from '../../../utils/services/lead.service'
import { LeadActivity, LeadComment, LeadDetails, LeadFollowUp } from '../../../utils/dto/response/lead'

const LeadDetailsPage = () => {
    const { uuid } = useParams()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [lead, setLead] = useState<LeadDetails | null>(null)
    const [comments, setComments] = useState<LeadComment[]>([])
    const [activities, setActivities] = useState<LeadActivity[]>([])
    const [followUps, setFollowUps] = useState<LeadFollowUp[]>([])
    const [tab, setTab] = useState(0)
    const [commentText, setCommentText] = useState('')
    const [followUpAt, setFollowUpAt] = useState('')
    const [followUpNote, setFollowUpNote] = useState('')
    const [followUpStatus, setFollowUpStatus] = useState('language-barrier')
    const [scheduleNext, setScheduleNext] = useState(false)
    const [nextFollowUpDate, setNextFollowUpDate] = useState('')
    const [nextFollowUpTime, setNextFollowUpTime] = useState('')

    const leadId = useMemo(() => {
        const stateId = (location.state as { id?: number } | undefined)?.id
        const queryId = searchParams.get('id')
        const id = stateId ?? (queryId ? Number(queryId) : undefined)
        return id && !Number.isNaN(id) ? id : null
    }, [location.state, searchParams])

    const leadUUID = useMemo(() => {
        return uuid || searchParams.get('uuid') || (location.state as any)?.lead_uuid
    }, [uuid, searchParams, location.state])

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

    useEffect(() => {
        const loadAll = async () => {
            if (!leadId && !leadUUID) {
                setLoading(false)
                setLead(null)
                return
            }
            setLoading(true)
            try {
                const detailRes = await FetchLeadDetailsService(leadId ? { id: leadId } : { lead_uuid: leadUUID })
                if (detailRes.code === 200 && detailRes.data) {
                    setLead(detailRes.data)
                } else {
                    setLead(null)
                    dispatch(showSnackbar({ type: 'error', message: detailRes.message || 'Failed to load lead details.' }))
                }

                if (detailRes.code === 200 && detailRes.data?.lead_uuid) {
                    const leadUUID = detailRes.data.lead_uuid
                    const [commentsRes, activitiesRes, followUpsRes] = await Promise.all([
                        FetchLeadCommentsService({ lead_uuid: leadUUID, page: 1, limit: 10 }),
                        FetchLeadActivitiesService({ lead_uuid: leadUUID, page: 1, limit: 10 }),
                        FetchLeadFollowUpsService({ lead_uuid: leadUUID, page: 1, limit: 10 }),
                    ])

                    if (commentsRes.code === 200 && commentsRes.data?.data) {
                        setComments(commentsRes.data.data)
                    }

                    if (activitiesRes.code === 200 && activitiesRes.data?.data) {
                        setActivities(activitiesRes.data.data)
                    }

                    if (followUpsRes.code === 200 && followUpsRes.data?.data) {
                        setFollowUps(followUpsRes.data.data)
                    }
                }
            } catch (error: any) {
                dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to load lead data.' }))
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [leadId, leadUUID, dispatch])

    const handleAddComment = async () => {
        if (!lead?.lead_uuid || !commentText.trim()) return
        try {
            const { code, message } = await AddLeadCommentService({ lead_uuid: lead.lead_uuid, comment: commentText.trim() })
            if (code === 200) {
                setCommentText('')
                dispatch(showSnackbar({ type: 'success', message: 'Comment added.' }))
                const [commentsRes, activitiesRes] = await Promise.all([
                    FetchLeadCommentsService({ lead_uuid: lead.lead_uuid, page: 1, limit: 10 }),
                    FetchLeadActivitiesService({ lead_uuid: lead.lead_uuid, page: 1, limit: 10 }),
                ])
                if (commentsRes.data?.data) setComments(commentsRes.data.data)
                if (activitiesRes.data?.data) setActivities(activitiesRes.data.data)
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to add comment.' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to add comment.' }))
        }
    }

    const handleAddFollowUp = async () => {
        if (!lead?.lead_uuid || !followUpAt) return
        try {
            const dateObj = new Date(followUpAt)
            const followUpDate = dateObj.toISOString().slice(0, 10)
            const followUpTime = dateObj.toTimeString().slice(0, 8)
            const { code, message } = await AddLeadFollowUpService({
                lead_uuid: lead.lead_uuid,
                follow_up_date: followUpDate,
                follow_up_time: followUpTime,
                status: followUpStatus,
                remark: followUpNote.trim(),
                next_follow_up_date: scheduleNext ? nextFollowUpDate : '',
                next_follow_up_time: scheduleNext ? nextFollowUpTime : '',
            })
            if (code === 200) {
                setFollowUpAt('')
                setFollowUpNote('')
                setFollowUpStatus('language-barrier')
                setScheduleNext(false)
                setNextFollowUpDate('')
                setNextFollowUpTime('')
                dispatch(showSnackbar({ type: 'success', message: 'Follow-up scheduled.' }))
                const [followupRes, activityRes] = await Promise.all([
                    FetchLeadFollowUpsService({ lead_uuid: lead.lead_uuid, page: 1, limit: 10 }),
                    FetchLeadActivitiesService({ lead_uuid: lead.lead_uuid, page: 1, limit: 10 }),
                ])
                if (followupRes.data?.data) setFollowUps(followupRes.data.data)
                if (activityRes.data?.data) setActivities(activityRes.data.data)
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to schedule follow-up.' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to schedule follow-up.' }))
        }
    }

    const groupActivitiesByDate = (activities: LeadActivity[]) => {
        const groups: { [key: string]: LeadActivity[] } = {}
        activities.forEach((activity) => {
            const date = new Date(activity.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(activity)
        })
        return groups
    }

    const activityGroups = useMemo(() => groupActivitiesByDate(activities), [activities])

    return (
        <PageContainer>
            {loading && <LoadingState />}
            {!loading && !lead && (
                <SurfaceCard>
                    <p className="text-sm text-slate-700">Lead not found. Please return to the lead list.</p>
                </SurfaceCard>
            )}
            {!loading && lead && (
                <div className="space-y-6">
                    {/* Top Header Card */}
                    <SurfaceCard className="relative overflow-hidden">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <div className="mb-4 flex items-center gap-3">
                                    <h1 className="font-display text-2xl font-bold text-slate-900">
                                        {lead.unique_lead_id}
                                    </h1>
                                    <StatusChip label={formatStatus(lead.lead_status)} color={statusColor(lead.lead_status) as any} />
                                </div>

                                <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A9.916 9.916 0 0010 18c2.695 0 5.145-1.052 6.793-2.61A5.99 5.99 0 0010 12z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-slate-500">Name</p>
                                            <p className="font-medium text-slate-900">{lead.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0119.5 15.352V16.5a1.5 1.5 0 01-1.5 1.5H16.5a14.5 14.5 0 01-14.5-14.5V3.5z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-slate-500">Mobile</p>
                                            <p className="font-medium text-slate-900">{lead.mobile_number}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-slate-500">Created At</p>
                                            <p className="font-medium text-slate-900">{formatDate(lead.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.5-9a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-slate-500">Last Updated</p>
                                            <p className="font-medium text-slate-900">
                                                {formatDate(lead.updated_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-slate-500">Services</p>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {lead.services ? (
                                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {lead.services}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-slate-500">-</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                    </svg>
                                    Assign Agent
                                </button>
                            </div>
                        </div>
                    </SurfaceCard>

                    {/* Tabs & Content */}
                    <div className="space-y-6">
                        <DetailTabs
                            value={tab}
                            onChange={setTab}
                            labels={['Follow-ups', 'Comments', 'Documents', 'Activity Log']}
                        />

                        {/* Follow-ups Tab (Index 0 now) */}
                        {tab === 0 && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* History Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-display text-lg font-semibold text-slate-900">Follow-up History</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {followUps.length === 0 && (
                                            <SurfaceCard className="py-8 text-center">
                                                <p className="text-slate-500">No follow-ups recorded yet.</p>
                                            </SurfaceCard>
                                        )}
                                        {followUps.map((item) => (
                                            <SurfaceCard key={item.id} className="group relative overflow-hidden transition-all hover:shadow-md">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">Follow-up on {formatDate(item.follow_up_date)}</p>
                                                            <p className="text-xs text-slate-500">Updated by {item.updated_by || 'Unknown'} • {formatDate(item.updated_at)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ml-13 pl-3 border-l-2 border-slate-100">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="text-sm text-slate-500">Status:</span>
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                    {item.remark && (
                                                        <div className="mb-2 flex gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 text-slate-400">
                                                                <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 003.444-.33c1.436-.23 2.429-1.487 2.429-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 2.429c2.24 0 4.412.09 6.509.253.405.03.783.34.783.845v5.148c0 .506-.378.815-.783.846-2.097.163-4.269.253-6.509.253-2.24 0-4.412-.09-6.509-.253-.405-.03-.783-.34-.783-.846V5.527c0-.506.378-.815.783-.846A42.795 42.795 0 0010 4.429z" clipRule="evenodd" />
                                                            </svg>
                                                            <p className="text-sm text-slate-700">{item.remark}</p>
                                                        </div>
                                                    )}

                                                    {item.next_follow_up_date && (
                                                        <div className="flex items-center gap-2 text-orange-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-sm font-medium">
                                                                Next: {formatDate(item.next_follow_up_date)}{item.next_follow_up_time ? ` at ${item.next_follow_up_time}` : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </SurfaceCard>
                                        ))}
                                    </div>
                                </div>

                                {/* Create Form Column */}
                                <div className="space-y-4">
                                    <SurfaceCard>
                                        <h3 className="font-display text-lg font-semibold text-slate-900">Create Follow-up</h3>
                                        <div className="my-3 h-px bg-slate-200" />

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Follow-up Date *</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={followUpAt}
                                                        onChange={(e) => setFollowUpAt(e.target.value)}
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status *</label>
                                                    <select
                                                        value={followUpStatus}
                                                        onChange={(e) => setFollowUpStatus(e.target.value)}
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                    >
                                                        <option value="language-barrier">Language Barrier</option>
                                                        <option value="call_back">Call Back</option>
                                                        <option value="not_interested">Not Interested</option>
                                                        <option value="rnr">RNR</option>
                                                        <option value="switch_off">Switch Off</option>
                                                        <option value="busy">Busy</option>
                                                        <option value="wrong_number">Wrong Number</option>
                                                        <option value="interested">Interested</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="done">Done</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Remark *</label>
                                                <textarea
                                                    value={followUpNote}
                                                    onChange={(e) => setFollowUpNote(e.target.value)}
                                                    placeholder="Enter your remark..."
                                                    rows={3}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                />
                                                <p className="mt-1 text-right text-xs text-slate-400">{followUpNote.length}/500 characters</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="scheduleNext"
                                                    checked={scheduleNext}
                                                    onChange={(e) => setScheduleNext(e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label htmlFor="scheduleNext" className="text-sm font-medium text-slate-700">Schedule next follow-up?</label>
                                            </div>

                                            {scheduleNext && (
                                                <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date *</label>
                                                        <input
                                                            type="date"
                                                            value={nextFollowUpDate}
                                                            onChange={(e) => setNextFollowUpDate(e.target.value)}
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time *</label>
                                                        <input
                                                            type="time"
                                                            value={nextFollowUpTime}
                                                            onChange={(e) => setNextFollowUpTime(e.target.value)}
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAddFollowUp}
                                                    className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Create Follow-up
                                                </button>
                                            </div>
                                        </div>
                                    </SurfaceCard>
                                </div>
                            </div>
                        )}

                        {/* Comments Tab (Index 1) */}
                        {tab === 1 && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Add Comment</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write your comment..."
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    />
                                    <div className="mt-3">
                                        <button
                                            type="button"
                                            onClick={handleAddComment}
                                            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400"
                                        >
                                            Add Comment
                                        </button>
                                    </div>
                                </SurfaceCard>

                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Comment List</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <div className="space-y-3 text-sm text-slate-700">
                                        {comments.length === 0 && <p className="text-slate-500">No comments added yet.</p>}
                                        {comments.map((item) => (
                                            <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                                <p className="text-sm text-slate-700">{item.reamrk}</p>
                                                <p className="mt-1 text-xs text-slate-500">By {item.user_name || 'User'} · {formatDate(item.created_at)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </SurfaceCard>
                            </div>
                        )}

                        {/* Documents Tab (Index 2) */}
                        {tab === 2 && (
                            <SurfaceCard>
                                <p className="text-sm text-slate-500">Documents module coming soon.</p>
                            </SurfaceCard>
                        )}

                        {/* Activity Log Tab (Index 3) */}
                        {tab === 3 && (
                            <SurfaceCard>
                                <h3 className="font-display text-lg font-semibold text-slate-900">Activity Log</h3>
                                <div className="mt-6 flow-root">
                                    <ul role="list" className="-mb-8">
                                        {Object.entries(activityGroups).map(([date, dateActivities], dateIdx, arr) => (
                                            <li key={date}>
                                                <div className="relative pb-8">
                                                    {dateIdx !== arr.length - 1 ? (
                                                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                                    ) : null}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-slate-500">
                                                                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900">{date}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <ul role="list" className="-mb-8">
                                                    {dateActivities.map((activity, activityIdx) => (
                                                        <li key={activity.id}>
                                                            <div className="relative pb-8">
                                                                {/* Draw line unless it's the last item in the entire list - simplistic view, practically line should continue if there are more dates. 
                                                                    For nested list, we generally want line to connect to next item. 
                                                                */}
                                                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />

                                                                <div className="relative flex space-x-3">
                                                                    <div>
                                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 ring-8 ring-white">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-600">
                                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex min-w-0 flex-1 flex-col pt-1.5">
                                                                        <div className="text-sm text-slate-500">
                                                                            <span className="font-medium text-slate-900">{activity.type}</span> related action
                                                                        </div>
                                                                        {activity.remarks && <p className="mt-1 text-sm text-slate-700">{activity.remarks}</p>}
                                                                        <div className="mt-1 text-xs text-slate-400">
                                                                            {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by User
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="pb-8"></div> {/* Spacer between dates */}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </SurfaceCard>
                        )}
                    </div>
                </div>
            )}
        </PageContainer>
    )
}

export default LeadDetailsPage
