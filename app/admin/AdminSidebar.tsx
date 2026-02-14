'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SOCIAL_META, mergeSocialLinks } from '@/lib/social'
import type { SocialLink } from '@/lib/social'

const MENU = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '📋', label: 'Bookings', href: '/admin/bookings' },
  { icon: '💬', label: 'Chat Logs', href: '/admin/chats' },
  { icon: '🚐', label: 'Vehicles', href: '/admin/vehicles' },
  { icon: '✈️', label: 'Routes', href: '/admin/routes' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
]

const SIDEBAR_SOCIAL_NAMES = ['LINE', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'WhatsApp']

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarSocials, setSidebarSocials] = useState<SocialLink[]>([])

  useEffect(() => {
    fetch('/api/settings/social')
      .then((r) => r.json())
      .then((urls) => {
        const all = mergeSocialLinks(urls)
        setSidebarSocials(all.filter((s) => SIDEBAR_SOCIAL_NAMES.includes(s.name)))
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(198,167,94,0.1)' }}>
        <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🚐</span>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
              SunSea<span style={{ color: '#C6A75E' }}>RapidsCare</span>
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MENU.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  background: active ? 'rgba(198,167,94,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid #C6A75E' : '3px solid transparent',
                  color: active ? '#C6A75E' : '#9CA3AF',
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Social Icons */}
      {sidebarSocials.length > 0 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(198,167,94,0.1)', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {sidebarSocials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              className="sidebar-social-icon"
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: s.bgGradient || s.color,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: s.name === 'Lemon8' ? '#0B1C2D' : '#FFFFFF',
                textDecoration: 'none',
                transition: 'transform 0.2s, filter 0.2s',
              }}
            >
              <svg viewBox="0 0 24 24" width={13} height={13} dangerouslySetInnerHTML={{ __html: s.svg }} />
            </a>
          ))}
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(198,167,94,0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            background: 'transparent',
            color: '#9CA3AF',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            transition: 'color 0.2s',
          }}
        >
          <span style={{ fontSize: 18 }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: '#12263A',
        borderRight: '1px solid rgba(198,167,94,0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
        className="admin-sidebar-desktop"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="admin-hamburger"
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 200,
          width: 44,
          height: 44,
          borderRadius: 10,
          background: '#12263A',
          border: '1px solid rgba(198,167,94,0.2)',
          color: '#C6A75E',
          fontSize: 22,
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex' }}
          onClick={() => setMobileOpen(false)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <aside
            style={{
              position: 'relative',
              width: 260,
              background: '#12263A',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideRight 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'transparent',
                border: '1px solid rgba(198,167,94,0.2)',
                color: '#9CA3AF',
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
