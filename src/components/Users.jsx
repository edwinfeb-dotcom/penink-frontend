import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Users as UsersIcon,
  X,
  Shield,
  User as UserIcon,
  Trash2,
} from 'lucide-react'
import './Users.css'

function Users({
    user,
  adminUsers,
  userSearch,
  setUserSearch,
  filteredUsers,
  showAddUserForm,
  setShowAddUserForm,
  showEditUserForm,
  setShowEditUserForm,
  userForm,
  setUserForm,
  userFormLoading,
  userFormError,
  setUserFormError,
  editUserForm,
  setEditUserForm,
  editUserLoading,
  editUserError,
  setEditUserError,
  unitKerjas,
  showUserPassword,
  setShowUserPassword,
  showEditUserPassword,
  setShowEditUserPassword,
  handleAddUser,
  handleEditUser,
  handleUpdateUser,
  handleDeleteUser,
  setEditingUserId,
}) {
  const [showForm, setShowForm] = useState(false)

  const toggleAddForm = () => {
    setShowAddUserForm(!showAddUserForm)
    setShowEditUserForm(false)
    setUserFormError('')
    setEditUserError('')
    setShowForm(!showForm)
  }

  return (
    <div className="us">

      {/* HEADER */}
      <div className="us__header">
        <div>
          <h1 className="us__title">Kelola User</h1>
          <p className="us__subtitle">
            Kelola data pengguna PENINK
          </p>
        </div>

        <button
          type="button"
          className="us__btn-primary"
          onClick={toggleAddForm}
        >
          {showAddUserForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showAddUserForm ? 'Tutup' : 'Tambah User'}</span>
        </button>
      </div>

      {/* FORM TAMBAH USER */}
      {showAddUserForm && (
        <form className="us__form-card" onSubmit={handleAddUser}>
          <div className="us__form-header">
            <div className="us__form-icon">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="us__form-title">Tambah User Baru</h3>
              <p className="us__form-subtitle">
                Tambahkan pengguna baru ke dalam sistem PENINK.
              </p>
            </div>
          </div>

          <div className="us__form-body">
            {userFormError && (
              <div className="us__error">{userFormError}</div>
            )}

            <div className="us__field-row">
              <div className="us__field">
                <label>Nama Lengkap</label>
                <input
                  className="us__input"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="us__field">
                <label>Email</label>
                <input
                  className="us__input"
                  type="email"
                  placeholder="nama@email.com"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="us__field-row">
              <div className="us__field">
                <label>Password</label>
                <div className="us__password-wrap">
                  <input
                    className="us__input"
                    type={showUserPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="us__password-toggle"
                    onClick={() => setShowUserPassword(!showUserPassword)}
                  >
                    {showUserPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="us__field">
                <label>Jenis User</label>
                <select
                  className="us__input"
                  value={userForm.user_type}
                  onChange={(e) =>
                    setUserForm({ ...userForm, user_type: e.target.value })
                  }
                >
                  <option value="UMUM">UMUM</option>
                  <option value="ASN">ASN</option>
                </select>
              </div>
            </div>

            <div className="us__field-row">
              <div className="us__field">
                <label>Role</label>
                <select
                  className="us__input"
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                >
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              <div className="us__field">
                <label>Unit Kerja</label>
                <select
                  className="us__input"
                  value={userForm.unit_kerja_id}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      unit_kerja_id: e.target.value,
                    })
                  }
                >
                  <option value="">-- Pilih Unit Kerja --</option>
                  {unitKerjas.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.nama_unit_kerja}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="us__form-actions">
              <button
                type="button"
                className="us__btn-secondary"
                onClick={() => {
                  setShowAddUserForm(false)
                  setUserFormError('')
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="us__submit"
                disabled={userFormLoading}
              >
                {userFormLoading ? 'Menyimpan...' : 'Simpan User'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FORM EDIT USER */}
      {showEditUserForm && (
        <form
          className="us__form-card us__form-card--edit"
          onSubmit={handleUpdateUser}
        >
          <div className="us__form-header">
            <div className="us__form-icon us__form-icon--edit">
              <Pencil size={20} />
            </div>
            <div>
              <h3 className="us__form-title">Edit User</h3>
              <p className="us__form-subtitle">
                Perbarui data pengguna PENINK.
              </p>
            </div>
          </div>

          <div className="us__form-body">
            {editUserError && (
              <div className="us__error">{editUserError}</div>
            )}

            <div className="us__field-row">
              <div className="us__field">
                <label>Nama Lengkap</label>
                <input
                  className="us__input"
                  type="text"
                  value={editUserForm.name}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="us__field">
                <label>Email</label>
                <input
                  className="us__input"
                  type="email"
                  value={editUserForm.email}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="us__field-row">
              <div className="us__field">
                <label>Password (kosongkan jika tidak diubah)</label>
                <div className="us__password-wrap">
                  <input
                    className="us__input"
                    type={showEditUserPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={editUserForm.password}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        password: e.target.value,
                      })
                    }
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="us__password-toggle"
                    onClick={() =>
                      setShowEditUserPassword(!showEditUserPassword)
                    }
                  >
                    {showEditUserPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="us__field">
                <label>Jenis User</label>
                <select
                  className="us__input"
                  value={editUserForm.user_type}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      user_type: e.target.value,
                    })
                  }
                >
                  <option value="UMUM">UMUM</option>
                  <option value="ASN">ASN</option>
                </select>
              </div>
            </div>

            <div className="us__field-row">
              <div className="us__field">
                <label>Role</label>
                <select
                  className="us__input"
                  value={editUserForm.role}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              <div className="us__field">
                <label>Unit Kerja</label>
                <select
                  className="us__input"
                  value={editUserForm.unit_kerja_id}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      unit_kerja_id: e.target.value,
                    })
                  }
                >
                  <option value="">-- Pilih Unit Kerja --</option>
                  {unitKerjas.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.nama_unit_kerja}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="us__form-actions">
              <button
                type="button"
                className="us__btn-secondary"
                onClick={() => {
                  setShowEditUserForm(false)
                  setEditingUserId(null)
                  setEditUserError('')
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="us__submit"
                disabled={editUserLoading}
              >
                {editUserLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SEARCH + LIST */}
      <div className="us__list-card">
        <div className="us__list-header">
          <div>
            <h3 className="us__list-title">Daftar User</h3>
            <p className="us__list-subtitle">
              Total {adminUsers.length} user terdaftar
            </p>
          </div>

          <div className="us__search">
            <Search size={16} className="us__search-icon" />
            <input
              type="text"
              className="us__search-input"
              placeholder="Cari nama, email, unit kerja..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
        </div>

        {adminUsers.length === 0 ? (
          <div className="us__empty">
            <UsersIcon size={32} className="us__empty-icon" />
            <strong>Belum ada user</strong>
            <p>Klik tombol "Tambah User" untuk menambahkan pengguna baru.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="us__empty">
            <Search size={32} className="us__empty-icon" />
            <strong>User tidak ditemukan</strong>
            <p>Coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="us__list">
            {filteredUsers.map((adminUser) => {
              const initial =
                adminUser.name?.charAt(0).toUpperCase() || 'U'
              const isAdminRole =
                String(adminUser.role || '').toLowerCase() === 'admin'

              return (
                <div key={adminUser.id} className="us__item">
                  <div className="us__item-left">
                    <div className="us__avatar">{initial}</div>

                    <div className="us__item-info">
                      <div className="us__item-top">
                        <strong className="us__item-name">
                          {adminUser.name}
                        </strong>
                        <span
                          className={`us__badge ${
                            isAdminRole
                              ? 'us__badge--admin'
                              : 'us__badge--user'
                          }`}
                        >
                          {isAdminRole ? (
                            <Shield size={10} />
                          ) : (
                            <UserIcon size={10} />
                          )}
                          {String(adminUser.role || '').toUpperCase()}
                        </span>
                      </div>

                      <span className="us__item-email">
                        {adminUser.email}
                      </span>

                      <span className="us__item-meta">
                        {adminUser.user_type || '-'}
                        {' • '}
                        {adminUser.unit_kerja?.nama_unit_kerja || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="us__item-actions">
                    <button
                    type="button"
                    className="us__btn-icon"
                    onClick={() => handleEditUser(adminUser)}
                    title="Edit"
                    >
                        
                        <Pencil size={15} />
                        </button>
                        
                        <button
                        type="button"
                        className="us__btn-icon us__btn-icon--danger"
                        onClick={() => handleDeleteUser(adminUser)}
                        title="Hapus"
                        disabled={adminUser.id === user?.id}
                        >
                            <Trash2 size={15} />
                    </button>
                    </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Users