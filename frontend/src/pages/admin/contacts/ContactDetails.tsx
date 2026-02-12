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
import { FetchContactDetailsService, DeleteContactService, UpdateContactService } from '../../../utils/services/contact.service'
import { ContactResponse } from '../../../utils/dto/response/contact'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import ContactCreateUpdateModal from './ContactCreateUpdateModal'
import { ContactUpdateRequest } from '../../../utils/dto/request/contact'
import { NAVIGATE_ADMIN } from '../../../constant'

const ContactDetailsPage = () => {
    const { id } = useParams()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)
    const [contact, setContact] = useState<ContactResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    // Use ID from params or location state
    const contactId = id ? parseInt(id) : (location.state as any)?.id

    const fetchDetails = async () => {
        if (!contactId) return
        setLoading(true)
        try {
            const res = await FetchContactDetailsService(contactId)
            if (res.code === 200 && res.data) {
                setContact(res.data)
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
    }, [contactId])

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return
        try {
            const res = await DeleteContactService(contactId)
            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Contact deleted' }))
                navigate(NAVIGATE_ADMIN.CONTACTS_PAGE)
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to delete' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        }
    }

    const handleUpdate = async (values: ContactUpdateRequest) => {
        try {
            const res = await UpdateContactService(values)
            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Contact updated' }))
                fetchDetails()
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to update' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        }
    }

    const getUpdateInitialValues = (): ContactUpdateRequest | undefined => {
        if (!contact) return undefined
        return {
            id: contact.id,
            name: contact.name,
            mobile: contact.mobile,
            email: contact.email,
            company: contact.company,
            designation: contact.designation,
            status: contact.status,
            vip: contact.vip,
            owner_id: contact.owner_id,
            tags: contact.tags,
            notes: contact.notes,
            address: contact.address
        }
    }

    if (loading) return <div>Loading...</div>
    if (!contact) return <div>Contact not found</div>

    return (
        <PageContainer>
            <div className="mb-4">
                <ActionButton
                    label="Back to Contacts"
                    variant="text"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(NAVIGATE_ADMIN.CONTACTS_PAGE)}
                />
            </div>
            <PageHeader
                title={contact.name}
                subtitle={`${contact.designation || '-'} at ${contact.company || '-'}`}
                actions={
                    <div className="flex items-center gap-2">
                        <StatusChip
                            label={contact.status}
                            color={contact.vip ? 'warning' : 'default'}
                        />
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

            <DetailTabs value={tab} onChange={setTab} labels={['Overview', 'Notes', 'Related']} />

            <div className="mt-6">
                <DetailView
                    main={
                        <div className="space-y-4">
                            {tab === 0 && (
                                <>
                                    <SurfaceCard>
                                        <h3 className="font-display text-lg font-semibold text-slate-900">Contact Info</h3>
                                        <div className="my-3 h-px bg-slate-200" />
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm text-slate-700">
                                            <div>
                                                <p className="font-semibold text-slate-500">Email</p>
                                                <p>{contact.email || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-500">Phone</p>
                                                <p>{contact.mobile || '-'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="font-semibold text-slate-500">Address</p>
                                                <p>{contact.address || '-'}</p>
                                            </div>
                                        </div>
                                    </SurfaceCard>
                                    <SurfaceCard>
                                        <h3 className="font-display text-lg font-semibold text-slate-900">Tags</h3>
                                        <div className="my-3 h-px bg-slate-200" />
                                        <div className="flex flex-wrap gap-2">
                                            {contact.tags ? contact.tags.split(',').map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{tag.trim()}</span>
                                            )) : <span className="text-sm text-slate-500">No tags</span>}
                                        </div>
                                    </SurfaceCard>
                                </>
                            )}

                            {tab === 1 && (
                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Notes</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{contact.notes || 'No notes added.'}</p>
                                </SurfaceCard>
                            )}
                            {tab === 2 && (
                                <SurfaceCard>
                                    <h3 className="font-display text-lg font-semibold text-slate-900">Related Entities</h3>
                                    <div className="my-3 h-px bg-slate-200" />
                                    <div className="space-y-2 text-sm text-slate-700">
                                        <div>
                                            <span className="font-semibold text-slate-500">Linked Lead ID: </span>
                                            <span>{contact.lead_id || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-500">Linked Deal ID: </span>
                                            <span>{contact.deal_id || '-'}</span>
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
                                        <p className="text-sm text-slate-700">{contact.owner_id || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created At</p>
                                        <p className="text-sm text-slate-700">{new Date(contact.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Updated At</p>
                                        <p className="text-sm text-slate-700">{new Date(contact.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </SurfaceCard>
                        </div>
                    }
                />
            </div>

            <ContactCreateUpdateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleUpdate as any}
                initialValues={getUpdateInitialValues()}
                isEdit={true}
            />
        </PageContainer>
    )
}

export default ContactDetailsPage
