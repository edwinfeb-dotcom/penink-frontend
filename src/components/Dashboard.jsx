import {
  Users,
  Link2,
  CheckCircle2,
  MousePointerClick,
  UserCheck,
  Users2,
  FolderKanban,
  QrCode,
  ArrowRight,
} from 'lucide-react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

import './Dashboard.css'

function Dashboard({
  isAdmin,
  adminStats,
  qrScans,
  shortLinks,
  totalClicks,
  todayClicks,
  monthClicks,
  user,
  url,
  setUrl,
  title,
  setTitle,
  alias,
  setAlias,
  loading,
  shortenUrl,
  setActivePage,
}) {
  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  if (isAdmin) {
    const statCards = [
      {
        label: 'Total User',
        value: adminStats?.total_users ?? 0,
        icon: Users,
        color: 'blue',
      },
      {
        label: 'Total Short Link',
        value: adminStats?.total_short_links ?? 0,
        icon: Link2,
        color: 'indigo',
      },
      {
        label: 'Short Link Aktif',
        value: adminStats?.active_short_links ?? 0,
        icon: CheckCircle2,
        color: 'green',
      },
      {
        label: 'Total Klik',
        value: adminStats?.total_clicks ?? 0,
        icon: MousePointerClick,
        color: 'orange',
      },
      {
        label: 'User ASN',
        value: adminStats?.total_users_asn ?? 0,
        icon: UserCheck,
        color: 'cyan',
      },
      {
        label: 'User Umum',
        value: adminStats?.total_users_umum ?? 0,
        icon: Users2,
        color: 'pink',
      },
      {
        label: 'Total Link Hub',
        value: adminStats?.total_link_hubs ?? 0,
        icon: FolderKanban,
        color: 'teal',
      },
      {
        label: 'QR di-scan',
        value: qrScans ?? 0,
        icon: QrCode,
        color: 'red',
      },
    ]

    const userChartData = [
      {
        jenis: 'ASN',
        jumlah: adminStats?.total_users_asn ?? 0,
        fill: '#06B6D4',
      },
      {
        jenis: 'Umum',
        jumlah: adminStats?.total_users_umum ?? 0,
        fill: '#EC4899',
      },
    ]

    const unitChartData = (adminStats?.short_links_by_unit || []).map(
      (item) => ({
        unit: item.unit_kerja,
        jumlah: item.jumlah,
      })
    )

    return (
      <div className="dashboard">

        {/* HERO ADMIN */}
        <div className="dashboard__hero">
          <div className="dashboard__hero-content">
            <span className="dashboard__hero-badge">PENINK ADMIN</span>
            <h1 className="dashboard__hero-title">
              Selamat datang, {user?.name || 'Admin'} 👋
            </h1>
            <p className="dashboard__hero-subtitle">
              Kelola sistem PENINK dengan mudah dan cepat.
            </p>

            <div className="dashboard__hero-actions">
              <button
                type="button"
                className="dashboard__hero-btn"
                onClick={() => setActivePage('users')}
              >
                Kelola User
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="dashboard__hero-btn dashboard__hero-btn--ghost"
                onClick={() => setActivePage('shortlink')}
              >
                Lihat Short Link
              </button>
            </div>
          </div>

          <div className="dashboard__hero-decoration" aria-hidden="true">
            <div className="dashboard__hero-circle dashboard__hero-circle--1" />
            <div className="dashboard__hero-circle dashboard__hero-circle--2" />
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="dashboard__stats">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                className={`dash-stat dash-stat--${card.color}`}
              >
                <div className="dash-stat__icon">
                  <Icon size={20} />
                </div>
                <div className="dash-stat__body">
                  <span className="dash-stat__label">{card.label}</span>
                  <span className="dash-stat__value">{card.value}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* CHART USER BY JENIS */}
        <div className="dashboard__chart-card">
          <div className="dashboard__chart-header">
            <div>
              <h3 className="dashboard__chart-title">
                Pengguna Berdasarkan Jenis
              </h3>
              <p className="dashboard__chart-subtitle">
                Perbandingan user ASN dan Umum
              </p>
            </div>
          </div>

          <div className="dashboard__chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={userChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="jenis"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 13 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="jumlah" radius={[8, 8, 0, 0]} barSize={80}>
                  {userChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART SHORT LINK BY UNIT */}
        <div className="dashboard__chart-card">
          <div className="dashboard__chart-header">
            <div>
              <h3 className="dashboard__chart-title">
                Short Link Berdasarkan Unit Kerja
              </h3>
              <p className="dashboard__chart-subtitle">
                Distribusi short link per unit kerja
              </p>
            </div>
          </div>

          <div className="dashboard__chart-body">
            {unitChartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={Math.max(280, unitChartData.length * 55)}
              >
                <BarChart
                  layout="vertical"
                  data={unitChartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="unit"
                    width={240}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#334155', fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
                      fontSize: '13px',
                    }}
                  />
                  <Bar
                    dataKey="jumlah"
                    fill="#0F766E"
                    radius={[0, 8, 8, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="dashboard__empty">
                Data unit kerja belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // USER DASHBOARD
  // =====================================================

  const userStatCards = [
    {
      label: 'Total Link',
      value: shortLinks.length,
      icon: Link2,
      color: 'blue',
    },
    {
      label: 'Total Klik',
      value: totalClicks,
      icon: MousePointerClick,
      color: 'orange',
    },
    {
      label: 'Klik Hari Ini',
      value: todayClicks,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      label: 'Klik Bulan Ini',
      value: monthClicks,
      icon: Users2,
      color: 'indigo',
    },
  ]

  return (
    <div className="dashboard">

      {/* HERO USER */}
      <div className="dashboard__hero">
        <div className="dashboard__hero-content">
          <span className="dashboard__hero-badge">PENINK</span>
          <h1 className="dashboard__hero-title">
            Halo, {user?.name || 'Pengguna'} 👋
          </h1>
          <p className="dashboard__hero-subtitle">
            Buat, kelola, dan pantau short link kamu dengan mudah.
          </p>

          <div className="dashboard__hero-actions">
            <button
              type="button"
              className="dashboard__hero-btn"
              onClick={() => setActivePage('shortlink')}
            >
              Kelola Short Link
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="dashboard__hero-decoration" aria-hidden="true">
          <div className="dashboard__hero-circle dashboard__hero-circle--1" />
          <div className="dashboard__hero-circle dashboard__hero-circle--2" />
        </div>
      </div>

      {/* FORM BUAT SHORT LINK */}
      <div className="dashboard__form-card">
        <div className="dashboard__form-header">
          <h3 className="dashboard__form-title">Buat Short Link</h3>
          <p className="dashboard__form-subtitle">
            Masukkan URL tujuan lalu bagikan link PENINK yang lebih singkat.
          </p>
        </div>

        <div className="dashboard__form">
          <input
            className="input"
            type="text"
            placeholder="https://contoh.go.id/halaman-panjang"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            className="input"
            type="text"
            placeholder="Judul link (opsional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            type="text"
            placeholder="Custom alias (opsional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />

          <button
            type="button"
            className="dashboard__submit"
            onClick={shortenUrl}
            disabled={loading}
          >
            {loading ? 'Memproses...' : '🔗 Singkatkan URL'}
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="dashboard__stats">
        {userStatCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className={`dash-stat dash-stat--${card.color}`}
            >
              <div className="dash-stat__icon">
                <Icon size={20} />
              </div>
              <div className="dash-stat__body">
                <span className="dash-stat__label">{card.label}</span>
                <span className="dash-stat__value">{card.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* DAFTAR SHORT LINK TERBARU */}
      <div className="dashboard__list-card">
        <div className="dashboard__list-header">
          <div>
            <h3 className="dashboard__list-title">Short Link Terbaru</h3>
            <p className="dashboard__list-subtitle">
              Daftar short link yang kamu miliki.
            </p>
          </div>

          <button
            type="button"
            className="dashboard__list-btn"
            onClick={() => setActivePage('shortlink')}
          >
            Lihat Semua
          </button>
        </div>

        {shortLinks.length === 0 ? (
          <div className="dashboard__empty">
            <div className="dashboard__empty-icon">🔗</div>
            <strong>Belum ada short link</strong>
            <p>Buat short link pertama kamu dari form di atas.</p>
          </div>
        ) : (
          <div className="dashboard__list">
            {shortLinks.slice(0, 5).map((link) => (
              <div key={link.id} className="dashboard__link-item">
                <div className="dashboard__link-info">
                  <div className="dashboard__link-top">
                    <strong className="dashboard__link-title">
                      {link.title || 'Tanpa judul'}
                    </strong>
                    <span
                      className={`dashboard__link-status ${
                        link.status
                          ? 'dashboard__link-status--active'
                          : 'dashboard__link-status--inactive'
                      }`}
                    >
                      {link.status ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <span className="dashboard__link-url">
                    {link.short_code}
                  </span>
                </div>

                <div className="dashboard__link-clicks">
                  <strong>{link.click_count ?? 0}</strong>
                  <span>klik</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard