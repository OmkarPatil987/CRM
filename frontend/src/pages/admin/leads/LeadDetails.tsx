import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
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

  const leadId = useMemo(() => {
    const stateId = (location.state as { id?: number } | undefined)?.id
    const queryId = searchParams.get('id')
    const id = stateId ?? (queryId ? Number(queryId) : undefined)
    return id && !Number.isNaN(id) ? id : null
  }, [location.state, searchParams])

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
      if (!leadId) {
        setLoading(false)
        setLead(null)
        return
      }
      setLoading(true)
      try {
        const detailRes = await FetchLeadDetailsService({ id: leadId })
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
  }, [leadId, dispatch])

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
        next_follow_up_date: '',
        next_follow_up_time: '',
      })
      if (code === 200) {
        setFollowUpAt('')
        setFollowUpNote('')
        setFollowUpStatus('language-barrier')
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

  return (
    <PageContainer>
      {loading && <LoadingState />}
      {!loading && !lead && (
        <SurfaceCard>
          <p className="text-sm text-slate-700">Lead not found. Please return to the lead list.</p>
        </SurfaceCard>
      )}
      {!loading && lead && (
        <>
          <PageHeader
            title={lead.name}
            subtitle={lead.mobile_number}
            actions={<StatusChip label={formatStatus(lead.lead_status)} color={statusColor(lead.lead_status) as any} />}
          />

          <DetailTabs
            value={tab}
            onChange={setTab}
            labels={['Overview', 'Follow-ups', 'Comments', 'Activity Log']}
          />

          <div className="mt-6">
            <DetailView
              main={
                <div className="space-y-4">
                  {tab === 0 && (
                    <>
                      <SurfaceCard>
                        <h3 className="font-display text-lg font-semibold text-slate-900">Lead Summary</h3>
                        <div className="my-3 h-px bg-slate-200" />
                        <div className="space-y-1 text-sm text-slate-700">
                          <p>Mobile: {lead.mobile_number}</p>
                          <p>Unique Lead ID: {lead.unique_lead_id}</p>
                          <p>Lead UUID: {lead.lead_uuid}</p>
                          <p>Services: {lead.services || '-'}</p>
                        </div>
                      </SurfaceCard>
                    </>
                  )}

                  {tab === 1 && (
                    <>
                      <SurfaceCard>
                        <h3 className="font-display text-lg font-semibold text-slate-900">Create Follow-up</h3>
                        <div className="my-3 h-px bg-slate-200" />
                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            type="datetime-local"
                            value={followUpAt}
                            onChange={(e) => setFollowUpAt(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          />
                          <select
                            value={followUpStatus}
                            onChange={(e) => setFollowUpStatus(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          >
                            <option value="language-barrier">Language Barrier</option>
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                          </select>
                          <input
                            type="text"
                            value={followUpNote}
                            onChange={(e) => setFollowUpNote(e.target.value)}
                            placeholder="Remark"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          />
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={handleAddFollowUp}
                            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400"
                          >
                            Add Follow-up
                          </button>
                        </div>
                      </SurfaceCard>

                      <SurfaceCard>
                        <h3 className="font-display text-lg font-semibold text-slate-900">Follow-up List</h3>
                        <div className="my-3 h-px bg-slate-200" />
                        <div className="space-y-3 text-sm text-slate-700">
                          {followUps.length === 0 && <p className="text-slate-500">No follow-ups scheduled.</p>}
                          {followUps.map((item) => (
                            <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-semibold">{formatDate(item.follow_up_date)}</span>
                                <span className="text-xs uppercase tracking-wide text-slate-500">{item.status}</span>
                              </div>
                              {item.remark && <p className="mt-1 text-xs text-slate-600">{item.remark}</p>}
                            </div>
                          ))}
                        </div>
                      </SurfaceCard>
                    </>
                  )}

                  {tab === 2 && (
                    <>
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
                    </>
                  )}

                  {tab === 3 && (
                    <SurfaceCard>
                      <h3 className="font-display text-lg font-semibold text-slate-900">Activity Log</h3>
                      <div className="my-3 h-px bg-slate-200" />
                      <div className="space-y-2 text-sm text-slate-700">
                        {activities.length === 0 && <p className="text-slate-500">No activities yet.</p>}
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{activity.type}</span>
                              <span className="text-xs text-slate-500">{formatDate(activity.created_at)}</span>
                            </div>
                            {activity.remarks && <p className="text-sm text-slate-700">{activity.remarks}</p>}
                          </div>
                        ))}
                      </div>
                    </SurfaceCard>
                  )}
                </div>
              }
              sidebar={
                <div className="space-y-4">
                  <SurfaceCard>
                    <h3 className="font-display text-lg font-semibold text-slate-900">Lead Meta</h3>
                    <div className="my-3 h-px bg-slate-200" />
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                        <p className="text-sm text-slate-700">{formatStatus(lead.lead_status)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</p>
                        <p className="text-sm text-slate-700">-</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source</p>
                        <p className="text-sm text-slate-700">-</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next Follow-up</p>
                        <p className="text-sm text-slate-700">-</p>
                      </div>
                    </div>
                  </SurfaceCard>
                  <SurfaceCard>
                    <h3 className="font-display text-lg font-semibold text-slate-900">Timeline</h3>
                    <div className="my-3 h-px bg-slate-200" />
                    <div className="space-y-3 text-sm text-slate-700">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</p>
                        <p>{formatDate(lead.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                        <p>{formatDate(lead.updated_at)}</p>
                      </div>
                    </div>
                  </SurfaceCard>
                </div>
              }
            />
          </div>
        </>
      )}
    </PageContainer>
  )
}

export default LeadDetailsPage
