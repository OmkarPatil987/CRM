import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DetailTabs from '../../../components/admin/ui/DetailTabs'
import DetailView from '../../../components/admin/ui/DetailView'
import StatusChip from '../../../components/admin/ui/StatusChip'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import { deals } from '../mockData'

const DealDetailsPage = () => {
  const location = useLocation()
  const [tab, setTab] = useState(0)

  const deal = useMemo(() => {
    const id = (location.state as { id?: string } | undefined)?.id
    return deals.find((d) => d.id === id) ?? deals[0]
  }, [location.state])

  return (
    <PageContainer>
      <PageHeader
        title={deal.name}
        subtitle={`Stage: ${deal.stage}`}
        actions={
          <StatusChip
            label={deal.stage}
            color={deal.stage === 'Closed Won' ? 'success' : deal.stage === 'Negotiation' ? 'warning' : 'info'}
          />
        }
      />

      <DetailTabs value={tab} onChange={setTab} labels={['Overview', 'Activities', 'Files', 'Notes']} />

      <div className="mt-6">
        <DetailView
          main={
            <div className="space-y-4">
              <SurfaceCard>
                <h3 className="font-display text-lg font-semibold text-slate-900">Deal Summary</h3>
                <div className="my-3 h-px bg-slate-200" />
                <div className="space-y-1 text-sm text-slate-700">
                  <p>Value: {deal.value}</p>
                  <p>Probability: {deal.probability}</p>
                  <p>Close Date: {deal.closeDate}</p>
                </div>
              </SurfaceCard>
              {tab === 1 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Activities</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Call scheduled with stakeholder</p>
                </SurfaceCard>
              )}
              {tab === 2 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Files</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Deal_Scope.pdf</p>
                </SurfaceCard>
              )}
              {tab === 3 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Notes</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Awaiting final approval.</p>
                </SurfaceCard>
              )}
            </div>
          }
          sidebar={
            <div className="space-y-4">
              <SurfaceCard>
                <h3 className="font-display text-lg font-semibold text-slate-900">Owner</h3>
                <div className="my-3 h-px bg-slate-200" />
                <p className="text-sm text-slate-700">{deal.owner}</p>
              </SurfaceCard>
            </div>
          }
        />
      </div>
    </PageContainer>
  )
}

export default DealDetailsPage
