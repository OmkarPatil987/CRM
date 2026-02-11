import React, { useEffect, useState } from 'react'

const addHeadLink = (id: string, href: string) => {
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

const HomePage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    addHeadLink(
      'font-inter',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    )
    addHeadLink(
      'material-symbols-outlined',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap'
    )
    addHeadLink(
      'material-symbols-outlined-fill',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
    )

    // initialize theme based on saved preference or OS setting
    const saved = window.localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = saved ?? (prefersDark ? 'dark' : 'light')
    applyTheme(initialTheme)
    setTheme(initialTheme)
  }, [])

  const applyTheme = (mode: 'light' | 'dark') => {
    const root = document.documentElement
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    window.localStorage.setItem('theme', mode)
  }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111218] dark:text-white">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Sticky Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-[#dbdde6] dark:border-[#2a2d3d] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">SalesCRM</h2>
            </div>
            <nav className="hidden md:flex items-center gap-10">
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Features
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Solutions
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Pricing
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Resources
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <button
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/80 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <button className="hidden sm:flex px-4 py-2 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                Log In
              </button>
              <button className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                Sign Up
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Trusted by 2,000+ teams</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                  Close more deals with <span className="text-primary">less effort</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                  The lightweight Sales CRM designed specifically for small B2B teams to manage leads, track
                  pipelines, and automate daily tasks without the bloat.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/30">
                    Start Free Trial
                  </button>
                  <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Schedule Demo
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-background-dark overflow-hidden">
                      <img
                        alt="User"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQo7fuKK7y21AgDTIW_M1ExM3MTq0fRHvf0pPlPAR07iiBw01oX2qFP7DMVO7vKiVrXhRAPQu669LaTp40kjZ3H3cI-wHsV8hTrRWmF4zTYIklFpV5RiMoWBigzlvvVq2xcgcKz99w2V4qakpnF2rUqVLfkAvU908dCc4RBDsRNSBDEZWoL-xlp3gxaje8tlOOFSEKlT6OivIRxbgQxsXZpjmjZVq8SBZx8e0VFCmbMuzebmGSAghJtrUzYf8bBuxzisQh_-hKL6xh"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-background-dark overflow-hidden">
                      <img
                        alt="User"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkeCLShzv4FsChwcZ_lLdjPZyURVB7mOMENL_F8PhPWg2jsiVBspoNv1j9Mpjj6S6f94w4KGRGbCw8e_CXcf38ptZl_d6ZyU2uBHnT-xCZtmPjLfObgXcLSHHyLhinNDAo-PHm9n27xwoY_wtj5cf9CXCmO_KQECceAbfJKLx6E1QrbVdSeo8kwH9yYzidBdvE3xulYJyNPXMEd2BD1SE5nefpN8AjiejGihHNQ0IKQDfHCE-vix6ncqKIpaUU0CYMO8gcSCVwALVA"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-background-dark overflow-hidden">
                      <img
                        alt="User"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9mmBhJAJwtMD_oTWV7hg80Sl-VWFQcCEVuNtd8dR7FwKNjlAC1cDwnVaFwrDbItFbGpZYFfogOg_pyeMqf9ajXwuhHz6zSNRk0KP94XSIduxUNXtezh9x6jLqjYK00wZxPUFJTe9wtkOsmfLg-ul9cNrJQd_1j0j3_w3m8OC9Ma9iWLrTOQe7LP9syLNHaZ6Opch2bcdGynRlfeOhi4bPQL3DznuxpvrfvZ3ZuyrW5iJkfaBdLR8DaoMzOxTxLaavY7sZhbNFN1Wl"
                      />
                    </div>
                  </div>
                  <p>Join 15,000+ sales pros already growing</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-tr from-primary/20 to-transparent absolute -inset-4 blur-3xl rounded-full"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden aspect-[4/3]">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4">
                    <div className="col-span-3 h-32 bg-primary/5 rounded-xl border border-primary/10 flex flex-col justify-center px-6">
                      <div className="text-xs font-bold text-primary mb-1">REVENUE FORECAST</div>
                      <div className="text-3xl font-black">$428,500</div>
                    </div>
                    <div className="h-40 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-primary">groups</span>
                      <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="h-40 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-green-500">trending_up</span>
                      <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="h-40 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-orange-500">task_alt</span>
                      <div className="h-2 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="bg-white dark:bg-background-dark/50 py-24 border-y border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Streamline your entire sales process</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to manage your sales cycle in one clean, intuitive interface designed for
                high-velocity teams.
              </p>
            </div>
            <div className="max-w-7xl mx-auto px-6 lg:px-20 grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="group p-8 bg-background-light dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">person_search</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Lead Management</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Capture leads from any source and qualify them instantly with automated custom scoring and
                  intelligent tagging.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="group p-8 bg-background-light dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">account_tree</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Pipeline Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Visualize your deals in a drag-and-drop Kanban interface. Forecast revenue with precision using
                  real-time stage analytics.
                </p>
              </div>
              {/* Feature Card 3 */}
              <div className="group p-8 bg-background-light dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">task</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Task Automation</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Never miss a follow-up with intelligent reminders. Sync your email and calendar to automate
                  meeting scheduling.
                </p>
              </div>
            </div>
          </section>

          {/* Alternating Feature Section */}
          <section className="max-w-7xl mx-auto px-6 lg:px-20 py-24 space-y-32">
            {/* Row 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="text-primary font-bold text-sm tracking-widest uppercase">Deep Insights</div>
                <h2 className="text-4xl font-bold">Powerful insights at your fingertips</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Stop guessing and start knowing. Our dashboard provides a real-time view of your sales
                  performance, identifying bottlenecks and highlighting your best-performing channels.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="font-medium">Customizable sales reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="font-medium">Win/loss analysis tools</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="font-medium">Team activity monitoring</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary h-2 w-full"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-end mb-8">
                        <div>
                          <div className="text-xs text-gray-500 uppercase font-bold">Active Deals</div>
                          <div className="text-2xl font-bold">24 Active</div>
                        </div>
                        <div className="text-green-500 text-sm font-bold flex items-center">
                          <span className="material-symbols-outlined text-sm">arrow_upward</span> 12%
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-2/3"></div>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40 w-1/2"></div>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/20 w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="text-primary font-bold text-sm tracking-widest uppercase">Connectivity</div>
                <h2 className="text-4xl font-bold">Integrates with your favorite tools</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  SalesCRM plays nicely with the tools you already use. Connect your email, calendar, and
                  marketing automation tools in just a few clicks.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <span className="font-bold">Gmail</span>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-blue-400">calendar_month</span>
                    <span className="font-bold">Outlook</span>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-orange-500">campaign</span>
                    <span className="font-bold">Mailchimp</span>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-indigo-500">hub</span>
                    <span className="font-bold">Zapier</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="relative flex items-center justify-center py-10">
                  <div className="absolute inset-0 bg-primary/5 rounded-full scale-75 blur-2xl"></div>
                  <div className="relative grid grid-cols-3 gap-8">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">chat</span>
                    </div>
                    <div className="w-20 h-20 bg-primary rounded-2xl shadow-2xl flex items-center justify-center text-white scale-110">
                      <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                    </div>
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">cloud</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Big Dashboard Highlight */}
          <section className="bg-primary/5 dark:bg-gray-900/30 py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl font-bold mb-6">Designed for clarity, built for speed</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We removed the complexity found in traditional CRMs to help you focus on what matters most:
                  building relationships and closing deals.
                </p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="w-full aspect-video bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center">
                    <div className="grid grid-cols-12 w-full h-full p-8 gap-6">
                      <div className="col-span-3 space-y-6">
                        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="space-y-3">
                          <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                          <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                          <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                        </div>
                      </div>
                      <div className="col-span-9 space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="h-24 bg-primary/10 rounded-xl border border-primary/20"></div>
                          <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                          <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                          <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                        </div>
                        <div className="h-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex gap-2">
                              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800"></div>
                              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800"></div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                <div className="h-2 w-48 bg-gray-50 dark:bg-gray-900 rounded"></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 opacity-60">
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                <div className="h-2 w-40 bg-gray-50 dark:bg-gray-900 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-7xl mx-auto px-6 lg:px-20 py-24">
            <div className="bg-primary rounded-[2.5rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                  Ready to boost your sales team's productivity?
                </h2>
                <p className="text-primary-100 text-lg opacity-90">
                  Start your 14-day free trial today. No credit card required. Cancel anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-colors shadow-lg shadow-black/10">
                    Get Started for Free
                  </button>
                  <button className="bg-primary/20 border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-colors">
                    Contact Sales
                  </button>
                </div>
                <p className="text-sm opacity-60">No implementation fees • Unlimited leads • Free migration assistance</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 px-6 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">SalesCRM</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Helping small B2B teams win big with modern sales tools and automation.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">public</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">share</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Integrations
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Help Center
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    API Docs
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Community
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-gray-100 dark:border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 SalesCRM Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
