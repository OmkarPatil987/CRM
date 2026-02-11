export type LeadRecord = {
  id: string
  name: string
  company: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Nurturing' | 'Unqualified'
  owner: string
  createdAt: string
  email: string
  phone: string
}

export type ContactRecord = {
  id: string
  name: string
  title: string
  company: string
  status: 'Active' | 'Inactive' | 'VIP'
  owner: string
  lastContact: string
  email: string
  phone: string
  location: string
  website: string
}

export type DealRecord = {
  id: string
  name: string
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won'
  value: string
  owner: string
  probability: string
  closeDate: string
}

export type ActivityRecord = {
  id: string
  type: 'Call' | 'Email' | 'Meeting'
  subject: string
  time: string
  account: string
}

export const leads: LeadRecord[] = [
  {
    id: 'lead-1',
    name: 'John Doe',
    company: 'TechFlow Inc.',
    status: 'New',
    owner: 'Sarah Chen',
    createdAt: 'Oct 24, 2023',
    email: 'john.doe@techflow.com',
    phone: '+1 555-0123',
  },
  {
    id: 'lead-2',
    name: 'Jane Smith',
    company: 'Green Energy Co.',
    status: 'Contacted',
    owner: 'Mike Ross',
    createdAt: 'Oct 22, 2023',
    email: 'jane.smith@greenenergy.com',
    phone: '+1 555-0108',
  },
  {
    id: 'lead-3',
    name: 'Robert Brown',
    company: 'Buildit Ltd',
    status: 'Qualified',
    owner: 'Sarah Chen',
    createdAt: 'Oct 20, 2023',
    email: 'robert.brown@buildit.com',
    phone: '+1 555-0131',
  },
  {
    id: 'lead-4',
    name: 'Alice Wong',
    company: 'SoftSolutions',
    status: 'Nurturing',
    owner: 'Harvey Specter',
    createdAt: 'Oct 18, 2023',
    email: 'alice.wong@softsolutions.com',
    phone: '+1 555-0190',
  },
  {
    id: 'lead-5',
    name: 'Kevin Lee',
    company: 'FastTrack Logistics',
    status: 'Unqualified',
    owner: 'Mike Ross',
    createdAt: 'Oct 15, 2023',
    email: 'kevin.lee@fasttrack.com',
    phone: '+1 555-0176',
  },
]

export const contacts: ContactRecord[] = [
  {
    id: 'contact-1',
    name: 'John Doe',
    title: 'Chief Technology Officer',
    company: 'TechFlow Inc.',
    status: 'VIP',
    owner: 'Sarah Chen',
    lastContact: 'Oct 24, 2023',
    email: 'john.doe@techflow.com',
    phone: '+1 555-0123',
    location: 'San Francisco, CA',
    website: 'techflow.io',
  },
  {
    id: 'contact-2',
    name: 'Jane Smith',
    title: 'Head of Operations',
    company: 'Green Energy Co.',
    status: 'Active',
    owner: 'Mike Ross',
    lastContact: 'Oct 22, 2023',
    email: 'jane.smith@greenenergy.com',
    phone: '+1 555-0108',
    location: 'Austin, TX',
    website: 'greenenergy.com',
  },
  {
    id: 'contact-3',
    name: 'Robert Brown',
    title: 'Product Lead',
    company: 'Buildit Ltd',
    status: 'Active',
    owner: 'Sarah Chen',
    lastContact: 'Oct 20, 2023',
    email: 'robert.brown@buildit.com',
    phone: '+1 555-0131',
    location: 'Seattle, WA',
    website: 'buildit.io',
  },
  {
    id: 'contact-4',
    name: 'Alice Wong',
    title: 'Sales Director',
    company: 'SoftSolutions',
    status: 'Inactive',
    owner: 'Harvey Specter',
    lastContact: 'Oct 18, 2023',
    email: 'alice.wong@softsolutions.com',
    phone: '+1 555-0190',
    location: 'New York, NY',
    website: 'softsolutions.com',
  },
  {
    id: 'contact-5',
    name: 'Kevin Lee',
    title: 'VP Logistics',
    company: 'FastTrack Logistics',
    status: 'Active',
    owner: 'Mike Ross',
    lastContact: 'Oct 15, 2023',
    email: 'kevin.lee@fasttrack.com',
    phone: '+1 555-0176',
    location: 'Chicago, IL',
    website: 'fasttrack.com',
  },
]

export const deals: DealRecord[] = [
  {
    id: 'deal-1',
    name: 'Acme Corp Expansion',
    stage: 'Discovery',
    value: '$12,500',
    owner: 'Sarah Chen',
    probability: '20%',
    closeDate: 'Oct 24, 2024',
  },
  {
    id: 'deal-2',
    name: 'Global Logistics Ltd',
    stage: 'Proposal',
    value: '$28,000',
    owner: 'Mike Ross',
    probability: '45%',
    closeDate: 'Sep 30, 2024',
  },
  {
    id: 'deal-3',
    name: 'Tesla Factory North',
    stage: 'Negotiation',
    value: '$82,000',
    owner: 'Sarah Chen',
    probability: '85%',
    closeDate: 'Sep 22, 2024',
  },
  {
    id: 'deal-4',
    name: 'Netflix Content Div',
    stage: 'Closed Won',
    value: '$110,000',
    owner: 'Harvey Specter',
    probability: '100%',
    closeDate: 'Aug 18, 2024',
  },
]

export const activities: ActivityRecord[] = [
  {
    id: 'activity-1',
    type: 'Call',
    subject: 'Call with Sarah Jenkins',
    time: '10:45 AM',
    account: 'Acme Corp',
  },
  {
    id: 'activity-2',
    type: 'Email',
    subject: 'Email Sent to Michael Chen',
    time: 'Yesterday, 4:20 PM',
    account: 'Globex Inc',
  },
  {
    id: 'activity-3',
    type: 'Meeting',
    subject: 'Meeting: Project Kickoff',
    time: 'Yesterday, 1:00 PM',
    account: 'Globex Inc',
  },
]
