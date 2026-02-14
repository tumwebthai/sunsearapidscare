import AdminSidebar from '../AdminSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1C2D' }}>
      <AdminSidebar />
      <main className="admin-main" style={{ marginLeft: 240, minHeight: '100vh', padding: '24px 32px' }}>
        {children}
      </main>

      {/* Admin responsive styles */}
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
          .admin-main { margin-left: 0 !important; padding: 68px 16px 24px !important; }
        }
      `}</style>
    </div>
  )
}
