'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import EventsGrid from '@/components/EventsGrid'
import PollSection from '@/components/PollSection'
import FeaturesSection from '@/components/FeaturesSection'
import ThemesSection from '@/components/ThemesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import AdminLoginModal from '@/components/AdminLoginModal'
import AdminDashboard from '@/components/AdminDashboard'
import EventPage from '@/components/EventPage'
import RegisterFlow from '@/components/RegisterFlow'
import Toast from '@/components/Toast'
import { useAuth } from './layout'
import type { Event } from '@/types'

export type AppView = 'home' | 'event' | 'register'

export default function HomePage() {
  const { isAdmin } = useAuth()
  const [view, setView] = useState<AppView>('home')
  const [showLogin, setShowLogin] = useState(false)
  const [showDash, setShowDash] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const openEvent = (ev: Event) => {
    setSelectedEvent(ev)
    setView('event')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openRegister = (ev: Event) => {
    setSelectedEvent(ev)
    setView('register')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    setView('home')
    setSelectedEvent(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goEvents = () => {
    setView('home')
    setSelectedEvent(null)
    setTimeout(() => {
      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Show dashboard if admin and requested
  if (isAdmin && showDash) {
    return (
      <>
        <Navbar
          onHome={() => { setShowDash(false); goHome() }}
          onEvents={() => { setShowDash(false); goEvents() }}
          onLoginClick={() => setShowLogin(true)}
          onDashClick={() => setShowDash(true)}
        />
        <AdminDashboard showToast={showToast} onViewEvent={openEvent} />
        <Toast message={toast} />
      </>
    )
  }

  return (
    <>
      <Navbar
        onHome={goHome}
        onEvents={goEvents}
        onLoginClick={() => setShowLogin(true)}
        onDashClick={() => setShowDash(true)}
      />

      {view === 'home' && (
        <>
          <Hero onExplore={goEvents} onAdmin={() => setShowLogin(true)} />
          <div id="events-section">
            <EventsGrid onEventClick={openEvent} />
          </div>
          <PollSection />
          <FeaturesSection />
          <ThemesSection />
          <TestimonialsSection />
          <CTASection onExplore={goEvents} />
          <Footer onHome={goHome} onEvents={goEvents} onAdmin={() => setShowLogin(true)} />
        </>
      )}

      {view === 'event' && selectedEvent && (
        <EventPage
          event={selectedEvent}
          onBack={goEvents}
          onRegister={openRegister}
        />
      )}

      {view === 'register' && selectedEvent && (
        <RegisterFlow
          event={selectedEvent}
          onBack={() => { setView('event') }}
          onDone={() => { showToast('Booking confirmed! 🎉'); goHome() }}
        />
      )}

      {showLogin && (
        <AdminLoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => { setShowLogin(false); setShowDash(true) }}
        />
      )}

      <Toast message={toast} />
    </>
  )
}
