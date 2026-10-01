import { useState, useEffect } from 'react'

import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line
} from 'recharts'


import { QRCodeCanvas } from 'qrcode.react'
import Login from './Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ShortLink from './components/ShortLink'
import LinkHub from './components/LinkHub'
import Statistik from './components/Statistik'
import Users from './components/Users'
import Feedback from './components/Feedback'
import Profile from './components/Profile'
import './App.css'

function App() {

  const API_URL = 'http://127.0.0.1:8000'


  // =====================================================
  // PUBLIC LINK HUB
  // =====================================================

  const [publicHub, setPublicHub] = useState(null)
  const [publicHubLoading, setPublicHubLoading] = useState(true)
  const [publicHubError, setPublicHubError] = useState('')

  const pathParts =
  window.location.pathname
    .split('/')
    .filter(Boolean)
    
  const isPublicHub =
  pathParts.length === 1 &&
  pathParts[0] !== 'login' &&
  pathParts[0] !== 'register'


  // =====================================================
  // STATE
  // =====================================================

  const [activePage, setActivePage] = useState('dashboard')
  const [showProfile, setShowProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [feedbackType, setFeedbackType] = useState('saran')
  const [feedbackTitle, setFeedbackTitle] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const [feedbacks, setFeedbacks] = useState([])
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState('')
  const [feedbackError, setFeedbackError] = useState('')

  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [showUserPassword, setShowUserPassword] = useState(false)
  const [showEditUserPassword, setShowEditUserPassword] = useState(false)

  const getFeedbackBadge = (type) => {
  const badges = {
    saran: {
      label: 'Saran',
      background: '#dcfce7',
      color: '#15803d',
    },
    masukan: {
      label: 'Masukan',
      background: '#ffedd5',
      color: '#c2410c',
    },
    kendala: {
      label: 'Kendala',
      background: '#dbeafe',
      color: '#1d4ed8',
    },
    lainnya: {
      label: 'Lainnya',
      background: '#f1f5f9',
      color: '#475569',
    },
  }

  return badges[type] || badges.lainnya
}

  const [user, setUser] =
    useState(null)



  const [checkingLogin, setCheckingLogin] =
    useState(true)

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const isAdmin =
    String(user?.role || '').toLowerCase() === 'admin'
    console.log('USER LOGIN:', user)
    console.log('ROLE USER:', user?.role)
    console.log('IS ADMIN:', isAdmin)

    const [showUnitKerjaForm, setShowUnitKerjaForm] =
    useState(false)
    
    const [selectedUnitKerja, setSelectedUnitKerja] =
    useState('')
    
    const [unitKerjaOptions, setUnitKerjaOptions] =
    useState([])
    
    const [unitKerjaLoading, setUnitKerjaLoading] =
    useState(false)
    
    const [unitKerjaSaving, setUnitKerjaSaving] =
    useState(false)
    
    const [unitKerjaError, setUnitKerjaError] =
    useState('')


  // =====================================================
  // SHORT LINK
  // =====================================================

  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [title, setTitle] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const [shortLinks, setShortLinks] = useState([])

  const [statsData, setStatsData] = useState([])

  const [statsDays, setStatsDays] = useState(7)
  const [todayClicks, setTodayClicks] = useState(0)
  const [monthClicks, setMonthClicks] = useState(0)



  // =====================================================
  // EDIT SHORT LINK
  // =====================================================

  const [editingShortLink, setEditingShortLink] =
    useState(null)

  const [editShortLinkForm, setEditShortLinkForm] = useState({
    original_url: '',
    short_code: '',
    title: '',
  })

  const [editShortLinkLoading, setEditShortLinkLoading] =
    useState(false)

  const [editShortLinkError, setEditShortLinkError] =
    useState('')


  // =====================================================
  // DATA USER ADMIN
  // =====================================================

  const [adminUsers, setAdminUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')

  const [unitKerjas, setUnitKerjas] =
    useState([])


  // =====================================================
  // STATISTIK ADMIN
  // =====================================================

  const [adminStats, setAdminStats] =
    useState(null)
  
  const [qrScans, setQrScans] = useState(0);


  // =====================================================
  // FORM TAMBAH USER
  // =====================================================

  const [showAddUserForm, setShowAddUserForm] =
    useState(false)

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'UMUM',
    role: 'user',
    unit_kerja_id: '',
  })

  const [userFormLoading, setUserFormLoading] =
    useState(false)

  const [userFormError, setUserFormError] =
    useState('')


  // =====================================================
  // FORM EDIT USER
  // =====================================================

  const [showEditUserForm, setShowEditUserForm] =
    useState(false)

  const [editingUserId, setEditingUserId] =
    useState(null)

  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'UMUM',
    role: 'USER',
    unit_kerja_id: '',
  })

  const [editUserLoading, setEditUserLoading] =
    useState(false)

  const [editUserError, setEditUserError] =
    useState('')


  // =====================================================
  // LINK HUB
  // =====================================================

  const [linkHubs, setLinkHubs] =
    useState([])

  const [linkHubLoading, setLinkHubLoading] =
    useState(false)

  const [linkHubError, setLinkHubError] =
    useState('')

  const [showLinkHubForm, setShowLinkHubForm] =
    useState(false)

  const [linkHubForm, setLinkHubForm] = useState({
    title: '',
    description: '',
    short_code: '',
  })

  const [editingLinkHub, setEditingLinkHub] = useState(null)
  const [editLinkHubForm, setEditLinkHubForm] = useState({
    title: '',
    description: '',
    short_code: '',
  })

  const [editLinkHubLoading, setEditLinkHubLoading] = useState(false)
  const [editLinkHubError, setEditLinkHubError] = useState('')

  const [selectedHub, setSelectedHub] = useState(null)
  const [showHubQr, setShowHubQr] = useState(false)

  const [linkItemForm, setLinkItemForm] = useState({
    title: '',
    url: '',
  })

  const [editingLinkItem, setEditingLinkItem] = useState(null)

  const [linkItemLoading, setLinkItemLoading] =
    useState(false)

  const [linkItemError, setLinkItemError] =
    useState('')


  // =====================================================
  // PUBLIC LINK HUB
  // =====================================================

  useEffect(() => {

    if (!isPublicHub) {

      setPublicHubLoading(false)

      return

    }

    const path =
      window.location.pathname

    const shortCode =
      path
        .replace(/^\/+/, '')
        .replace(/\/$/, '')

    if (!shortCode) {

      setPublicHubError(
        'Link Hub tidak ditemukan.'
      )

      setPublicHubLoading(false)

      return

    }

    fetch(
      `${API_URL}/api/public/link-hubs/${shortCode}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Link Hub tidak ditemukan atau tidak aktif.'
          )

        }

        return response.json()

      })
      .then((result) => {

        setPublicHub(result.data)

        setPublicHubLoading(false)

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil Link Hub:',
          error
        )

        setPublicHubError(
          error.message
        )

        setPublicHubLoading(false)

      })

  }, [isPublicHub])


  // =====================================================
  // CEK LOGIN
  // =====================================================

  useEffect(() => {

    if (isPublicHub) {

      setCheckingLogin(false)

      return

    }

    const token =
      localStorage.getItem('token')

    if (!token) {

      setCheckingLogin(false)

      return

    }

    fetch(`${API_URL}/api/user`, {

      method: 'GET',

      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },

    })
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Token tidak valid'
          )

        }

        return response.json()

      })
      .then((result) => {

        setUser(result)

      })
      .catch(() => {

        localStorage.removeItem('token')

        setUser(null)

      })
      .finally(() => {

        setCheckingLogin(false)

      })

  }, [isPublicHub])


  // =====================================================
  // AMBIL DATA SHORT LINK
  // =====================================================

  useEffect(() => {

    if (!user) return

    const token =
      localStorage.getItem('token')

    if (!token) return

    fetch(

      isAdmin
      ? `${API_URL}/api/admin/short-links`
      : `${API_URL}/api/short-links`,

      {

        method: 'GET',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

      }

    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Gagal mengambil data short link'
          )

        }

        return response.json()

      })
      .then((result) => {

        setShortLinks(
          result.data || []
        )

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil data:',
          error
        )

      })

  }, [user])


  // =====================================================
  // AMBIL DATA LINK HUB
  // =====================================================

  useEffect(() => {

    if (!user) return

    const token =
      localStorage.getItem('token')

    if (!token) return

    setLinkHubLoading(true)

    fetch(
      `${API_URL}/api/link-hubs`,
      {

        method: 'GET',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

      }
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Gagal mengambil data Link Hub'
          )

        }

        return response.json()

      })
      .then((result) => {

        console.log(
          'DATA LINK HUB:',
          result
        )

        setLinkHubs(
          result.data || []
        )

        setLinkHubError('')

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil data Link Hub:',
          error
        )

        setLinkHubError(
          error.message
        )

      })
      .finally(() => {

        setLinkHubLoading(false)

      })

  }, [user])


  // =====================================================
  // AMBIL DATA STATISTIK
  // =====================================================

  useEffect(() => {

    if (!user) return

    const token =
      localStorage.getItem('token')

    if (!token) return

    fetch(
      `${API_URL}/api/short-links/stats?days=${statsDays}`,
      {

        method: 'GET',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

      }
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Gagal mengambil data statistik'
          )

        }

        return response.json()

      })
      .then((result) => {

        console.log(
          'DATA GRAFIK:',
          result.data
        )

        setStatsData(
          result.data || []
        )

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil statistik:',
          error
        )

      })

  }, [user, statsDays])

  // =====================================================
// AMBIL KLIK HARI INI & BULAN INI
// =====================================================

useEffect(() => {
  if (!user) return

  const token = localStorage.getItem('token')

  if (!token) return

  // Klik hari ini
  fetch(
    `${API_URL}/api/short-links/today-clicks`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((result) => {
      setTodayClicks(
        result.total_clicks_today ?? 0
      )
    })
    .catch((error) => {
      console.error(
        'Gagal mengambil klik hari ini:',
        error
      )
    })

  // Klik bulan ini
  fetch(
    `${API_URL}/api/short-links/month-clicks`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((result) => {
      setMonthClicks(
        result.total_clicks_this_month ?? 0
      )
    })
    .catch((error) => {
      console.error(
        'Gagal mengambil klik bulan ini:',
        error
      )
    })

}, [user])


  // =====================================================
  // AMBIL DATA USER ADMIN
  // =====================================================

  useEffect(() => {

    if (
      !user ||
      !isAdmin
    ) return

    const token =
      localStorage.getItem('token')

    if (!token) return

    fetch(
      `${API_URL}/api/admin/users`,
      {

        method: 'GET',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

      }
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Gagal mengambil data user'
          )

        }

        return response.json()

      })
      .then((result) => {

        setAdminUsers(
          result.data || []
        )

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil data user:',
          error
        )

      })

  }, [user])


  // =====================================================
  // AMBIL DATA UNIT KERJA
  // =====================================================

  useEffect(() => {

    if (
      !user ||
      !isAdmin
    ) return

    const token =
      localStorage.getItem('token')

    if (!token) return

    fetch(
      `${API_URL}/api/admin/unit-kerjas`,
      {

        method: 'GET',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

      }
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Gagal mengambil data unit kerja'
          )

        }

        return response.json()

      })
      .then((result) => {

        setUnitKerjas(
          result.data || []
        )

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil unit kerja:',
          error
        )

      })

 }, [user, isAdmin])


  // =====================================================
  // AMBIL STATISTIK ADMIN
  // =====================================================

  useEffect(() => {

  if (
    !user ||
    !isAdmin
  ) return

  const token =
    localStorage.getItem('token')

    if (!token) return

    fetch(
      `${API_URL}/api/admin/statistics`,
      {

        method: 'GET',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

      }
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Gagal mengambil statistik admin'
          )

        }

        return response.json()

      })
      .then((result) => {

        console.log(
          'STATISTIK ADMIN:',
          result
        )

        setAdminStats(
          result.data || null
        )

        fetch(
          `${API_URL}/api/short-links/qr-scans`,
          {
            method: 'GET',
            
            
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(async (response) => {
          
          if (!response.ok) {
            
            const errorText =
            
            await response.text()
            
            console.error(
              'QR SCAN API ERROR:',
              response.status,
              errorText
            )
            
            throw new Error(
              `Gagal mengambil total QR Scan (${response.status})`
            )
          
          }
          
          return response.json()
        
        })
        .then((result) => {
          
          console.log(
            'TOTAL QR SCAN:',
            result
          )
          
          setQrScans(
            result.total_qr_scans || 0
          )
        
        })
        .catch((error) => {
          console.error(
            'QR SCAN ERROR:',
            error
          )
          
          setQrScans(0)
        
        })

      })
      .catch((error) => {

        console.error(
          'Gagal mengambil statistik admin:',
          error
        )

      })

  }, [user, isAdmin])


  // =====================================================
  // LOGIN BERHASIL
  // =====================================================

  const handleLogin = (loggedInUser) => {

  setUser(loggedInUser)

  // ADMIN tidak perlu memilih unit kerja
   if (
    String(loggedInUser.role || '').toLowerCase() === 'admin'
  ) {
    setShowUnitKerjaForm(false)
    return
  }

  // USER biasa yang belum punya unit kerja
  if (!loggedInUser.unit_kerja_id) {
    setShowUnitKerjaForm(true)
  } else {
    setShowUnitKerjaForm(false)
  }

}

// =====================================================
// SIMPAN UNIT KERJA USER
// =====================================================

const handleSaveUnitKerja = async () => {

  if (!selectedUnitKerja) {
    setUnitKerjaError('Silakan pilih unit kerja terlebih dahulu.')
    return
  }

  try {

    setUnitKerjaSaving(true)
    setUnitKerjaError('')

    const token = localStorage.getItem('token')

    const response = await fetch(
      `${API_URL}/api/user/unit-kerja`,
      {
        method: 'PUT',

        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },

        body: JSON.stringify({
          unit_kerja_id: selectedUnitKerja,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Gagal menyimpan unit kerja.'
      )
    }

    // Update data user
    setUser(result.user)

    // Tutup form unit kerja
    setShowUnitKerjaForm(false)

    // Bersihkan pilihan
    setSelectedUnitKerja('')

  } catch (error) {

    console.error(
      'Gagal menyimpan unit kerja:',
      error
    )

    setUnitKerjaError(
      error.message
    )

  } finally {

    setUnitKerjaSaving(false)

  }
}


  const handleSubmitFeedback = async (e) => {
  e.preventDefault()

  if (!feedbackTitle.trim()) {
  setFeedbackError('Judul masukan wajib diisi.')

  setTimeout(() => {
    setFeedbackError('')
  }, 4000)

  return
}

  if (!feedbackMessage.trim()) {
  setFeedbackError('Saran atau masukan wajib diisi.')

  setTimeout(() => {
    setFeedbackError('')
  }, 4000)

  return
}

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `${API_URL}/api/feedbacks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          title: feedbackTitle,
          message: feedbackMessage,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {

      console.error('FEEDBACK ERROR:', result)
      
      const errorMessage = result.errors
      ? Object.values(result.errors)[0]?.[0]
      : result.message

      setFeedbackError(
        errorMessage || 'Gagal mengirim masukan.'
      )

      setTimeout(() => {
        setFeedbackError('')
      }, 4000)

      return
    }

    setFeedbackSuccess('Saran dan masukan berhasil dikirim.')

    setFeedbackTitle('')
    setFeedbackMessage('')
    setFeedbackType('saran')

    setTimeout(() => {
      setFeedbackSuccess('')
    }, 4000)

  } catch (error) {
  console.error('FEEDBACK ERROR:', error)

  setFeedbackError(
    'Tidak dapat terhubung ke server.'
  )

  setTimeout(() => {
    setFeedbackError('')
  }, 4000)
}
}

// =====================================================
// AMBIL DAFTAR UNIT KERJA UNTUK USER
// =====================================================

useEffect(() => {

  if (!showUnitKerjaForm) return

  setUnitKerjaLoading(true)
  setUnitKerjaError('')

  fetch(`${API_URL}/api/unit-kerjas`)
    .then((response) => {

      if (!response.ok) {
        throw new Error(
          'Gagal mengambil daftar unit kerja.'
        )
      }

      return response.json()

    })
    .then((result) => {

      setUnitKerjaOptions(
        result.data || []
      )

    })
    .catch((error) => {

      console.error(
        'Gagal mengambil unit kerja:',
        error
      )

      setUnitKerjaError(
        error.message
      )

    })
    .finally(() => {

      setUnitKerjaLoading(false)

    })

}, [showUnitKerjaForm])


// =====================================================
// AMBIL DATA SARAN & MASUKAN UNTUK ADMIN
// =====================================================

const handleLoadFeedbacks = async () => {
  try {
    setFeedbackLoading(true)

    const token = localStorage.getItem('token')

    const response = await fetch(
      `${API_URL}/api/admin/feedbacks`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      console.error(
        'FEEDBACK LIST ERROR:',
        result
      )

      alert(
        result.message ||
        'Gagal mengambil saran dan masukan.'
      )

      return
    }

    console.log('DATA FEEDBACK DARI API:', result)

    setFeedbacks(result.data || [])
    console.log('FEEDBACKS SETELAH API:', result.data)
    setActivePage('feedback-list')

  } catch (error) {
    console.error(
      'FEEDBACK LIST ERROR:',
      error
    )

    alert(
      'Tidak dapat terhubung ke server.'
    )

  } finally {
    setFeedbackLoading(false)
  }
}

const handleDeleteFeedback = async (feedback) => {
  const yakin = window.confirm(
    `Yakin ingin menghapus masukan "${feedback.title}"?`
  )

  if (!yakin) return

  const token = localStorage.getItem('token')

  if (!token) {
    alert('Sesi login tidak ditemukan.')
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/admin/feedbacks/${feedback.id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || 'Gagal menghapus masukan.'
      )
    }

    // Hapus dari state
    setFeedbacks((prev) =>
      prev.filter((item) => item.id !== feedback.id)
    )

    // Tutup modal kalau sedang buka feedback ini
    if (selectedFeedback?.id === feedback.id) {
      setSelectedFeedback(null)
    }

    alert('Saran & masukan berhasil dihapus.')
  } catch (error) {
    console.error('DELETE FEEDBACK ERROR:', error)
    alert(error.message)
  }
}


  const toggleLinkHubStatus = async (hub) => {
    
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Sesi login tidak ditemukan. Silakan login kembali.')
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/link-hubs/${hub.id}/status`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Gagal mengubah status Link Hub.'
      )
    }

    // UPDATE DAFTAR LINK HUB
    setLinkHubs((prevHubs) =>
      prevHubs.map((item) =>
        item.id === hub.id
          ? {
              ...item,
              ...result.data,
            }
          : item
      )
    )

    // UPDATE SELECTED HUB JIKA SEDANG DIBUKA
    setSelectedHub((prev) => {
      if (!prev || prev.id !== hub.id) {
        return prev
      }

      return {
        ...prev,
        ...result.data,
      }
    })

    alert(result.message)

  } catch (error) {
    console.error(
      'Gagal mengubah status Link Hub:',
      error
    )

    alert(
      error.message ||
      'Gagal mengubah status Link Hub.'
    )
  }
}

const handleDeleteLinkHub = async (hub) => {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Sesi login tidak ditemukan. Silakan login kembali.')
    return
  }

  const yakin = window.confirm(
    `Yakin ingin menghapus Link Hub "${hub.title}"?`
  )

  if (!yakin) {
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/link-hubs/${hub.id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Gagal menghapus Link Hub.'
      )
    }

    // Hapus dari daftar Link Hub
    setLinkHubs((prevHubs) =>
      prevHubs.filter(
        (item) => item.id !== hub.id
      )
    )

    // Kalau sedang dibuka, tutup
    if (
      selectedHub &&
      selectedHub.id === hub.id
    ) {
      setSelectedHub(null)
    }

    // Tutup form edit kalau sedang mengedit Hub ini
    if (
      editingLinkHub &&
      editingLinkHub.id === hub.id
    ) {
      setEditingLinkHub(null)

      setEditLinkHubForm({
        title: '',
        description: '',
        short_code: '',
      })

      setEditLinkHubError('')
    }

    // Tutup QR kalau sedang terbuka
    if (
      showHubQr &&
      showHubQr.id === hub.id
    ) {
      setShowHubQr(false)
    }

    alert(
      result.message ||
      'Link Hub berhasil dihapus.'
    )

  } catch (error) {
    console.error(
      'Gagal menghapus Link Hub:',
      error
    )

    alert(
      error.message ||
      'Gagal menghapus Link Hub.'
    )
  }
}

  const startEditLinkHub = (hub) => {
    
    console.log('HUB YANG DIEDIT:', hub)

    setEditingLinkHub({
      id: hub.id,
      title: hub.title || '',
      description: hub.description || '',
      short_code: hub.short_code || '',
    })

    setEditLinkHubForm({
      title: hub.title || '',
      description: hub.description || '',
      short_code: hub.short_code || '',
    })

    setEditLinkHubError('')
  }

  const handleUpdateLinkHub = async () => {
    console.log('=== MULAI UPDATE LINK HUB ===')
    console.log('Editing Link Hub:', editingLinkHub)
    console.log('Form:', editLinkHubForm)

    if (!editingLinkHub) {
      setEditLinkHubError(
        'Link Hub yang sedang diedit tidak ditemukan.'
      )
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setEditLinkHubError(
        'Sesi login tidak ditemukan. Silakan login kembali.'
      )
      return
    }

    const titleValue = editLinkHubForm.title.trim()
    const descriptionValue = editLinkHubForm.description.trim()
    const shortCodeValue = editLinkHubForm.short_code.trim()

    if (!titleValue) {
      setEditLinkHubError('Judul Link Hub wajib diisi.')
      return
    }

    if (!shortCodeValue) {
      setEditLinkHubError('Alias Link Hub wajib diisi.')
      return
    }

    try {
      setEditLinkHubLoading(true)
      setEditLinkHubError('')

      const updateUrl = `${API_URL}/api/link-hubs/${editingLinkHub.id}`

      console.log('UPDATE URL:', updateUrl)

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: titleValue,
          description: descriptionValue,
          short_code: shortCodeValue,
        }),
      })

      console.log('STATUS RESPONSE:', response.status)

      const responseText = await response.text()
      let result = {}

      try {
        result = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        console.error(
          'Response bukan JSON:',
          responseText
        )
        throw new Error(
          `Server mengembalikan response yang tidak valid (HTTP ${response.status}).`
        )
      }

      console.log('HASIL UPDATE LINK HUB:', result)

      if (!response.ok) {
        const validationMessage = result.errors
          ? Object.values(result.errors)
              .flat()
              .join(' ')
          : ''

        throw new Error(
          validationMessage ||
            result.message ||
            `Gagal memperbarui Link Hub (HTTP ${response.status}).`
        )
      }

      if (!result.data) {
        throw new Error(
          'Server berhasil merespons, tetapi data Link Hub tidak ditemukan.'
        )
      }

      // UPDATE DAFTAR LINK HUB
      setLinkHubs((prevHubs) =>
        prevHubs.map((hub) =>
          hub.id === editingLinkHub.id
            ? {
                ...hub,
                ...result.data,
              }
            : hub
        )
      )

      // UPDATE SELECTED HUB JIKA SEDANG DIPILIH
      setSelectedHub((prev) => {
        if (!prev || prev.id !== editingLinkHub.id) {
          return prev
        }

        return {
          ...prev,
          ...result.data,
        }
      })

      // TUTUP FORM EDIT
      setEditingLinkHub(null)

      setEditLinkHubForm({
        title: '',
        description: '',
        short_code: '',
      })

      setEditLinkHubError('')

      alert('Link Hub berhasil diperbarui.')
    } catch (error) {
      console.error('GAGAL UPDATE LINK HUB:', error)

      setEditLinkHubError(
        error.message || 'Gagal memperbarui Link Hub.'
      )
    } finally {
      setEditLinkHubLoading(false)
    }
  }

  // =====================================================
  // CREATE LINK HUB
  // =====================================================

  const createLinkHub = async (e) => {

    e.preventDefault()

    const token =
      localStorage.getItem('token')

    if (!token) {

      setLinkHubError(
        'Token login tidak ditemukan.'
      )

      return

    }

    if (!linkHubForm.title) {

      setLinkHubError(
        'Judul Link Hub wajib diisi.'
      )

      return

    }

    if (!linkHubForm.short_code) {

      setLinkHubError(
        'Alias Link Hub wajib diisi.'
      )

      return

    }

    try {

      setLinkHubLoading(true)

      setLinkHubError('')

      const response =
        await fetch(
          `${API_URL}/api/link-hubs`,
          {

            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({

                title:
                  linkHubForm.title,

                description:
                  linkHubForm.description,

                short_code:
                  linkHubForm.short_code,

              }),

          }
        )

      const result =
        await response.json()

      if (!response.ok) {

        const validationMessage =
          result.errors
            ? Object.values(
                result.errors
              )
                .flat()
                .join(' ')
            : ''

        throw new Error(

          validationMessage ||

          result.message ||

          'Gagal membuat Link Hub.'

        )

      }

      console.log(
        'LINK HUB BERHASIL DIBUAT:',
        result
      )

      setLinkHubs(
        (prev) => [
          result.data,
          ...prev,
        ]
      )

      setLinkHubForm({

        title: '',
        description: '',
        short_code: '',

      })

      setShowLinkHubForm(false)

      setLinkHubError('')

      alert(
        'Link Hub berhasil dibuat.'
      )

    } catch (error) {

      console.error(
        'Gagal membuat Link Hub:',
        error
      )

      setLinkHubError(
        error.message
      )

    } finally {

      setLinkHubLoading(false)

    }

  }


  // =====================================================
  // ADD LINK ITEM KE LINK HUB
  // =====================================================

  const addLinkItem = async (e) => {

    e.preventDefault()

    const token =
      localStorage.getItem('token')

    if (!token) {

      setLinkItemError(
        'Token login tidak ditemukan.'
      )

      return

    }

    if (!selectedHub) {

      setLinkItemError(
        'Link Hub belum dipilih.'
      )

      return

    }

    if (!linkItemForm.title) {

      setLinkItemError(
        'Judul link wajib diisi.'
      )

      return

    }

    if (!linkItemForm.url) {

      setLinkItemError(
        'URL wajib diisi.'
      )

      return

    }

    try {

      setLinkItemLoading(true)

      setLinkItemError('')

      const response =
        await fetch(

          `${API_URL}/api/link-hubs/${selectedHub.id}/items`,

          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json',

              Accept:
                'application/json',

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify({

                title:
                  linkItemForm.title,

                url:
                  linkItemForm.url,

              }),

          }

        )

      const result =
        await response.json()

      if (!response.ok) {

        const validationMessage =
          result.errors
            ? Object.values(
                result.errors
              )
                .flat()
                .join(' ')
            : ''

        throw new Error(

          validationMessage ||

          result.message ||

          'Gagal menambahkan link.'

        )

      }

      console.log(
        'LINK BERHASIL DITAMBAHKAN:',
        result
      )


      const newItem =
        result.data


      // UPDATE SELECTED HUB

      setSelectedHub(
        (prev) => {

          if (!prev) return prev

          return {

            ...prev,

            items: [
              ...(prev.items || []),
              newItem,
            ],

          }

        }
      )


      // UPDATE DAFTAR LINK HUB

      setLinkHubs(
        (prev) =>

          prev.map(
            (hub) =>

              hub.id ===
              selectedHub.id

                ? {

                    ...hub,

                    items: [
                      ...(hub.items || []),
                      newItem,
                    ],

                  }

                : hub

          )
      )


      // RESET FORM

      setLinkItemForm({

        title: '',
        url: '',

      })

      setLinkItemError('')

      alert(
        'Link berhasil ditambahkan.'
      )

    } catch (error) {

      console.error(
        'Gagal menambahkan link:',
        error
      )

      setLinkItemError(
        error.message
      )

    } finally {

      setLinkItemLoading(false)

    }

  }

  // =====================================================
// TOGGLE STATUS LINK ITEM
// =====================================================

const toggleLinkItemStatus = async (hubId, itemId) => {

  const token = localStorage.getItem('token')

  if (!token) {
    alert('Silakan login terlebih dahulu.')
    return
  }

  try {

    const response = await fetch(
      `${API_URL}/api/link-hubs/${hubId}/items/${itemId}/status`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Gagal mengubah status link.'
      )
    }

    const updatedItem = result.data

    // UPDATE DAFTAR LINK HUB
    setLinkHubs((prev) =>
      prev.map((hub) =>
        hub.id === hubId
          ? {
              ...hub,
              items: (hub.items || []).map((item) =>
                item.id === itemId
                  ? updatedItem
                  : item
              ),
            }
          : hub
      )
    )

    // UPDATE LINK HUB YANG SEDANG DIBUKA
    setSelectedHub((prev) =>
      prev
        ? {
            ...prev,
            items: (prev.items || []).map((item) =>
              item.id === itemId
                ? updatedItem
                : item
            ),
          }
        : prev
    )

    alert(
      updatedItem.status
        ? 'Link berhasil diaktifkan.'
        : 'Link berhasil dinonaktifkan.'
    )

  } catch (error) {

    console.error(
      'Gagal mengubah status link:',
      error
    )

    alert(
      error.message ||
      'Gagal mengubah status link.'
    )
  }
}

// =====================================================
// EDIT LINK ITEM
// =====================================================

const editLinkItem = async (e, hubId, itemId) => {
  
  e.preventDefault()

  const token = localStorage.getItem('token')

  if (!token) {
    alert('Silakan login terlebih dahulu.')
    return
  }

  try {

    const response = await fetch(
      `${API_URL}/api/link-hubs/${hubId}/items/${itemId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: linkItemForm.title,
          url: linkItemForm.url,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {

      const validationMessage = result.errors
        ? Object.values(result.errors)
            .flat()
            .join(' ')
        : ''

      throw new Error(
        validationMessage ||
        result.message ||
        'Gagal memperbarui link.'
      )
    }

    const updatedItem = result.data

    setLinkHubs((prev) =>
      prev.map((hub) =>
        hub.id === hubId
          ? {
              ...hub,
              items: (hub.items || []).map((item) =>
                item.id === itemId
                  ? updatedItem
                  : item
              ),
            }
          : hub
      )
    )

    setSelectedHub((prev) =>
      prev
        ? {
            ...prev,
            items: (prev.items || []).map((item) =>
              item.id === itemId
                ? updatedItem
                : item
            ),
          }
        : prev
    )

    setEditingLinkItem(null)

    setLinkItemForm({
      title: '',
      url: '',
    })

    alert('Link berhasil diperbarui.')

  } catch (error) {

    console.error(
      'Gagal memperbarui link:',
      error
    )

    alert(
      error.message ||
      'Gagal memperbarui link.'
    )
  }
}

const moveLinkItem = async (hubId, itemId, direction) => {

  const token = localStorage.getItem('token')

  if (!token) {
    alert('Silakan login terlebih dahulu.')
    return
  }

  try {

    const hub = linkHubs.find(
      (hub) => hub.id === hubId
    )

    if (!hub || !hub.items) {
      return
    }

    const items = [...hub.items].sort(
      (a, b) => a.sort_order - b.sort_order
    )

    const currentIndex = items.findIndex(
      (item) => item.id === itemId
    )

    if (currentIndex === -1) {
      return
    }

    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return
    }

    const currentItem = items[currentIndex]
    const targetItem = items[targetIndex]

    const currentOrder = currentItem.sort_order
    const targetOrder = targetItem.sort_order

    // Tukar posisi di backend
    const response1 = await fetch(
      `${API_URL}/api/link-hubs/${hubId}/items/${currentItem.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: currentItem.title,
          url: currentItem.url,
          sort_order: targetOrder,
        }),
      }
    )

    const response2 = await fetch(
      `${API_URL}/api/link-hubs/${hubId}/items/${targetItem.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: targetItem.title,
          url: targetItem.url,
          sort_order: currentOrder,
        }),
      }
    )

    const result1 = await response1.json()
    const result2 = await response2.json()

    if (!response1.ok || !response2.ok) {
      throw new Error(
        result1.message ||
        result2.message ||
        'Gagal mengubah urutan link.'
      )
    }

    const updatedCurrentItem = result1.data
    const updatedTargetItem = result2.data

    const newItems = items.map((item) => {

      if (item.id === updatedCurrentItem.id) {
        return updatedCurrentItem
      }

      if (item.id === updatedTargetItem.id) {
        return updatedTargetItem
      }

      return item
    })

    setLinkHubs((prev) =>
      prev.map((hub) =>
        hub.id === hubId
          ? {
              ...hub,
              items: newItems,
            }
          : hub
      )
    )

    setSelectedHub((prev) =>
      prev && prev.id === hubId
        ? {
            ...prev,
            items: newItems,
          }
        : prev
    )

  } catch (error) {

    console.error(
      'Gagal mengubah urutan link:',
      error
    )

    alert(
      error.message ||
      'Gagal mengubah urutan link.'
    )
  }
}


// ========================================
// DELETE LINK ITEM
// ========================================

const deleteLinkItem = async (hubId, itemId) => {

  const token = localStorage.getItem('token')

  if (!token) {
    alert('Silakan login terlebih dahulu.')
    return
  }

  const yakin = window.confirm(
    'Apakah Anda yakin ingin menghapus link ini?'
  )

  if (!yakin) {
    return
  }

  try {

    const response = await fetch(
      `${API_URL}/api/link-hubs/${hubId}/items/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Gagal menghapus link.'
      )
    }

    setLinkHubs((prev) =>
      prev.map((hub) =>
        hub.id === hubId
          ? {
              ...hub,
              items: (hub.items || []).filter(
                (item) => item.id !== itemId
              ),
            }
          : hub
      )
    )

    setSelectedHub((prev) =>
      prev
        ? {
            ...prev,
            items: (prev.items || []).filter(
              (item) => item.id !== itemId
            ),
          }
        : prev
    )

    setEditingLinkItem(null)

    setLinkItemForm({
      title: '',
      url: '',
    })

    alert('Link berhasil dihapus.')

  } catch (error) {

    console.error(
      'Gagal menghapus link:',
      error
    )

    alert(
      error.message ||
      'Gagal menghapus link.'
    )
  }
}


  // =====================================================
  // LOGOUT
  // =====================================================


  const handleLogout = async () => {

  const token =
    localStorage.getItem('token')

  try {

    if (token) {

      await fetch(
        `${API_URL}/api/logout`,
        {

          method: 'POST',

          headers: {

            Accept:
              'application/json',

            Authorization:
              `Bearer ${token}`,

          },

        }
      )

    }

  } catch (error) {

    console.error(
      'Logout error:',
      error
    )

  }


 

    localStorage.removeItem('token')
    
    setUser(null)

    setShortLinks([])

    setAdminUsers([])

    setUnitKerjas([])

    setLinkHubs([])

    setSelectedHub(null)

    setShortUrl('')

    setShowAddUserForm(false)

    setShowEditUserForm(false)

    setShowLinkHubForm(false)

    setEditingUserId(null)

  }

  // =====================================================
// UBAH PASSWORD
// =====================================================

const handleChangePassword = async () => {

  

  // Validasi password lama
  if (!currentPassword) {
    alert('Password lama wajib diisi.')
    return
  }

  // Validasi password baru
  if (!newPassword) {
    alert('Password baru wajib diisi.')
    return
  }

  if (newPassword.length < 8) {
    alert('Password baru minimal 8 karakter.')
    return
  }

  // Validasi konfirmasi password
  if (!confirmNewPassword) {
    alert('Konfirmasi password wajib diisi.')
    return
  }

  if (newPassword !== confirmNewPassword) {
    alert('Konfirmasi password tidak sama.')
    return
  }

  try {

    const token =
      localStorage.getItem('token')

    if (!token) {
      alert('Sesi login tidak ditemukan.')
      return
    }

    const response =
      await fetch(
        `${API_URL}/api/profile/password`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify({
              current_password:
                currentPassword,

              password:
                newPassword,

              password_confirmation:
                confirmNewPassword,
            }),
        }
      )

    const result =
      await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Gagal mengubah password.'
      )
    }

    alert(
      'Password berhasil diubah.'
    )

    // Kosongkan form
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')

  } catch (error) {

    alert(
      error.message
    )

  }

}

const handleUpdateProfile = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `${API_URL}/api/profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      if (result.errors?.email) {
        throw new Error('Email tersebut sudah digunakan.')
      }
      throw new Error(
        result.message || 'Gagal memperbarui profil.'
      )
    }

    setUser(result.user)
    setEditingProfile(false)
    alert('Profil berhasil diperbarui.')
  } catch (error) {
    alert(error.message)
  }
}


  // =====================================================
  // TAMBAH USER
  // =====================================================

  const handleAddUser = async (e) => {

    e.preventDefault()

    setUserFormError('')

    setUserFormLoading(true)

    const token =
      localStorage.getItem('token')

    if (!token) {

      setUserFormError(
        'Sesi login tidak ditemukan.'
      )

      setUserFormLoading(false)

      return

    }

    try {

      const response =
        await fetch(
          `${API_URL}/api/admin/users`,
          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json',

              Accept:
                'application/json',

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify({

                name:
                  userForm.name,

                email:
                  userForm.email,

                password:
                  userForm.password,

                user_type:
                  userForm.user_type,

                role:
                  userForm.role,

                unit_kerja_id:
                  userForm.unit_kerja_id
                    ? Number(
                        userForm.unit_kerja_id
                      )
                    : null,

              }),

          }
        )

      const result =
        await response.json()

      if (!response.ok) {

        if (
          response.status === 422 &&
          result.errors
        ) {

          const firstError =
            Object.values(
              result.errors
            )[0]

          if (
            Array.isArray(firstError)
          ) {

            throw new Error(
              firstError[0]
            )

          }

          throw new Error(
            firstError
          )

        }

        throw new Error(

          result.message ||

          'Gagal menambahkan user.'

        )

      }

      setAdminUsers(
        (prevUsers) => [
          result.data,
          ...prevUsers,
        ]
      )

      setUserForm({

        name: '',
        email: '',
        password: '',
        user_type: 'UMUM',
        role: 'USER',
        unit_kerja_id: '',

      })

      setShowAddUserForm(false)

      alert(
        'User berhasil ditambahkan.'
      )

    } catch (error) {

      setUserFormError(
        error.message
      )

    } finally {

      setUserFormLoading(false)

    }

  }


  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEditUser = (adminUser) => {

    setShowAddUserForm(false)

    setUserFormError('')

    setEditingUserId(
      adminUser.id
    )

    setEditUserForm({

      name:
        adminUser.name || '',

      email:
        adminUser.email || '',

      password: '',

      user_type:
        adminUser.user_type ||
        'UMUM',

      role:
        adminUser.role ||
        'USER',

      unit_kerja_id:
        adminUser.unit_kerja_id ||
        '',

    })

    setEditUserError('')

    setShowEditUserForm(true)

  }


  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdateUser = async (e) => {
    e.preventDefault()

    setEditUserError('')
    setEditUserLoading(true)

    console.log(
      'EDIT USER FORM:',
      JSON.stringify(editUserForm, null, 2)
    )

    console.log(
      'ROLE YANG DIKIRIM:',
      editUserForm.role
    )

    console.log(
      'USER TYPE YANG DIKIRIM:',
      editUserForm.user_type
    )

    const token = localStorage.getItem('token')

    if (!token) {
      setEditUserError('Sesi login tidak ditemukan.')
      setEditUserLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${editingUserId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editUserForm.name,
            email: editUserForm.email,
            password: editUserForm.password || null,
            user_type: editUserForm.user_type,
            role: editUserForm.role,
            unit_kerja_id: editUserForm.unit_kerja_id
              ? Number(editUserForm.unit_kerja_id)
              : null,
          }),
        }
      )

      const result = await response.json()

      console.log('DATA UPDATE USER:', result)

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const firstError = Object.values(result.errors)[0]

          if (Array.isArray(firstError)) {
            throw new Error(firstError[0])
          }

          throw new Error(firstError)
        }

        throw new Error(
          result.message || 'Gagal memperbarui user.'
        )
      }

      setAdminUsers((prevUsers) =>
        prevUsers.map((adminUser) =>
          adminUser.id === editingUserId
            ? result.data
            : adminUser
        )
      )

      setEditUserForm({
        name: '',
        email: '',
        password: '',
        user_type: 'UMUM',
        role: 'USER',
        unit_kerja_id: '',
      })

      setShowEditUserForm(false)
      setEditingUserId(null)

      alert('User berhasil diperbarui.')
    } catch (error) {
      setEditUserError(error.message)
    } finally {
      setEditUserLoading(false)
    }
  }

  // =====================================================
  // HAPUS USER
  // =====================================================

  const handleDeleteUser = async (adminUser) => {
    const yakin = window.confirm(
      `Yakin ingin menghapus user "${adminUser.name}"?\n\nAksi ini tidak bisa dibatalkan.`
    )

    if (!yakin) return

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Sesi login tidak ditemukan.')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${adminUser.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal menghapus user.'
        )
      }

      setAdminUsers((prev) =>
        prev.filter((u) => u.id !== adminUser.id)
      )

      alert('User berhasil dihapus.')
    } catch (error) {
      console.error('DELETE USER ERROR:', error)
      alert(error.message)
    }
  }


  // =====================================================
  // MEMBUAT SHORT URL
  // =====================================================

  const shortenUrl = async () => {

    if (!url) {

      alert(
        'Masukkan URL terlebih dahulu'
      )

      return

    }

    const token =
      localStorage.getItem('token')

    if (!token) {

      alert(
        'Silakan login terlebih dahulu'
      )

      return

    }

    setLoading(true)

    try {

      const response =
        await fetch(
          `${API_URL}/api/short-links`,
          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json',

              Accept:
                'application/json',

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify({

                original_url:
                  url,

                short_code:
                  alias || null,

                title:
                  title || null,

              }),

          }
        )

      const result =
        await response.json()

      if (!response.ok) {

        throw new Error(

          result.message ||

          'Gagal membuat short URL'

        )

      }

      setShortUrl(
        `${API_URL}/${result.data.short_code}`
      )

      setShortLinks(
        (prevLinks) => [

          result.data,

          ...prevLinks,

        ]
      )

      setUrl('')

      setAlias('')

      setTitle('')

    } catch (error) {

      alert(
        error.message
      )

    } finally {

      setLoading(false)

    }

  }


  // =====================================================
  // MULAI EDIT SHORT LINK
  // =====================================================

  const startEditShortLink = (link) => {

    setEditingShortLink(link)

    setEditShortLinkForm({

      original_url:
        link.original_url || '',

      short_code:
        link.short_code || '',

      title:
        link.title || '',

    })

    setEditShortLinkError('')

  }


  // =====================================================
  // SIMPAN EDIT SHORT LINK
  // =====================================================

  const handleEditShortLink =
    async (e) => {

      e.preventDefault()

      if (!editingShortLink)
        return

      setEditShortLinkError('')

      setEditShortLinkLoading(true)

      const token =
        localStorage.getItem('token')

      if (!token) {

        setEditShortLinkError(
          'Sesi login tidak ditemukan.'
        )

        setEditShortLinkLoading(false)

        return

      }

      try {

        const response =
          await fetch(

            isAdmin
            ? `${API_URL}/api/admin/short-links/${editingShortLink.id}`
            : `${API_URL}/api/short-links/${editingShortLink.id}`,

            {

              method: 'PUT',

              headers: {

                'Content-Type':
                  'application/json',

                Accept:
                  'application/json',

                Authorization:
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify({

                  original_url:
                    editShortLinkForm.original_url,

                  short_code:
                    editShortLinkForm.short_code,

                  title:
                    editShortLinkForm.title ||
                    null,

                }),

            }

          )

        const result =
          await response.json()

        if (!response.ok) {

          const validationMessage =
            result.errors
              ? Object.values(
                  result.errors
                )
                  .flat()
                  .join(' ')
              : ''

          throw new Error(

            validationMessage ||

            result.message ||

            'Gagal memperbarui short link.'

          )

        }

        setShortLinks(

          (prevLinks) =>

            prevLinks.map(

              (link) =>

                link.id ===
                editingShortLink.id

                  ? result.data

                  : link

            )

        )

        setShortUrl(
          `${API_URL}/${result.data.short_code}`
        )

        setEditingShortLink(null)

        setEditShortLinkForm({

          original_url: '',
          short_code: '',
          title: '',

        })

        alert(
          'Short link berhasil diperbarui.'
        )

      } catch (error) {

        setEditShortLinkError(
          error.message
        )

      } finally {

        setEditShortLinkLoading(false)

      }

    }


  // =====================================================
  // BATAL EDIT SHORT LINK
  // =====================================================

  const cancelEditShortLink = () => {

    setEditingShortLink(null)

    setEditShortLinkError('')

    setEditShortLinkForm({

      original_url: '',
      short_code: '',
      title: '',

    })

  }


  // =====================================================
  // COPY SHORT URL
  // =====================================================

  const copyShortUrl = () => {

    if (!shortUrl) return

    navigator.clipboard
      .writeText(shortUrl)

    alert(
      'Short URL berhasil disalin'
    )

  }


  // =====================================================
  // DOWNLOAD QR
  // =====================================================

  const downloadQR = (id) => {
  const canvas = document.querySelector(`#qr-${id}`)

  if (!canvas) return

  const padding = 20
  const border = 3

  const newCanvas = document.createElement('canvas')
  newCanvas.width = canvas.width + (padding + border) * 2
  newCanvas.height = canvas.height + (padding + border) * 2

  const ctx = newCanvas.getContext('2d')

  ctx.imageSmoothingEnabled = false

  // Background putih
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)

  // Border putih
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = border
  ctx.strokeRect(
    border / 2,
    border / 2,
    newCanvas.width - border,
    newCanvas.height - border
  )

  // Gambar QR
  ctx.drawImage(
    canvas,
    padding + border,
    padding + border,
    canvas.width,
    canvas.height
  )

  const link = document.createElement('a')
  link.download = `QR-Code-${id}.png`
  link.href = newCanvas.toDataURL('image/png', 1.0)
  link.click()
}


  // =====================================================
  // AKTIF / NONAKTIF SHORT LINK
  // =====================================================

  const handleToggleShortLink =
    async (id) => {

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert(
          'Sesi login tidak ditemukan.'
        )

        return

      }

      try {

        const response =
          await fetch(

            isAdmin
            ? `${API_URL}/api/admin/short-links/${id}/status`
            : `${API_URL}/api/short-links/${id}/status`,

            {

              method: 'PATCH',

              headers: {

                Accept:
                  'application/json',

                Authorization:
                  `Bearer ${token}`,

              },

            }

          )

        const result =
          await response.json()

        if (!response.ok) {

          throw new Error(

            result.message ||

            'Gagal mengubah status short link.'

          )

        }

        setShortLinks(

          (prevLinks) =>

            prevLinks.map(

              (link) =>

                link.id === id

                  ? result.data

                  : link

            )

        )

        alert(
          result.message
        )

      } catch (error) {

        alert(
          error.message
        )

      }

    }


  // =====================================================
  // HAPUS SHORT LINK
  // =====================================================

  const handleDeleteShortLink =
    async (id) => {

      const confirmDelete =
        window.confirm(
          'Yakin ingin menghapus short link ini?'
        )

      if (!confirmDelete)
        return

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert(
          'Sesi login tidak ditemukan.'
        )

        return

      }

      try {

        const response =
          await fetch(

            isAdmin
            ? `${API_URL}/api/admin/short-links/${id}`
            : `${API_URL}/api/short-links/${id}`,

            {

              method: 'DELETE',

              headers: {

                Authorization:
                  `Bearer ${token}`,

                Accept:
                  'application/json',

              },

            }

          )

        const result =
          await response.json()

        if (!response.ok) {

          throw new Error(

            result.message ||

            'Gagal menghapus short link.'

          )

        }

        setShortLinks(

          (prevLinks) =>

            prevLinks.filter(

              (link) =>
                link.id !== id

            )

        )

        if (

          shortUrl &&

          shortLinks.some(

            (link) =>

              link.id === id &&

              `${API_URL}/${link.short_code}` ===
                shortUrl

          )

        ) {

          setShortUrl('')

        }

        if (

          editingShortLink &&

          editingShortLink.id === id

        ) {

          cancelEditShortLink()

        }

        alert(
          'Short link berhasil dihapus.'
        )

      } catch (error) {

        alert(
          error.message
        )

      }

    }


  // =====================================================
  // STATISTIK DASAR
  // =====================================================

  const totalClicks =
    shortLinks.reduce(

      (total, link) =>

        total +
        Number(
          link.click_count ?? 0
        ),

      0

    )

  const activeLinks =
    shortLinks.filter(
      (link) =>
        link.status
    ).length

      const filteredUsers = adminUsers.filter((adminUser) => {
    const keyword = userSearch.toLowerCase().trim()

    if (!keyword) {
      return true
    }

    return (
      adminUser.name?.toLowerCase().includes(keyword) ||
      adminUser.email?.toLowerCase().includes(keyword) ||
      adminUser.user_type?.toLowerCase().includes(keyword) ||
      adminUser.role?.toLowerCase().includes(keyword) ||
      adminUser.unit_kerja?.nama_unit_kerja
        ?.toLowerCase()
        .includes(keyword)
    )
  })





  // =====================================================
  // RENDER PUBLIC LINK HUB
  // =====================================================

  const renderPublicHub = () => {

    if (publicHubLoading) {

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            background: '#f4f7fb',
            color: '#1e293b',
            textAlign: 'center',
          }}
        >
          <div>
            <h2 style={{ marginBottom: '8px', color: '#0f172a' }}>
              Memuat Link Hub...
            </h2>
            <p style={{ margin: 0, color: '#64748b' }}>
              Mohon tunggu sebentar.
            </p>
          </div>
        </div>
      )

    }

    if (publicHubError) {

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            background: '#f4f7fb',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#ffffff',
              borderRadius: '18px',
              padding: '35px 25px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            }}
          >
            <h1 style={{ marginTop: 0, color: '#0f172a' }}>
              Link Hub Tidak Ditemukan
            </h1>

            <p style={{ color: '#64748b', marginBottom: 0 }}>
              {publicHubError}
            </p>
          </div>
        </div>
      )

    }

    if (!publicHub) {

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f4f7fb',
            color: '#64748b',
          }}
        >
          Link Hub tidak ditemukan.
        </div>
      )

    }

    const activeItems = (publicHub.items || [])
      .filter((item) => item.status)
      .sort((a, b) => a.sort_order - b.sort_order)

    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '50px 20px 30px',
          background:
            'linear-gradient(180deg, #eef4ff 0%, #f8fafc 45%, #f8fafc 100%)',
          boxSizing: 'border-box',
        }}
      >

        <div
          style={{
            width: '100%',
            maxWidth: '620px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >

          {/* HEADER CARD */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px 25px 28px',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
            }}
          >

            {/* LOGO */}
            <div
              style={{
                width: '96px',
                height: '96px',
                margin: '0 auto 18px',
                borderRadius: '50%',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 5px 18px rgba(15, 23, 42, 0.08)',
              }}
            >
              <img
                src="/logo-landak.png"
                alt="Logo Kabupaten Landak"
                style={{
                  width: '78px',
                  height: '78px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* BADGE */}
            <div
              style={{
                display: 'inline-block',
                padding: '6px 13px',
                borderRadius: '999px',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.3px',
                marginBottom: '14px',
              }}
            >
              PENINK • LINK HUB
            </div>

            {/* JUDUL */}
            <h1
              style={{
                margin: '0 auto',
                maxWidth: '520px',
                color: '#0f172a',
                fontSize: '28px',
                lineHeight: '1.25',
                fontWeight: '800',
              }}
            >
              {publicHub.title}
            </h1>

            {/* DESKRIPSI */}
            {publicHub.description && (
              <p
                style={{
                  maxWidth: '500px',
                  margin: '14px auto 0',
                  color: '#64748b',
                  fontSize: '15px',
                  lineHeight: '1.6',
                }}
              >
                {publicHub.description}
              </p>
            )}

          </div>


          {/* DAFTAR LINK */}
          <div
            style={{
              marginTop: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >

            {activeItems.length > 0 ? (

              activeItems.map((item) => (

                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '17px 18px',
                    background: '#ffffff',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: '0 7px 20px rgba(15, 23, 42, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px rgba(15, 23, 42, 0.10)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 7px 20px rgba(15, 23, 42, 0.06)'
                  }}
                >

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minWidth: 0,
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: '38px',
                        height: '38px',
                        flex: '0 0 38px',
                        borderRadius: '12px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '800',
                      }}
                    >
                      ↗
                    </span>

                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </span>
                  </span>

                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: '20px',
                      flex: '0 0 auto',
                    }}
                  >
                    →
                  </span>

                </a>

              ))

            ) : (

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '25px 20px',
                  color: '#64748b',
                  boxShadow: '0 7px 20px rgba(15, 23, 42, 0.05)',
                }}
              >
                Belum ada link aktif pada Link Hub ini.
              </div>

            )}

          </div>


          {/* FOOTER */}
          <div
            style={{
              marginTop: '30px',
              paddingBottom: '10px',
              color: '#94a3b8',
              fontSize: '13px',
              lineHeight: '1.5',
            }}
          >
            <div style={{ fontWeight: '700', color: '#64748b' }}>
              PENINK
            </div>

            <div>
              Link Hub Kabupaten Landak
            </div>
          </div>

        </div>
      </div>
    )

  }


  // =====================================================
  // JIKA PUBLIC LINK HUB
  // =====================================================

  if (isPublicHub) {

    return renderPublicHub()

  }


  // =====================================================
  // CEK LOGIN
  // =====================================================

  if (checkingLogin) {

    return (

      <div
        style={{
          padding:
            '40px'
        }}
      >
        Memeriksa login...
      </div>

    )

  }


  // =====================================================
  // TAMPIL LOGIN
  // =====================================================

  if (!user) {

  return (

    <Login
      onLogin={
        handleLogin
      }
    />

  )

}

if (showUnitKerjaForm) {

  return (
    <div className="unit-kerja-page">

      <div className="unit-kerja-card">

        <h1>Lengkapi Profil</h1>

        <p>
          Sebelum menggunakan PENINK,
          silakan pilih unit kerja Anda.
        </p>

        <label>
          Unit Kerja
        </label>

        {unitKerjaLoading ? (

          <p>
            Memuat daftar unit kerja...
          </p>

        ) : (

          <select
            value={selectedUnitKerja}
            onChange={(e) =>
              setSelectedUnitKerja(e.target.value)
            }
          >

            <option value="">
              -- Pilih Unit Kerja --
            </option>

            {unitKerjaOptions.map((unit) => (

              <option
                key={unit.id}
                value={unit.id}
              >
                {unit.nama_unit_kerja}
              </option>

            ))}

          </select>

        )}

        {unitKerjaError && (

          <div className="unit-kerja-error">
            {unitKerjaError}
          </div>

        )}

        <button
          type="button"
          onClick={handleSaveUnitKerja}
          disabled={
            unitKerjaSaving ||
            !selectedUnitKerja
          }
        >
          {unitKerjaSaving
            ? 'Menyimpan...'
            : 'Simpan Unit Kerja'}
        </button>

      </div>

    </div>
  )

}


   // =====================================================
  // RETURN UTAMA
  // =====================================================

  return (
    <>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setShowProfile={setShowProfile}
        user={user}
        isAdmin={isAdmin}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="app-main">
        <Header
          activePage={activePage}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => {
            setShowProfile(true)
            setActivePage('dashboard')
          }}
        />

        <main className="container">
          <div className="card">
            {showProfile ? (
              <Profile
                API_URL={API_URL}
                user={user}
                onUpdateUser={setUser}
                editingProfile={editingProfile}
                setEditingProfile={setEditingProfile}
                editName={editName}
                setEditName={setEditName}
                editEmail={editEmail}
                setEditEmail={setEditEmail}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                showCurrentPassword={showCurrentPassword}
                setShowCurrentPassword={setShowCurrentPassword}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                showConfirmNewPassword={showConfirmNewPassword}
                setShowConfirmNewPassword={setShowConfirmNewPassword}
                handleChangePassword={handleChangePassword}
                handleUpdateProfile={handleUpdateProfile}
                setShowProfile={setShowProfile}
              />
            ) : (
              <>
                  {activePage === 'dashboard' && (
                    <Dashboard
                    isAdmin={isAdmin}
                    adminStats={adminStats}
                    qrScans={qrScans}
                    shortLinks={shortLinks}
                    totalClicks={totalClicks}
                    todayClicks={todayClicks}
                    monthClicks={monthClicks}
                    user={user}
                    url={url}
                    setUrl={setUrl}
                    title={title}
                    setTitle={setTitle}
                    alias={alias}
                    setAlias={setAlias}
                    loading={loading}
                    shortenUrl={shortenUrl}
                    setActivePage={setActivePage}
                  />
                )}

                {activePage === 'shortlink' && (
                  <ShortLink
                    API_URL={API_URL}
                    url={url}
                    setUrl={setUrl}
                    title={title}
                    setTitle={setTitle}
                    alias={alias}
                    setAlias={setAlias}
                    loading={loading}
                    shortUrl={shortUrl}
                    shortLinks={shortLinks}
                    editingShortLink={editingShortLink}
                    editShortLinkForm={editShortLinkForm}
                    setEditShortLinkForm={setEditShortLinkForm}
                    editShortLinkLoading={editShortLinkLoading}
                    editShortLinkError={editShortLinkError}
                    shortenUrl={shortenUrl}
                    copyShortUrl={copyShortUrl}
                    downloadQR={downloadQR}
                    startEditShortLink={startEditShortLink}
                    cancelEditShortLink={cancelEditShortLink}
                    handleEditShortLink={handleEditShortLink}
                    handleToggleShortLink={handleToggleShortLink}
                    handleDeleteShortLink={handleDeleteShortLink}
                  />
                )}

                {activePage === 'linkhub' && (
                  <LinkHub
                    linkHubs={linkHubs}
                    linkHubLoading={linkHubLoading}
                    linkHubError={linkHubError}
                    showLinkHubForm={showLinkHubForm}
                    setShowLinkHubForm={setShowLinkHubForm}
                    linkHubForm={linkHubForm}
                    setLinkHubForm={setLinkHubForm}
                    editingLinkHub={editingLinkHub}
                    editLinkHubForm={editLinkHubForm}
                    setEditLinkHubForm={setEditLinkHubForm}
                    editLinkHubLoading={editLinkHubLoading}
                    editLinkHubError={editLinkHubError}
                    selectedHub={selectedHub}
                    setSelectedHub={setSelectedHub}
                    showHubQr={showHubQr}
                    setShowHubQr={setShowHubQr}
                    linkItemForm={linkItemForm}
                    setLinkItemForm={setLinkItemForm}
                    editingLinkItem={editingLinkItem}
                    setEditingLinkItem={setEditingLinkItem}
                    linkItemLoading={linkItemLoading}
                    linkItemError={linkItemError}
                    setLinkItemError={setLinkItemError}
                    createLinkHub={createLinkHub}
                    startEditLinkHub={startEditLinkHub}
                    setEditingLinkHub={setEditingLinkHub}
                    setEditLinkHubError={setEditLinkHubError}
                    handleUpdateLinkHub={handleUpdateLinkHub}
                    handleDeleteLinkHub={handleDeleteLinkHub}
                    toggleLinkHubStatus={toggleLinkHubStatus}
                    addLinkItem={addLinkItem}
                    editLinkItem={editLinkItem}
                    deleteLinkItem={deleteLinkItem}
                    moveLinkItem={moveLinkItem}
                    toggleLinkItemStatus={toggleLinkItemStatus}
                  />
                )}

                {activePage === 'statistik' && (
                  <Statistik
                  isAdmin={isAdmin}
                  adminStats={adminStats}
                  shortLinks={shortLinks}
                  totalClicks={totalClicks}
                  activeLinks={activeLinks}
                  todayClicks={todayClicks}
                  monthClicks={monthClicks}
                  statsData={statsData}
                  statsDays={statsDays}
                  setStatsDays={setStatsDays}
                  user={user}
                  />
                  )}

                {activePage === 'saran' && (
                  <Feedback
                  user={user}
                  feedbackType={feedbackType}
                  setFeedbackType={setFeedbackType}
                  feedbackTitle={feedbackTitle}
                  setFeedbackTitle={setFeedbackTitle}
                  feedbackMessage={feedbackMessage}
                  setFeedbackMessage={setFeedbackMessage}
                  feedbackSuccess={feedbackSuccess}
                  feedbackError={feedbackError}
                  feedbacks={feedbacks}
                  feedbackLoading={feedbackLoading}
                  selectedFeedback={selectedFeedback}
                  setSelectedFeedback={setSelectedFeedback}
                  handleSubmitFeedback={handleSubmitFeedback}
                  handleLoadFeedbacks={handleLoadFeedbacks}
                  handleDeleteFeedback={handleDeleteFeedback}
                  getFeedbackBadge={getFeedbackBadge}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  />
                  
                  )}

                {activePage === 'feedback-list' && (
                  <Feedback
                  user={user}
                  feedbackType={feedbackType}
                  setFeedbackType={setFeedbackType}
                  feedbackTitle={feedbackTitle}
                  setFeedbackTitle={setFeedbackTitle}
                  feedbackMessage={feedbackMessage}
                  setFeedbackMessage={setFeedbackMessage}
                  feedbackSuccess={feedbackSuccess}
                  feedbackError={feedbackError}
                  feedbacks={feedbacks}
                  feedbackLoading={feedbackLoading}
                  selectedFeedback={selectedFeedback}
                  setSelectedFeedback={setSelectedFeedback}
                  handleSubmitFeedback={handleSubmitFeedback}
                  handleLoadFeedbacks={handleLoadFeedbacks}
                  handleDeleteFeedback={handleDeleteFeedback}
                  getFeedbackBadge={getFeedbackBadge}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  />
                )}

                {activePage === 'users' && (
                  <Users
                  user={user} 
                    adminUsers={adminUsers}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                    filteredUsers={filteredUsers}
                    showAddUserForm={showAddUserForm}
                    setShowAddUserForm={setShowAddUserForm}
                    showEditUserForm={showEditUserForm}
                    setShowEditUserForm={setShowEditUserForm}
                    userForm={userForm}
                    setUserForm={setUserForm}
                    userFormLoading={userFormLoading}
                    userFormError={userFormError}
                    setUserFormError={setUserFormError}
                    editUserForm={editUserForm}
                    setEditUserForm={setEditUserForm}
                    editUserLoading={editUserLoading}
                    editUserError={editUserError}
                    setEditUserError={setEditUserError}
                    unitKerjas={unitKerjas}
                    showUserPassword={showUserPassword}
                    setShowUserPassword={setShowUserPassword}
                    showEditUserPassword={showEditUserPassword}
                    setShowEditUserPassword={setShowEditUserPassword}
                    handleAddUser={handleAddUser}
                    handleEditUser={handleEditUser}
                    handleUpdateUser={handleUpdateUser}
                    handleDeleteUser={handleDeleteUser}  
                    setEditingUserId={setEditingUserId}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      
    </>
  )
}

export default App