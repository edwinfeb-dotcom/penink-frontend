import { useState } from 'react'
import {
  User as UserIcon,
  Mail,
  Shield,
  Building2,
  Users as UsersIcon,
  Pencil,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  Check,
} from 'lucide-react'
import './Profile.css'

function Profile({
  API_URL,
  user,
  onUpdateUser,
  editingProfile,
  setEditingProfile,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmNewPassword,
  setShowConfirmNewPassword,
  handleChangePassword,
  handleUpdateProfile,
  setShowProfile,
}) {
  const initial = user?.name?.charAt(0).toUpperCase() || 'U'

  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
    const [selectedAvatar, setSelectedAvatar] = useState(null)

    const avatarOptions = [
    // === AVATAAARS (kartun) ===
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Fajar&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Matahari&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bintang&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bulan&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Awan&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Hujan&backgroundColor=c9e6c0',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Pelangi&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Gunung&backgroundColor=b6e3f4',

    // === BOTTTS (robot) ===
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot3&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot4&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot5&backgroundColor=c9e6c0',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot6&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot7&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot8&backgroundColor=c0aede',

    // === FUN EMOJI ===
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Senang&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Keren&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Keren2&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lucu&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Imut&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Gembira&backgroundColor=c9e6c0',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Santai&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Hebat&backgroundColor=b6e3f4',
  ]

    const handleOpenPicker = () => {
    setSelectedAvatar(user?.avatar || null)
    setShowAvatarPicker(true)
  }

  const handleConfirmAvatar = async () => {
    if (!selectedAvatar) {
      alert('Pilih avatar terlebih dahulu.')
      return
    }

    const yakin = window.confirm(
      'Apakah kamu yakin ingin mengganti avatar?'
    )

    if (!yakin) return

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
            name: user?.name || '',
            email: user?.email || '',
            avatar: selectedAvatar,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal menyimpan avatar.'
        )
      }

      if (onUpdateUser) {
        onUpdateUser(result.user)
      }

      setShowAvatarPicker(false)
      setSelectedAvatar(null)
      alert('Avatar berhasil diperbarui.')
    } catch (error) {
      alert(error.message)
    }
  }

  // =====================================================
  // EDIT MODE
  // =====================================================

  if (editingProfile) {
    return (
      <div className="pf">
        <div className="pf__header">
          <div>
            <h1 className="pf__title">Edit Profil</h1>
            <p className="pf__subtitle">
              Perbarui informasi akun PENINK Anda
            </p>
          </div>
        </div>

        <div className="pf__card">
          <div className="pf__card-header">
            <div className="pf__card-icon">
              <UserIcon size={20} />
            </div>
            <div>
              <h3 className="pf__card-title">Informasi Akun</h3>
              <p className="pf__card-subtitle">
                Ubah nama atau email akun kamu
              </p>
            </div>
          </div>

          <div className="pf__card-body">
            <div className="pf__field">
              <label>Nama Lengkap</label>
              <input
                className="pf__input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="pf__field">
              <label>Email</label>
              <input
                className="pf__input"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Masukkan email"
              />
            </div>

            <div className="pf__readonly">
              <div className="pf__readonly-item">
                <span>Tipe Pengguna</span>
                <strong>{user?.user_type || '-'}</strong>
              </div>
              <div className="pf__readonly-item">
                <span>Unit Kerja</span>
                <strong>
                  {user?.unit_kerja?.nama_unit_kerja || '-'}
                </strong>
              </div>
              <div className="pf__readonly-item">
                <span>Role</span>
                <strong>{user?.role || '-'}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="pf__card">
          <div className="pf__card-header">
            <div className="pf__card-icon pf__card-icon--lock">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="pf__card-title">Ubah Password</h3>
              <p className="pf__card-subtitle">
                Kosongkan jika tidak ingin mengubah password
              </p>
            </div>
          </div>

          <div className="pf__card-body">
            <div className="pf__field">
              <label>Password Lama</label>
              <div className="pf__password-wrap">
                <input
                  className="pf__input"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                />
                <button
                  type="button"
                  className="pf__password-toggle"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="pf__field">
              <label>Password Baru</label>
              <div className="pf__password-wrap">
                <input
                  className="pf__input"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  className="pf__password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="pf__field">
              <label>Konfirmasi Password Baru</label>
              <div className="pf__password-wrap">
                <input
                  className="pf__input"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(e.target.value)
                  }
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  className="pf__password-toggle"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                >
                  {showConfirmNewPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="pf__btn-secondary"
              onClick={handleChangePassword}
            >
              <Lock size={14} /> Ubah Password
            </button>
          </div>
        </div>

        <div className="pf__actions">
          <button
            type="button"
            className="pf__btn-secondary"
            onClick={() => setEditingProfile(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="pf__btn-primary"
            onClick={handleUpdateProfile}
          >
            <Save size={14} /> Simpan Perubahan
          </button>
        </div>
      </div>
    )
  }

  // =====================================================
  // VIEW MODE
  // =====================================================

  return (
    <div className="pf">
      <div className="pf__header">
        <div>
          <h1 className="pf__title">Profil Pengguna</h1>
          <p className="pf__subtitle">
            Informasi akun PENINK Anda
          </p>
        </div>
      </div>

      <div className="pf__banner">
        <div className="pf__banner-content">
          <div className="pf__avatar-wrap">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="pf__avatar-img"
              />
            ) : (
              <div className="pf__avatar">{initial}</div>
            )}

            <button
              type="button"
              className="pf__avatar-edit"
               onClick={handleOpenPicker}
              title="Ganti avatar"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="pf__banner-info">
            <h2 className="pf__banner-name">
              {user?.name || '-'}
            </h2>
            <p className="pf__banner-email">
              {user?.email || '-'}
            </p>
            <span className="pf__banner-badge">
              <Shield size={12} />
              {(user?.role || 'USER').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="pf__banner-deco" aria-hidden="true">
          <div className="pf__banner-circle pf__banner-circle--1" />
          <div className="pf__banner-circle pf__banner-circle--2" />
        </div>
      </div>

      <div className="pf__card">
        <div className="pf__card-header">
          <div className="pf__card-icon">
            <UserIcon size={20} />
          </div>
          <div>
            <h3 className="pf__card-title">Informasi Akun</h3>
            <p className="pf__card-subtitle">
              Detail data akun kamu
            </p>
          </div>
        </div>

        <div className="pf__info-grid">
          <div className="pf__info-item">
            <div className="pf__info-icon">
              <UserIcon size={16} />
            </div>
            <div>
              <span className="pf__info-label">Nama Lengkap</span>
              <strong className="pf__info-value">
                {user?.name || '-'}
              </strong>
            </div>
          </div>

          <div className="pf__info-item">
            <div className="pf__info-icon">
              <Mail size={16} />
            </div>
            <div>
              <span className="pf__info-label">Email</span>
              <strong className="pf__info-value">
                {user?.email || '-'}
              </strong>
            </div>
          </div>

          <div className="pf__info-item">
            <div className="pf__info-icon">
              <Shield size={16} />
            </div>
            <div>
              <span className="pf__info-label">Tipe Pengguna</span>
              <strong className="pf__info-value">
                {user?.user_type || '-'}
              </strong>
            </div>
          </div>

          <div className="pf__info-item">
            <div className="pf__info-icon">
              <Building2 size={16} />
            </div>
            <div>
              <span className="pf__info-label">Unit Kerja</span>
              <strong className="pf__info-value">
                {user?.unit_kerja?.nama_unit_kerja || '-'}
              </strong>
            </div>
          </div>

          <div className="pf__info-item">
            <div className="pf__info-icon">
              <UsersIcon size={16} />
            </div>
            <div>
              <span className="pf__info-label">Role</span>
              <strong className="pf__info-value">
                {user?.role || '-'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="pf__actions">
        <button
          type="button"
          className="pf__btn-secondary"
          onClick={() => setShowProfile(false)}
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <button
          type="button"
          className="pf__btn-primary"
          onClick={() => {
            setEditName(user?.name || '')
            setEditEmail(user?.email || '')
            setEditingProfile(true)
          }}
        >
          <Pencil size={14} /> Edit Profil
        </button>
      </div>

      {showAvatarPicker && (
        <div
          className="pf__modal-backdrop"
          onClick={() => setShowAvatarPicker(false)}
        >
          <div
            className="pf__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf__modal-header">
              <div>
                <h3 className="pf__modal-title">Pilih Avatar</h3>
                <p className="pf__modal-subtitle">
                  Pilih avatar favorit kamu, lalu klik Simpan
                </p>
              </div>
            </div>

            <div className="pf__avatar-grid">
              {avatarOptions.map((avatarUrl, index) => {
                const isSelected = selectedAvatar === avatarUrl
                return (
                  <button
                    key={index}
                    type="button"
                    className={`pf__avatar-option ${
                      isSelected ? 'pf__avatar-option--active' : ''
                    }`}
                    onClick={() => setSelectedAvatar(avatarUrl)}
                  >
                    <img src={avatarUrl} alt={`Avatar ${index + 1}`} />
                    {isSelected && (
                      <div className="pf__avatar-check">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="pf__modal-footer">
              <button
                type="button"
                className="pf__btn-secondary"
                onClick={() => {
                  setShowAvatarPicker(false)
                  setSelectedAvatar(null)
                }}
              >
                Batal
              </button>

              <button
                type="button"
                className="pf__btn-primary"
                onClick={handleConfirmAvatar}
                disabled={!selectedAvatar}
              >
                <Check size={14} /> Simpan Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile