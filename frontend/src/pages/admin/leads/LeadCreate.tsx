import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import { showSnackbar } from '../../../redux/reducer/snackbarSlice'
import { CreateLeadService } from '../../../utils/services/lead.service'
import { NAVIGATE_ADMIN } from '../../../constant'

const LeadCreatePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    enquiry_text: '',
  })

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.mobile) {
      dispatch(showSnackbar({ type: 'warning', message: 'Please fill required fields.' }))
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        mobile: form.mobile,
        email: form.email || undefined,
        enquiry_text: form.enquiry_text || undefined,
      }

      const { code, data, message } = await CreateLeadService(payload)
      if (code === 200 && data?.id) {
        dispatch(showSnackbar({ type: 'success', message: 'Lead created successfully.' }))
        navigate(NAVIGATE_ADMIN.LEAD_DETAILS_PAGE, { state: { id: data.id } })
      } else {
        dispatch(showSnackbar({ type: 'error', message: message || 'Failed to create lead.' }))
      }
    } catch (error: any) {
      dispatch(showSnackbar({ type: 'error', message: error?.message || 'Failed to create lead.' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Create Lead"
        subtitle="Capture a new lead and kick off the follow-up workflow."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <SurfaceCard>
          <h3 className="font-display text-lg font-semibold text-slate-900">Lead Details</h3>
          <div className="my-3 h-px bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Lead name"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile *</label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="Mobile number"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <h3 className="font-display text-lg font-semibold text-slate-900">Enquiry</h3>
          <div className="my-3 h-px bg-slate-200" />
          <textarea
            rows={3}
            value={form.enquiry_text}
            onChange={(e) => handleChange('enquiry_text', e.target.value)}
            placeholder="Enquiry text"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </SurfaceCard>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200/60"
          >
            {loading ? 'Saving...' : 'Create Lead'}
          </button>
          <button
            type="button"
            onClick={() => navigate(NAVIGATE_ADMIN.LEADS_PAGE)}
            className="rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </PageContainer>
  )
}

export default LeadCreatePage
