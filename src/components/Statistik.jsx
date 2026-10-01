import {
  Users,
  Link2,
  MousePointerClick,
  CheckCircle2,
  Calendar,
  TrendingUp,
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import './Statistik.css'

function Statistik({
  isAdmin,
  adminStats,
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
    statCards.push({
      label: 'Total Pengguna',
      value: adminStats?.total_users ?? 0,
      icon: Users,
      color: 'blue',
    })
  }

  statCards.push(
    {
      label: 'Total Link',
      value: isAdmin
        ? adminStats?.total_short_links ?? 0
        : shortLinks.length,
      icon: Link2,
      color: 'indigo',
    },
    {
      label: 'Total Klik',
      value: isAdmin ? adminStats?.total_clicks ?? 0 : totalClicks,
      icon: MousePointerClick,
      color: 'orange',
    },
    {
      label: 'Link Aktif',
      value: isAdmin
        ? adminStats?.active_short_links ?? 0
        : activeLinks,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      label: 'Klik Hari Ini',
      value: isAdmin
        ? adminStats?.today_clicks ?? 0
        : todayClicks,
      icon: Calendar,
      color: 'cyan',
    },
    {
      label: 'Klik Bulan Ini',
      value: isAdmin
        ? adminStats?.month_clicks ?? 0
        : monthClicks,
      icon: TrendingUp,
      color: 'pink',
    }
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
    </div>
  )
}

export default Statistik