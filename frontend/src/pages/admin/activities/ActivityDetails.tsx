import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../components/admin/ui/PageContainer'
import PageHeader from '../../../components/admin/ui/PageHeader'
import DetailTabs from '../../../components/admin/ui/DetailTabs'
import DetailView from '../../../components/admin/ui/DetailView'
import SurfaceCard from '../../../components/admin/ui/SurfaceCard'
import { activities } from '../mockData'

const ActivityDetailsPage = () => {
  const location = useLocation()
  const [tab, setTab] = useState(0)

  const activity = useMemo(() => {
    const id = (location.state as { id?: string } | undefined)?.id
    return activities.find((a) => a.id === id) ?? activities[0]
  }, [location.state])

  return (
    <PageContainer>
      <PageHeader title={activity.subject} subtitle={activity.account} />

      <DetailTabs value={tab} onChange={setTab} labels={['Overview', 'Activities', 'Files', 'Notes']} />

      <div className="mt-6">
        <DetailView
          main={
            <div className="space-y-4">
              <SurfaceCard>
                <h3 className="font-display text-lg font-semibold text-slate-900">Activity Details</h3>
                <div className="my-3 h-px bg-slate-200" />
                <div className="space-y-1 text-sm text-slate-700">
                  <p>Type: {activity.type}</p>
                  <p>Time: {activity.time}</p>
                  <p>Account: {activity.account}</p>
                </div>
              </SurfaceCard>
              {tab === 1 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Related Activities</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Follow-up email scheduled</p>
                </SurfaceCard>
              )}
              {tab === 2 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Files</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Call_Notes.txt</p>
                </SurfaceCard>
              )}
              {tab === 3 && (
                <SurfaceCard>
                  <h3 className="font-display text-lg font-semibold text-slate-900">Notes</h3>
                  <div className="my-3 h-px bg-slate-200" />
                  <p className="text-sm text-slate-700">Customer requested pricing breakdown.</p>
                </SurfaceCard>
              )}
            </div>
          }
          sidebar={
            <div className="space-y-4">
              <SurfaceCard>
                <h3 className="font-display text-lg font-semibold text-slate-900">Meta</h3>
                <div className="my-3 h-px bg-slate-200" />
                <p className="text-sm text-slate-700">{activity.type}</p>
              </SurfaceCard>
            </div>
          }
        />
      </div>
    </PageContainer>
  )
}

export default ActivityDetailsPage
