import {
  Users,
  Link2,
  MousePointerClick,
  CheckCircle2,
  Calendar,
  TrendingUp,
  UserCheck,
  Users2,
  FolderKanban,
  QrCode,
  XCircle, 
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import './Statistik.css'

function Statistik({
  isAdmin,
  adminStats,
  qrScans,
  shortLinks,
  totalClicks,
  activeLinks,
  todayClicks,
  monthClicks,
  statsData,
  statsDays,
  setStatsDays,
  user,
}) {
  const statCards = []

    if (isAdmin) {
    const totalShortLinks = adminStats?.total_short_links ?? 0
    const totalClicks = adminStats?.total_clicks ?? 0
    const linkAktif = adminStats?.active_short_links ?? 0
    const linkNonaktif = totalShortLinks - linkAktif
    const rataRataKlik =
      totalShortLinks > 0
        ? (totalClicks / totalShortLinks).toFixed(1)
        : '0'

    // ============ BARIS 1 — RINGKASAN UTAMA ============
    statCards.push(
      {
        label: 'Total User',
        value: adminStats?.total_users ?? 0,
        icon: Users,
        color: 'blue',
      },
      {
        label: 'Total Short Link',
        value: totalShortLinks,
        icon: Link2,
        color: 'indigo',
      },
      {
        label: 'Total Klik',
        value: totalClicks,
        icon: MousePointerClick,
        color: 'orange',
      },
      {
        label: 'QR di-scan',
        value: qrScans ?? 0,
        icon: QrCode,
        color: 'red',
      }
    )

    // ============ BARIS 2 — USER & LINK HUB ============
    statCards.push(
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
        label: 'Link Aktif',
        value: linkAktif,
        icon: CheckCircle2,
        color: 'green',
      }
    )

    // ============ BARIS 3 — AKTIVITAS & RASIO ============
    statCards.push(
      {
        label: 'Klik Hari Ini',
        value: adminStats?.today_clicks ?? 0,
        icon: Calendar,
        color: 'amber',
      },
      {
        label: 'Klik Bulan Ini',
        value: adminStats?.month_clicks ?? 0,
        icon: TrendingUp,
        color: 'purple',
      },
      {
        label: 'Rata-rata Klik',
        value: rataRataKlik,
        icon: MousePointerClick,
        color: 'slate',
      },
      {
        label: 'Link Nonaktif',
        value: linkNonaktif,
        icon: XCircle,
        color: 'rose',
      }
    )
  } else {
    // ============ USER BIASA ============
    statCards.push(
      {
        label: 'Total Short Link',
        value: shortLinks.length,
        icon: Link2,
        color: 'indigo',
      },
      {
        label: 'Total Klik',
        value: totalClicks,
        icon: MousePointerClick,
        color: 'orange',
      },
      {
        label: 'Link Aktif',
        value: activeLinks,
        icon: CheckCircle2,
        color: 'green',
      },
      {
        label: 'Klik Hari Ini',
        value: todayClicks,
        icon: Calendar,
        color: 'cyan',
      },
      {
        label: 'Klik Bulan Ini',
        value: monthClicks,
        icon: TrendingUp,
        color: 'pink',
      }
    )
  }

  // ============ DATA UNTUK CHART ============
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
    <div className="st">

      <div className="st__header">
        <div>
          <h1 className="st__title">Statistik</h1>
          <p className="st__subtitle">
            {isAdmin
              ? 'Ringkasan penggunaan sistem PENINK'
              : 'Ringkasan penggunaan short link kamu'}
          </p>
        </div>
      </div>

      <div className="st__stats">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className={`st-stat st-stat--${card.color}`}
            >
              <div className="st-stat__icon">
                <Icon size={20} />
              </div>
              <div className="st-stat__body">
                <span className="st-stat__label">{card.label}</span>
                <span className="st-stat__value">{card.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {!isAdmin && (
        <div className="st__info">
          <div className="st__info-icon">
            <TrendingUp size={22} />
          </div>
          <div className="st__info-body">
            <strong>Ringkasan Akun</strong>
            <p>
              Akun:{' '}
              <b>
                {user?.user_type} •{' '}
                {user?.unit_kerja?.nama_unit_kerja || '-'}
              </b>
            </p>
            <p>
              Anda memiliki <b>{activeLinks}</b> short link aktif
              dengan total <b>{totalClicks}</b> klik.
            </p>
          </div>
        </div>
      )}

      {/* ============ CHART 1: KLIK PER HARI ============ */}
      <div className="st__chart-card">
        <div className="st__chart-header">
          <div>
            <h3 className="st__chart-title">
              {isAdmin
                ? `Klik Sistem ${statsDays} Hari Terakhir`
                : `Klik ${statsDays} Hari Terakhir`}
            </h3>
            <p className="st__chart-subtitle">
              Total klik short link per hari
            </p>
          </div>

          <div className="st__filter">
            <button
              type="button"
              className={`st__filter-btn ${
                statsDays === 7 ? 'st__filter-btn--active' : ''
              }`}
              onClick={() => setStatsDays(7)}
            >
              7 Hari
            </button>
            <button
              type="button"
              className={`st__filter-btn ${
                statsDays === 30 ? 'st__filter-btn--active' : ''
              }`}
              onClick={() => setStatsDays(30)}
            >
              30 Hari
            </button>
          </div>
        </div>

        <div className="st__chart-body">
          {statsData && statsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={statsData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="stGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
                    fontSize: '13px',
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total_clicks"
                  name="Total Klik"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="st__empty">
              Belum ada data klik untuk periode ini.
            </div>
          )}
        </div>
      </div>

      {/* ============ CHART 2: PENGGUNA BERDASARKAN JENIS ============ */}
      {isAdmin && (
        <div className="st__chart-card">
          <div className="st__chart-header">
            <div>
              <h3 className="st__chart-title">
                Pengguna Berdasarkan Jenis
              </h3>
              <p className="st__chart-subtitle">
                Perbandingan user ASN dan Umum
              </p>
            </div>
          </div>

          <div className="st__chart-body">
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
      )}

      {/* ============ CHART 3: SHORT LINK PER UNIT KERJA ============ */}
      {isAdmin && (
        <div className="st__chart-card">
          <div className="st__chart-header">
            <div>
              <h3 className="st__chart-title">
                Short Link Berdasarkan Unit Kerja
              </h3>
              <p className="st__chart-subtitle">
                Distribusi short link per unit kerja
              </p>
            </div>
          </div>

          <div className="st__chart-body">
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
              <div className="st__empty">
                Data unit kerja belum tersedia.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Statistik