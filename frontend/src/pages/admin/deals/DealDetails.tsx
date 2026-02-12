import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DetailView from '../../../components/admin/ui/DetailView'
import DetailTabs from '../../../components/admin/ui/DetailTabs'
import StatusChip from '../../../components/admin/ui/StatusChip'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import ActionButton from '../../../components/admin/ui/ActionButton'
import { Edit, Delete, ArrowBack } from '@mui/icons-material'
import { FetchDealDetailsService, DeleteDealService, UpdateDealService } from '../../../utils/services/deal.service'
import { DealResponse } from '../../../utils/dto/response/deal'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import DealCreateUpdateModal from './DealCreateUpdateModal'
import { DealUpdateRequest } from '../../../utils/dto/request/deal'
import { NAVIGATE_ADMIN } from '../../../constant'

const DealDetailsPage = () => {
    const { id } = useParams()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)
    const [deal, setDeal] = useState<DealResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    // Use ID from params or location state
    const dealId = id ? parseInt(id) : (location.state as any)?.id

    const fetchDetails = async () => {
        if (!dealId) return
        setLoading(true)
        try {
            const res = await FetchDealDetailsService(dealId)
            if (res.code === 200 && res.data) {
                setDeal(res.data)
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to fetch details' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error fetching details' }))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDetails()
    }, [dealId])

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this deal?')) return
        try {
            const res = await DeleteDealService(dealId)
            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Deal deleted' }))
                navigate(NAVIGATE_ADMIN.DEALS_PAGE)
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to delete' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        }
    }

    const handleUpdate = async (values: DealUpdateRequest) => {
        try {
            const res = await UpdateDealService(values)
            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Deal updated' }))
                fetchDetails()
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to update' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        }
    }

    const getUpdateInitialValues = (): DealUpdateRequest | undefined => {
        if (!deal) return undefined
        return {
            id: deal.id,
            title: deal.title,
            description: deal.description,
            amount: deal.amount,
            stage: deal.stage,
            status: deal.status,
            probability: deal.probability,
            expected_close_date: deal.expected_close_date,
            contact_id: deal.contact_id,
            lead_id: deal.lead_id,
            owner_id: deal.owner_id,
            notes: deal.notes,
        }
    }

    if (loading) return <div>Loading...</div>
    if (!deal) return <div>Deal not found</div>

    return (
        <PageContainer>
            <div className="mb-4">
                <ActionButton
                    label="Back to Deals"
                    variant="text"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(NAVIGATE_ADMIN.DEALS_PAGE)}
                />
            </div>
            <PageHeader
                title={deal.title}
                subtitle={`Amount: $${deal.amount.toLocaleString()} | Probability: ${deal.probability}%`}
                actions={
                    <div className="flex items-center gap-2">
                        <StatusChip label={deal.stage} color="default" />
                        <StatusChip label={deal.status} color={deal.status === 'Won' ? 'success' : deal.status === 'Lost' ? 'error' : 'default'} />
                        <ActionButton
                            label="Edit"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => setModalOpen(true)}
                        />
                        <ActionButton
                            label="Delete"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={handleDelete}
                        />
                    </div>
                }
            />

            <DetailTabs value={tab} onChange={setTab} labels={['Overview', 'Timeline', 'Notes', 'Related']} />

            <div className="mt-6">
                <DetailView
                    main={
                        <div className="space-y-4">
                            {tab === 0 && (
                                <>
                                    <SurfaceCard>
                                        <h3 className="font-display text-lg font-semibold text-slate-900">Deal Info</h3>
                                        <div className="my-3 h-px bg-slate-200" />
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm text-slate-700">
                                            <div>
                                                <p className="font-semibold text-slate-500">Expected Close</p>
                                                <p>{deal.expected_close_date || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-500">Linked Contact</p>
                                                <p className="text-indigo-600 cursor-pointer" onClick={() => deal.contact_id && navigate(NAVIGATE_ADMIN.CONTACT_DETAILS_PAGE.replace(':id', deal.contact_id.toString()))}>
                                                    {deal.contact_name || deal.contact_id || '-'}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="font-semibold text-slate-500">Description</p>
                                                <p>{deal.description || '-'}</p>
                                            </div>
                                        </div>
                                    </SurfaceCard>
                                </>
                            )}
                            {tab === 1 && (
                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Activity Timeline</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <p className="text-sm text-slate-500">Coming soon...</p>
                                </SurfaceCard>
                            )}
                            {tab === 2 && (
                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Notes</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{deal.notes || 'No notes added.'}</p>
                                </SurfaceCard>
                            )}
                            {tab === 3 && (
                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Related Entities</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <div className="space-y-2 text-sm text-slate-700">
                                        <div>
                                            <span className="font-semibold text-slate-500">Linked Lead ID: </span>
                                            <span>{deal.lead_id || '-'}</span>
                                        </div>
                                    </div>
                                </SurfaceCard>
                            )}
                        </div>
                    }
                    sidebar={
                        <div className="space-y-4">
                            <SurfaceCard>
                                <h3 className="font-display text-lg font-semibold text-slate-900">Meta</h3>
                                <div className="my-3 h-px bg-slate-200" />
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner ID</p>
                                        <p className="text-sm text-slate-700">{deal.owner_id || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created At</p>
                                        <p className="text-sm text-slate-700">{new Date(deal.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Updated At</p>
                                        <p className="text-sm text-slate-700">{new Date(deal.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </SurfaceCard>
                        </div>
                    }
                />
            </div>

            <DealCreateUpdateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleUpdate as any}
                initialValues={getUpdateInitialValues()}
                isEdit={true}
            />
        </PageContainer>
    )
}

export default DealDetailsPage
