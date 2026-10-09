import { Menu } from 'lucide-react'
import './Header.css'

function Header({
  activePage,
  user,
  isSuperAdmin,
  onMenuClick,
  onProfileClick,
}) {
  const pageTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Ringkasan sistem PENINK' },
    shortlink: { title: 'Short Link', subtitle: 'Kelola short link kamu' },
    linkhub: { title: 'Link Hub', subtitle: 'Kumpulan link dalam satu halaman' },
    statistik: { title: 'Statistik', subtitle: 'Data penggunaan sistem' },
    saran: { title: 'Saran & Masukan', subtitle: 'Masukan untuk PENINK' },
    'feedback-list': { title: 'Saran & Masukan', subtitle: 'Daftar masukan pengguna' },
    users: { title: 'Kelola User', subtitle: 'Manajemen pengguna sistem' },
    'locked-aliases': { title: 'Kelola Alias', subtitle: 'Alias yang dikunci untuk OPD tertentu' },
  }

  const current = pageTitles[activePage] || {
    title: 'Dashboard',
    subtitle: 'Sistem Pengelolaan Short Link',
  }

  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menu-btn"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>

        <div className="header__titles">
          <h1 className="header__title">{current.title}</h1>
          <p className="header__subtitle">{current.subtitle}</p>
        </div>
      </div>

            <div className="header__right">
        <button
          type="button"
          className="header__profile"
          onClick={onProfileClick}
        >
                    {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="header__avatar-img"
            />
          ) : (
            <div className="header__avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="header__user-info">
            <span className="header__user-name">
              {user?.name || 'Pengguna'}
            </span>
            <span className="header__user-role">
              {(user?.role || 'user').toUpperCase().replace('_', ' ')}
            </span>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header