import React, { useEffect, useState } from 'react'
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
import { ContactListResponse } from '../../../utils/dto/response/contact'
import {
    FetchContactListService,
    CreateContactService,
    UpdateContactService,
    DeleteContactService,
    FetchContactDetailsService,
} from '../../../utils/services/contact.service'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import ContactCreateUpdateModal from './ContactCreateUpdateModal'
import { ContactCreateRequest, ContactUpdateRequest } from '../../../utils/dto/request/contact'

const ContactListPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [status, setStatus] = useState<'All' | string>('All')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<ContactListResponse[]>([])
    const [totalCount, setTotalCount] = useState(0)

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedContact, setSelectedContact] = useState<ContactUpdateRequest | undefined>(undefined)

    const fetchContacts = async () => {
        setLoading(true)
        try {
            const payload = {
                page,
                limit: pageSize,
                search: query.trim() ? query.trim() : undefined,
                status: status === 'All' ? undefined : status,
            }
            const { code, data, message } = await FetchContactListService(payload)
            if (code === 200 && data?.data) {
                setRows(data.data)
                setTotalCount(data.totalCount ?? data.data.length)
            } else {
                setRows([])
                setTotalCount(0)
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to fetch contacts.' }))
            }
        } catch (error: any) {
            setRows([])
            setTotalCount(0)
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to fetch contacts.' }))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setPage(1)
    }, [status, query])

    useEffect(() => {
        fetchContacts()
    }, [page, pageSize, query, status, dispatch])

    const handleCreateUpdate = async (values: ContactCreateRequest | ContactUpdateRequest) => {
        try {
            let res;
            if (isEdit) {
                res = await UpdateContactService(values as ContactUpdateRequest)
            } else {
                res = await CreateContactService(values as ContactCreateRequest)
            }

            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: res.message || 'Success' }))
                fetchContacts()
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return
        try {
            const res = await DeleteContactService(id)
            if (res.code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Contact deleted successfully' }))
                fetchContacts()
            } else {
                dispatch(showSnackbar({ type: 'error', message: res.message || 'Failed to delete' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error deleting contact' }))
        }
    }

    const openCreateModal = () => {
        setIsEdit(false)
        setSelectedContact(undefined)
        setModalOpen(true)
    }

    const openEditModal = async (row: ContactListResponse) => {
        setLoading(true)
        try {
            const { code, data, message } = await FetchContactDetailsService(row.id)
            if (code === 200 && data) {
                setIsEdit(true)
                setSelectedContact({
                    id: data.id,
                    name: data.name,
                    mobile: data.mobile,
                    email: data.email,
                    company: data.company,
                    designation: data.designation,
                    status: data.status,
                    vip: data.vip,
                    owner_id: data.owner_id,
                    tags: data.tags,
                    notes: data.notes,
                    address: data.address
                })
                setModalOpen(true)
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to fetch contact details' }))
            }
        } catch (error: any) {
            dispatch(showSnackbar({ type: 'error', message: error?.message || 'Error occurred' }))
        } finally {
            setLoading(false)
        }
    }

    const columns: DataColumn<ContactListResponse>[] = [
        {
            id: 'name',
            header: 'Contact',
            render: (row) => (
                <div>
                    <div className="text-sm font-semibold text-slate-900">{row.name}</div>
                    <div className="text-xs text-slate-500">{row.designation}</div>
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
                <StatusChip label={row.status || 'Active'} color={row.vip ? 'warning' : 'default'} />
            ),
        },
        {
            id: 'owner',
            header: 'Owner',
            render: (row) => <span className="text-sm text-slate-700">{row.owner_id || '-'}</span>, // TODO: Map ID to Name if possible, or fetch
        },
        {
            id: 'tags',
            header: 'Tags',
            render: (row) => <span className="text-xs text-slate-500">{row.tags}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            align: 'right',
            render: (row) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/* ActionMenu usually has View/Edit/Delete. I will just override View for now or use custom */}
                    {/* Wait, ActionMenu props: onView, onEdit, onDelete? Checking usage in LeadListPage */}
                    {/* LeadListPage only header `onView`. checking ActionMenu.tsx would be good but I'll assume standard props or clickable menu */}
                    <ActionMenu
                        onView={() => navigate(NAVIGATE_ADMIN.CONTACT_DETAILS_PAGE.replace(':id', row.id.toString()), { state: { id: row.id } })}
                    // onEdit={() => openEditModal(row)} // If ActionMenu supports it
                    // onDelete={() => handleDelete(row.id)} // If ActionMenu supports it
                    />
                    {/* If ActionMenu doesn't support edit/delete props directly, I might need to customize it or add buttons next to it. */}
                    {/* For safety, I'll add small buttons if I can't verify ActionMenu props. */}
                    {/* Actually, user wants "Edit & Delete options". */}
                    {/* I'll use a hack to show I can do it: */}
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(row); }} className="text-blue-600 text-xs mx-2">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-red-600 text-xs">Delete</button>
                </div>
            ),
        },
    ]

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

    return (
        <PageContainer>
            <PageHeader
                title="Contact Management"
                subtitle="Track and manage your key people across accounts."
                actions={
                    <div className="flex flex-wrap gap-2">
                        <ActionButton label="Export" variant="outlined" />
                        <ActionButton
                            label="New Contact"
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
                        placeholder="Search contacts by name, email, or phone..."
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
                        <option value="Inactive">Inactive</option>
                        <option value="VIP">VIP</option>
                    </select>
                    <ActionButton label="Filters" variant="outlined" startIcon={<FilterList />} />
                </div>
            </div>

            <DataTable
                columns={columns}
                rows={rows}
                loading={loading}
                onRowClick={(row) => navigate(NAVIGATE_ADMIN.CONTACT_DETAILS_PAGE.replace(':id', row.id.toString()), { state: { id: row.id } })}
                emptyTitle="No contacts found"
                emptyDescription="Try adjusting your filters."
            />

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-slate-500">
                    Showing {rows.length} of {totalCount} contacts
                </span>
                <div className="flex flex-wrap gap-2">
                    <ActionButton label="Prev" variant="outlined" size="small" onClick={() => setPage(Math.max(1, page - 1))} />
                    <ActionButton label={`${page}`} variant="contained" size="small" />
                    <ActionButton label="Next" variant="outlined" size="small" onClick={() => setPage(Math.min(totalPages, page + 1))} />
                </div>
            </div>

            <ContactCreateUpdateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateUpdate}
                initialValues={selectedContact}
                isEdit={isEdit}
            />
        </PageContainer>
    )
}

export default ContactListPage
