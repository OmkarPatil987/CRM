import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DetailView from '../../../components/admin/ui/DetailView'
import DetailTabs from '../../../components/admin/ui/DetailTabs'
import StatusChip from '../../../components/admin/ui/StatusChip'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import { contacts } from '../mockData'

const ContactDetailsPage = () => {
  const location = useLocation()
  const [tab, setTab] = useState(0)

  const contact = useMemo(() => {
    const id = (location.state as { id?: string } | undefined)?.id
    return contacts.find((c) => c.id === id) ?? contacts[0]
  }, [location.state])

  return (
    <PageContainer>
      <PageHeader
        title={contact.name}
        subtitle={`${contact.title} - ${contact.company}`}
        actions={
          <StatusChip
            label={contact.status}
            color={contact.status === 'VIP' ? 'warning' : contact.status === 'Active' ? 'success' : 'default'}
          />
        }
      />

      <DetailTabs value={tab} onChange={setTab} labels={['Overview', 'Activities', 'Files', 'Notes']} />

      <div className="mt-6">
        <DetailView
          main={
            <div className="space-y-4">
              <SurfaceCard>
                <h3 className="font-display text-lg font-semibold text-slate-900">Contact Details</h3>
                <div className="my-3 h-px bg-slate-200" />
                <div className="space-y-1 text-sm text-slate-700">
                  <p>Email: {contact.email}</p>
                  <p>Phone: {contact.phone}</p>
                  <p>Location: {contact.location}</p>
                  <p>Website: {contact.website}</p>
                </div>
              </SurfaceCard>

              <SurfaceCard>
                <h3 className="font-display text-lg font-semibold text-slate-900">Account Summary</h3>
                <div className="my-3 h-px bg-slate-200" />
                <p className="text-sm text-slate-700">
                  Primary contact at {contact.company}. Last contacted on {contact.lastContact}.
                </p>
              </SurfaceCard>

              {tab === 1 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Activities</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <div className="space-y-1 text-sm text-slate-700">
                    <p>Call logged with contact</p>
                    <p>Email follow-up sent</p>
                  </div>
                </SurfaceCard>
              )}
              {tab === 2 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Files</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <div className="space-y-1 text-sm text-slate-700">
                    <p>Contract.pdf</p>
                    <p>Onboarding_Checklist.docx</p>
                  </div>
                </SurfaceCard>
              )}
              {tab === 3 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Notes</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Prefers email communication. Schedule monthly check-ins.</p>
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Contact</p>
                    <p className="text-sm text-slate-700">{contact.lastContact}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</p>
                    <p className="text-sm text-slate-700">{contact.owner}</p>
                  </div>
                </div>
              </SurfaceCard>
            </div>
          }
        />
      </div>
    </PageContainer>
  )
}

export default ContactDetailsPage
