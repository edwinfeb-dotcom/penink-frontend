import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Pencil,
  Users as UsersIcon,
  X,
  Shield,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import "./Users.css";

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
  const [showForm, setShowForm] = useState(false);

  // ============ STATE UNIT KERJA PICKER (ADD FORM) ============
  const [addUnitKerjaSearch, setAddUnitKerjaSearch] = useState("");
  const [showAddUnitKerjaDropdown, setShowAddUnitKerjaDropdown] =
    useState(false);

  // ============ STATE UNIT KERJA PICKER (EDIT FORM) ============
  const [editUnitKerjaSearch, setEditUnitKerjaSearch] = useState("");
  const [showEditUnitKerjaDropdown, setShowEditUnitKerjaDropdown] =
    useState(false);

  // ============ CEK ROLE USER YANG SEDANG LOGIN ============
  const currentRole = String(user?.role || "").toLowerCase();
  const isSuperAdmin = currentRole === "super_admin";

  const toggleAddForm = () => {
    setShowAddUserForm(!showAddUserForm);
    setShowEditUserForm(false);
    setUserFormError("");
    setEditUserError("");
    setShowForm(!showForm);
  };

  // ============ HELPER: SORT + FUZZY SEARCH ============
  const filterUnitKerjas = (list, keyword) => {
    const sorted = [...list].sort((a, b) =>
      a.nama_unit_kerja.localeCompare(b.nama_unit_kerja, "id", {
        sensitivity: "base",
      }),
    );

    const search = keyword.trim().toLowerCase().replace(/\s+/g, "");
    if (!search) return sorted;

    const exactMatches = [];
    const fuzzyMatches = [];

    for (const unit of sorted) {
      const compact = unit.nama_unit_kerja.toLowerCase().replace(/\s+/g, "");

      if (compact.includes(search)) {
        exactMatches.push(unit);
        continue;
      }

      let i = 0;
      for (const char of compact) {
        if (char === search[i]) i++;
        if (i === search.length) break;
      }
      if (i === search.length) {
        fuzzyMatches.push(unit);
      }
    }

    return [...exactMatches, ...fuzzyMatches];
  };

  const addFilteredUnitKerjas = useMemo(
    () => filterUnitKerjas(unitKerjas, addUnitKerjaSearch),
    [unitKerjas, addUnitKerjaSearch],
  );

  const editFilteredUnitKerjas = useMemo(
    () => filterUnitKerjas(unitKerjas, editUnitKerjaSearch),
    [unitKerjas, editUnitKerjaSearch],
  );

  // ============ HELPER: BADGE UNTUK ROLE ============
  const getRoleBadgeClass = (role) => {
    const r = String(role || "").toLowerCase();
    if (r === "super_admin") return "us__badge--super";
    return "us__badge--user"; // Default untuk user
  };

  const getRoleLabel = (role) => {
    const r = String(role || "").toLowerCase();
    if (r === "super_admin") return "SUPER ADMIN";
    return "USER";
  };

  return (
    <div className="us">
      {/* HEADER */}
      <div className="us__header">
        <div>
          <h1 className="us__title">Kelola User</h1>
          <p className="us__subtitle">Kelola data pengguna PENINK</p>
        </div>

        <button
          type="button"
          className="us__btn-primary"
          onClick={toggleAddForm}
        >
          {showAddUserForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showAddUserForm ? "Tutup" : "Tambah User"}</span>
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
            {userFormError && <div className="us__error">{userFormError}</div>}

            <div className="us__field-row">
              <div className="us__field">
                <label>
                  Nama Lengkap <span style={{ color: "red" }}>*</span>
                </label>
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
                <label>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
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
                <label>
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <div className="us__password-wrap">
                  <input
                    className="us__input"
                    type={showUserPassword ? "text" : "password"}
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
                    {showUserPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
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
                  <option value="ASN">ASN Pemerintah Kabupaten Landak</option>
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

                  {/* Hanya Super Admin yang bisa membuat Super Admin lain */}
                  {isSuperAdmin && (
                    <option value="super_admin">SUPER ADMIN</option>
                  )}
                </select>
              </div>

              <div className="us__field">
                <label>Unit Kerja</label>

                <div className="us__unit-picker">
                  <input
                    className="us__input"
                    type="text"
                    placeholder="🔍 Ketik untuk cari... (mis: kominfo)"
                    value={addUnitKerjaSearch}
                    onChange={(e) => {
                      setAddUnitKerjaSearch(e.target.value);
                      setShowAddUnitKerjaDropdown(true);
                      if (userForm.unit_kerja_id) {
                        setUserForm({ ...userForm, unit_kerja_id: "" });
                      }
                    }}
                    onFocus={() => setShowAddUnitKerjaDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowAddUnitKerjaDropdown(false), 200)
                    }
                    autoComplete="off"
                  />

                  {showAddUnitKerjaDropdown && (
                    <div className="us__unit-dropdown">
                      {addFilteredUnitKerjas.length === 0 ? (
                        <div className="us__unit-dropdown__empty">
                          Tidak ada unit kerja yang cocok
                        </div>
                      ) : (
                        addFilteredUnitKerjas.map((unit) => (
                          <button
                            key={unit.id}
                            type="button"
                            className={`us__unit-dropdown__item ${
                              String(userForm.unit_kerja_id) === String(unit.id)
                                ? "us__unit-dropdown__item--active"
                                : ""
                            }`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setUserForm({
                                ...userForm,
                                unit_kerja_id: unit.id,
                              });
                              setAddUnitKerjaSearch(unit.nama_unit_kerja);
                              setShowAddUnitKerjaDropdown(false);
                            }}
                          >
                            {unit.nama_unit_kerja}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="us__form-actions">
              <button
                type="button"
                className="us__btn-secondary"
                onClick={() => {
                  setShowAddUserForm(false);
                  setUserFormError("");
                  setAddUnitKerjaSearch("");
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="us__submit"
                disabled={userFormLoading}
              >
                {userFormLoading ? "Menyimpan..." : "Simpan User"}
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
            {editUserError && <div className="us__error">{editUserError}</div>}

            <div className="us__field-row">
              <div className="us__field">
                <label>
                  Nama Lengkap <span style={{ color: "red" }}>*</span>
                </label>
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
                <label>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
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
                    type={showEditUserPassword ? "text" : "password"}
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
                    {showEditUserPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
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
                  <option value="ASN">ASN Pemerintah Kabupaten Landak</option>
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

                  {isSuperAdmin && (
                    <option value="super_admin">SUPER ADMIN</option>
                  )}
                </select>
              </div>

              <div className="us__field">
                <label>Unit Kerja</label>

                <div className="us__unit-picker">
                  <input
                    className="us__input"
                    type="text"
                    placeholder="🔍 Ketik untuk cari... (mis: kominfo)"
                    value={editUnitKerjaSearch}
                    onChange={(e) => {
                      setEditUnitKerjaSearch(e.target.value);
                      setShowEditUnitKerjaDropdown(true);
                      if (editUserForm.unit_kerja_id) {
                        setEditUserForm({
                          ...editUserForm,
                          unit_kerja_id: "",
                        });
                      }
                    }}
                    onFocus={() => setShowEditUnitKerjaDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowEditUnitKerjaDropdown(false), 200)
                    }
                    autoComplete="off"
                  />

                  {showEditUnitKerjaDropdown && (
                    <div className="us__unit-dropdown">
                      {editFilteredUnitKerjas.length === 0 ? (
                        <div className="us__unit-dropdown__empty">
                          Tidak ada unit kerja yang cocok
                        </div>
                      ) : (
                        editFilteredUnitKerjas.map((unit) => (
                          <button
                            key={unit.id}
                            type="button"
                            className={`us__unit-dropdown__item ${
                              String(editUserForm.unit_kerja_id) ===
                              String(unit.id)
                                ? "us__unit-dropdown__item--active"
                                : ""
                            }`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setEditUserForm({
                                ...editUserForm,
                                unit_kerja_id: unit.id,
                              });
                              setEditUnitKerjaSearch(unit.nama_unit_kerja);
                              setShowEditUnitKerjaDropdown(false);
                            }}
                          >
                            {unit.nama_unit_kerja}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="us__form-actions">
              <button
                type="button"
                className="us__btn-secondary"
                onClick={() => {
                  setShowEditUserForm(false);
                  setEditingUserId(null);
                  setEditUserError("");
                  setEditUnitKerjaSearch("");
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="us__submit"
                disabled={editUserLoading}
              >
                {editUserLoading ? "Menyimpan..." : "Simpan Perubahan"}
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
              const initial = adminUser.name?.charAt(0).toUpperCase() || "U";

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
                          className={`us__badge ${getRoleBadgeClass(
                            adminUser.role,
                          )}`}
                        >
                          <Shield size={10} />
                          {getRoleLabel(adminUser.role)}
                        </span>
                      </div>

                      <span className="us__item-email">{adminUser.email}</span>

                      <span className="us__item-meta">
                        {adminUser.user_type || "-"}
                        {" • "}
                        {adminUser.unit_kerja?.nama_unit_kerja || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="us__item-actions">
                    <button
                      type="button"
                      className="us__btn-icon"
                      onClick={() => {
                        handleEditUser(adminUser);
                        setEditUnitKerjaSearch(
                          adminUser.unit_kerja?.nama_unit_kerja || "",
                        );
                      }}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
