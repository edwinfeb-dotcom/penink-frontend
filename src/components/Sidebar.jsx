import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  BarChart3,
  MessageSquare,
  Users,
  X,
  LogOut,
  Shield,
  Settings,
} from 'lucide-react'
import './Sidebar.css'

function Sidebar({
  activePage,
  setActivePage,
  setShowProfile,
  user,
  isAdmin,
  isSuperAdmin,
  isAdminUnit,      // ← BARU
  isOpen,
  onClose,
  onLogout,
}) {
  const handleMenuClick = (page) => {
    setActivePage(page)
    setShowProfile(false)
    if (onClose) onClose()
  }

  const menuUtama = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'shortlink', label: 'Short Link', icon: Link2 },
    { key: 'linkhub', label: 'Link Hub', icon: FolderKanban },
    { key: 'statistik', label: 'Statistik', icon: BarChart3 },
    { key: 'saran', label: 'Saran & Masukan', icon: MessageSquare },
  ]

  const menuAdmin = [
    { key: 'users', label: 'Kelola User', icon: Users },
  ]

  // =====================================================
  // CEK APA YANG BOLEH DIAKSES
  // =====================================================
  const canManageUsers = isAdmin || isAdminUnit
  const canManageAliases = isSuperAdmin
  const showManagementSection = canManageUsers || canManageAliases

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-top">
            {/* Bungkus kedua logo di sini */}
            <div className="sidebar__logos">
              <img
                src="/Lambang_Kabupaten_Landak.png"
                alt="Lambang Kabupaten Landak"
                className="sidebar__logo"
              />
              <div className="sidebar__logo-circle">
                <img
                  src="/logo-kominfo-landak.png"
                  alt="Logo Diskominfo Landak"
                  className="sidebar__logo"
                />
              </div>
            </div>

            {/* Tombol close tetap di sini, jangan diubah */}
            <button
              type="button"
              className="sidebar__close"
              onClick={onClose}
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          <h1 className="sidebar__title">PENINK</h1>
          <p className="sidebar__subtitle">
            Platform Short Link &amp; Link Hub
          </p>
          <p className="sidebar__location">Kabupaten Landak</p>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <span className="sidebar__section-title">UTAMA</span>

            {menuUtama.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`sidebar__item ${
                    activePage === item.key ? 'sidebar__item--active' : ''
                  }`}
                  onClick={() => handleMenuClick(item.key)}
                >
                  <Icon size={18} className="sidebar__icon" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {showManagementSection && (
            <div className="sidebar__section">
              <span className="sidebar__section-title">PENGELOLAAN</span>

              {/* Menu Kelola User — untuk admin, super_admin, & admin_unit */}
              {canManageUsers &&
                menuAdmin.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={`sidebar__item ${
                        activePage === item.key ? 'sidebar__item--active' : ''
                      }`}
                      onClick={() => handleMenuClick(item.key)}
                    >
                      <Icon size={18} className="sidebar__icon" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}

              {/* Menu Kelola Alias — HANYA super_admin */}
              {canManageAliases && (
                <button
                  type="button"
                  className={`sidebar__item ${
                    activePage === 'locked-aliases'
                      ? 'sidebar__item--active'
                      : ''
                  }`}
                  onClick={() => handleMenuClick('locked-aliases')}
                >
                  <Shield size={18} className="sidebar__icon" />
                  <span>Kelola Alias</span>
                </button>
              )}
            </div>
          )}
        </nav>

        <div className="sidebar__footer">
          <button
            type="button"
            className={`sidebar__item ${
              activePage === 'pengaturan' ? 'sidebar__item--active' : ''
            }`}
            onClick={() => handleMenuClick('pengaturan')}
          >
            <Settings size={18} className="sidebar__icon" />
            <span>Pengaturan</span>
          </button>

          <button
            type="button"
            className="sidebar__logout"
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar