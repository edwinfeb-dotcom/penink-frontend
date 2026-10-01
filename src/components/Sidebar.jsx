import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  BarChart3,
  MessageSquare,
  Users,
  X,
  LogOut,
} from 'lucide-react'
import './Sidebar.css'

function Sidebar({
  activePage,
  setActivePage,
  setShowProfile,
  user,
  isAdmin,
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

  const initial = user?.name?.charAt(0).toUpperCase() || 'U'

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
            <img
              src="/logo-kominfo-landak.png"
              alt="Logo Diskominfo Landak"
              className="sidebar__logo"
            />
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

          {isAdmin && (
            <div className="sidebar__section">
              <span className="sidebar__section-title">PENGELOLAAN</span>

              {menuAdmin.map((item) => {
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
          )}
        </nav>

                <div className="sidebar__footer">
          <div className="sidebar__user">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="sidebar__avatar-img"
              />
            ) : (
              <div className="sidebar__avatar">{initial}</div>
            )}
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">
                {user?.name || 'Pengguna'}
              </span>
              <span className="sidebar__user-role">
                {(user?.role || 'user').toUpperCase()}
              </span>
            </div>
          </div>

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