import React from 'react'

const DetailView = ({
  main,
  sidebar,
}: {
  main: React.ReactNode
  sidebar: React.ReactNode
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">{main}</div>
      <div className="lg:col-span-4">{sidebar}</div>
    </div>
  )
}

export default DetailView
