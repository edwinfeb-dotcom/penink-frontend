import { useState, useEffect } from "react";
import {
  Plus,
  FolderKanban,
  Pencil,
  Trash2,
  Power,
  QrCode,
  ExternalLink,
  ChevronUp,
  Download,
  X,
  Link2,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Lock,
  Copy,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { useToast } from "./Toast";
import "./LinkHub.css";

function LinkHub({
  API_URL,
  user,
  linkHubs,
  linkHubLoading,
  linkHubError,
  showLinkHubForm,
  setShowLinkHubForm,
  linkHubForm,
  setLinkHubForm,
  editingLinkHub,
  editLinkHubForm,
  setEditLinkHubForm,
  editLinkHubLoading,
  editLinkHubError,
  selectedHub,
  setSelectedHub,
  showHubQr,
  setShowHubQr,
  linkItemForm,
  setLinkItemForm,
  editingLinkItem,
  setEditingLinkItem,
  linkItemLoading,
  linkItemError,
  setLinkItemError,
  createLinkHub,
  startEditLinkHub,
  setEditingLinkHub,
  setEditLinkHubError,
  handleUpdateLinkHub,
  handleDeleteLinkHub,
  toggleLinkHubStatus,
  addLinkItem,
  editLinkItem,
  deleteLinkItem,
  moveLinkItem,
  toggleLinkItemStatus,
  logoFile,
  setLogoFile,
  removeLogo,
  setRemoveLogo,
}) {
  const toast = useToast();
  const [showInfo, setShowInfo] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // ✨ STATE BARU UNTUK MENYIMPAN URL PREVIEW GAMBAR ✨
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);

  const [manualAlias, setManualAlias] = useState("");
  const [selectedLockedAliasId, setSelectedLockedAliasId] = useState("");
  const [lockedAliases, setLockedAliases] = useState([]);
  const [loadingLocked, setLoadingLocked] = useState(false);
  const [aliasError, setAliasError] = useState("");

  useEffect(() => {
    if (!showLinkHubForm) return;
    if (!user?.unit_kerja_id) return;

    const fetchLockedAliases = async () => {
      try {
        setLoadingLocked(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/user/locked-aliases`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLockedAliases(data.data || []);
      } catch (err) {
        console.error("Gagal ambil alias terkunci:", err);
        setLockedAliases([]);
      } finally {
        setLoadingLocked(false);
      }
    };

    fetchLockedAliases();
  }, [showLinkHubForm, user, API_URL]);

  useEffect(() => {
    if (!showLinkHubForm) {
      setManualAlias("");
      setAliasError("");
    }
  }, [showLinkHubForm]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    const hasManual = manualAlias.trim() !== "";
    const hasSelected = selectedLockedAliasId !== "";

    if (hasManual && hasSelected) {
      setAliasError(
        "Pilih salah satu: isi alias manual ATAU pilih dari daftar alias terkunci.",
      );
      return;
    }

    setAliasError("");

    const finalAlias = hasManual
      ? manualAlias.trim()
      : lockedAliases.find((a) => a.id === Number(selectedLockedAliasId))
          ?.alias || "";

    createLinkHub(e, finalAlias, null);
  };

  const handleToggleHub = (hub) => {
    if (selectedHub?.id === hub.id) {
      setSelectedHub(null);
      setLinkItemError("");
      setEditingLinkItem(null);
      setLinkItemForm({ title: "", url: "" });
    } else {
      setSelectedHub(hub);
      setLinkItemError("");
      setLinkItemForm({ title: "", url: "" });
      setEditingLinkItem(null);
    }
  };

  const handleCopyLink = (hub) => {
    const publicUrl = `${window.location.origin}/${hub.short_code}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link berhasil disalin!");
  };

  // Fungsi untuk memproses file (dipakai oleh Input & Drag Drop)
  const processLogoFile = (file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format harus PNG, JPG, JPEG, SVG, atau WEBP");
      return;
    }

    setLogoFile(file);
    setRemoveLogo(false);

    // ✨ MENGGUNAKAN FILEREADER AGAR GAMBAR PASTI MUNCUL ✨
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    processLogoFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processLogoFile(file);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="lh">
      {/* HEADER HALAMAN */}
      <div className="lh__header">
        <div className="lh__header-text">
          <h1 className="lh__title">Link Hub</h1>
          <p className="lh__subtitle">Kumpulan link dalam satu halaman</p>
        </div>

        <button
          type="button"
          className="lh__btn-primary"
          onClick={() => {
            setShowLinkHubForm(!showLinkHubForm);
            setEditingLinkHub(null);
            setLogoPreviewUrl(null);
          }}
        >
          {showLinkHubForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showLinkHubForm ? "Tutup" : "Buat Link Hub"}</span>
        </button>
      </div>

      {showInfo && (
        <div className="lh__info">
          <div className="lh__info-deco" aria-hidden="true">
            <Link2
              size={80}
              className="lh__info-deco-icon lh__info-deco-icon--1"
            />
            <FolderKanban
              size={120}
              className="lh__info-deco-icon lh__info-deco-icon--2"
            />
            <ExternalLink
              size={70}
              className="lh__info-deco-icon lh__info-deco-icon--3"
            />
            <QrCode
              size={90}
              className="lh__info-deco-icon lh__info-deco-icon--4"
            />
          </div>

          <div className="lh__info-icon">
            <Lightbulb size={22} />
          </div>
          <div className="lh__info-content">
            <strong>Apa itu Link Hub?</strong>
            <p>
              Link Hub memungkinkan Anda mengumpulkan beberapa tautan penting
              dalam satu halaman. Bagikan satu link untuk mengakses berbagai
              informasi — website, media sosial, layanan publik, dan lainnya.
            </p>
          </div>
          <button
            type="button"
            className="lh__info-close"
            onClick={() => setShowInfo(false)}
            aria-label="Tutup info"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* FORM BUAT LINK HUB */}
      {showLinkHubForm && (
        <form className="lh__form-card" onSubmit={handleCreateSubmit}>
          <div className="lh__form-header">
            <div className="lh__form-icon">
              <FolderKanban size={20} />
            </div>
            <div>
              <h3 className="lh__form-title">Buat Link Hub Baru</h3>
              <p className="lh__form-subtitle">
                Buat halaman yang berisi kumpulan link.
              </p>
            </div>
          </div>

          <div className="lh__form-body">
            {linkHubError && <div className="lh__error">{linkHubError}</div>}

            <div className="lh__field">
              <label>
                Judul Link Hub <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="lh__input"
                type="text"
                placeholder="Contoh: Diskominfo Kabupaten Landak"
                value={linkHubForm.title}
                onChange={(e) =>
                  setLinkHubForm({ ...linkHubForm, title: e.target.value })
                }
                required
              />
            </div>

            <div className="lh__field">
              <label>Deskripsi</label>
              <textarea
                className="lh__input lh__input--textarea"
                placeholder="Deskripsi Link Hub (opsional)"
                rows={3}
                value={linkHubForm.description}
                onChange={(e) =>
                  setLinkHubForm({
                    ...linkHubForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="lh__field">
              <label>
                <ImageIcon
                  size={13}
                  style={{ display: "inline", marginRight: 6 }}
                />
                Logo Instansi (opsional)
              </label>

              <label
                className={`lh__upload-area ${isDragging ? "lh__upload-area--dragging" : ""}`}
                htmlFor="logo-upload-create"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload size={20} className="lh__upload-icon" />
                <span className="lh__upload-text">
                  {logoFile ? logoFile.name : "Klik untuk pilih file logo"}
                </span>
                <span className="lh__upload-hint">
                  PNG / JPG / SVG / WEBP — maksimal 2MB
                </span>
                <input
                  id="logo-upload-create"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
              </label>

              {logoFile && logoPreviewUrl && (
                <div className="lh__logo-preview">
                  {/* ✨ GUNAKAN logoPreviewUrl, BUKAN URL.createObjectURL ✨ */}
                  <img src={logoPreviewUrl} alt="Preview Logo" />
                  <div className="lh__logo-preview-info">
                    <strong>{logoFile.name}</strong>
                    <span>{(logoFile.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <button
                    type="button"
                    className="lh__logo-remove"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreviewUrl(null);
                    }}
                    title="Hapus logo"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="lh__field">
              <label>Alias Custom (opsional)</label>
              <input
                className="lh__input"
                type="text"
                placeholder="Contoh: promosi2026"
                value={manualAlias}
                onChange={(e) => {
                  setManualAlias(e.target.value);
                  setAliasError("");
                }}
              />
              <small className="lh__hint">
                Kosongkan untuk dibuatkan otomatis oleh sistem, ATAU pilih dari
                daftar alias terkunci OPD di bawah.
              </small>
            </div>

            {user?.unit_kerja_id && (
              <div className="lh__field">
                <label>Atau Pilih Alias Terkunci OPD Anda</label>

                {loadingLocked ? (
                  <div className="lh__hint">Memuat alias...</div>
                ) : lockedAliases.length === 0 ? (
                  <div className="lh__hint">
                    Belum ada alias terkunci untuk OPD Anda.
                  </div>
                ) : (
                  <select
                    className="lh__input"
                    value={selectedLockedAliasId}
                    onChange={(e) => {
                      setSelectedLockedAliasId(e.target.value);
                      setAliasError("");
                    }}
                  >
                    <option value="">-- Tidak pakai --</option>
                    {lockedAliases.map((a) => (
                      <option key={a.id} value={a.id}>
                        /{a.alias}
                      </option>
                    ))}
                  </select>
                )}

                <small className="lh__hint">
                  Alias ini khusus untuk OPD Anda (sudah dikunci oleh admin).
                </small>
              </div>
            )}

            {aliasError && <div className="lh__error">{aliasError}</div>}

            <div className="lh__field">
              <small className="lh__hint">
                Link publik:{" "}
                <b>
                  /
                  {manualAlias.trim() ||
                    lockedAliases.find(
                      (a) => a.id === Number(selectedLockedAliasId),
                    )?.alias ||
                    "(otomatis)"}
                </b>
              </small>
            </div>

            <div className="lh__form-actions">
              <button
                type="button"
                className="lh__btn-secondary"
                onClick={() => {
                  setShowLinkHubForm(false);
                  setLinkHubForm({
                    title: "",
                    description: "",
                    short_code: "",
                    type: "UMUM",
                  });
                  setManualAlias("");
                  setSelectedLockedAliasId("");
                  setAliasError("");
                  setLogoFile(null);
                  setLogoPreviewUrl(null);
                  setRemoveLogo(false);
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="lh__submit"
                disabled={linkHubLoading}
              >
                {linkHubLoading ? "Menyimpan..." : "Buat Link Hub"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FORM EDIT LINK HUB */}
      {editingLinkHub && (
        <form
          className="lh__form-card lh__form-card--edit"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateLinkHub();
          }}
        >
          <div className="lh__form-header">
            <div className="lh__form-icon lh__form-icon--edit">
              <Pencil size={20} />
            </div>
            <div>
              <h3 className="lh__form-title">Edit Link Hub</h3>
              <p className="lh__form-subtitle">Perbarui informasi Link Hub.</p>
            </div>
          </div>

          <div className="lh__form-body">
            {editLinkHubError && (
              <div className="lh__error">{editLinkHubError}</div>
            )}

            <div className="lh__field">
              <label>
                Judul <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="lh__input"
                type="text"
                value={editLinkHubForm.title}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="lh__field">
              <label>Deskripsi</label>
              <textarea
                className="lh__input lh__input--textarea"
                rows={3}
                value={editLinkHubForm.description}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="lh__field">
              <label>
                <ImageIcon
                  size={13}
                  style={{ display: "inline", marginRight: 6 }}
                />
                Logo Instansi (opsional)
              </label>

              <label
                className={`lh__upload-area ${isDragging ? "lh__upload-area--dragging" : ""}`}
                htmlFor="logo-upload-edit"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload size={20} className="lh__upload-icon" />
                <span className="lh__upload-text">
                  {logoFile ? logoFile.name : "Klik untuk ganti logo"}
                </span>
                <span className="lh__upload-hint">
                  PNG / JPG / SVG / WEBP — maksimal 2MB
                </span>
                <input
                  id="logo-upload-edit"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
              </label>

              {(logoFile || (editingLinkHub?.logo_url && !removeLogo)) && (
                <div className="lh__logo-preview">
                  <img
                    src={
                      logoFile
                        ? logoPreviewUrl // ✨ Gunakan URL preview state
                        : editingLinkHub.logo_url
                    }
                    alt="Preview Logo"
                  />
                  <div className="lh__logo-preview-info">
                    <strong>
                      {logoFile ? logoFile.name : "Logo saat ini"}
                    </strong>
                    <span>
                      {logoFile
                        ? `${(logoFile.size / 1024).toFixed(0)} KB`
                        : "Klik hapus untuk kembali ke default"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="lh__logo-remove"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreviewUrl(null);
                      setRemoveLogo(true);
                    }}
                    title="Hapus logo"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="lh__field">
              <label>Jenis</label>
              <select
                className="lh__input"
                value={editLinkHubForm.type || "UMUM"}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    type: e.target.value,
                  })
                }
              >
                <option value="UMUM">UMUM</option>
                <option value="ASN">ASN</option>
              </select>
            </div>

            <div className="lh__field">
              <label>
                Alias <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="lh__input"
                type="text"
                value={editLinkHubForm.short_code}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    short_code: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="lh__form-actions">
              <button
                type="button"
                className="lh__btn-secondary"
                onClick={() => {
                  setEditingLinkHub(null);
                  setEditLinkHubForm({
                    title: "",
                    description: "",
                    short_code: "",
                    type: "UMUM",
                  });
                  setEditLinkHubError("");
                  setLogoFile(null);
                  setLogoPreviewUrl(null);
                  setRemoveLogo(false);
                }}
                disabled={editLinkHubLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="lh__submit"
                disabled={editLinkHubLoading}
              >
                {editLinkHubLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* DAFTAR LINK HUB */}
      <div className="lh__list-card">
        <div className="lh__list-header">
          <div>
            <h3 className="lh__list-title">Daftar Link Hub</h3>
            <p className="lh__list-subtitle">
              Total {linkHubs.length} Link Hub
            </p>
          </div>
        </div>

        {linkHubLoading && !showLinkHubForm ? (
          <div className="lh__empty">Memuat data...</div>
        ) : linkHubs.length === 0 ? (
          <div className="lh__empty">
            <FolderKanban size={32} className="lh__empty-icon" />
            <strong>Belum ada Link Hub</strong>
            <p>
              Klik tombol <b>+ Buat Link Hub</b> di atas untuk membuat Link Hub
              pertama.
            </p>
          </div>
        ) : (
          <div className="lh__list">
            {linkHubs.map((hub) => {
              const isOpen = selectedHub?.id === hub.id;
              const showQr = showHubQr?.id === hub.id;
              const itemCount = hub.items?.length || 0;

              return (
                <div key={hub.id} className="lh__item">
                  <div className="lh__item-header">
                    <div className="lh__item-main">
                      {/* ✨ Hanya tampilkan logo jika user mengunggahnya ✨ */}
                      {hub.logo_url && (
                        <div className="lh__item-logo-wrap">
                          <img
                            src={hub.logo_url}
                            alt={`Logo ${hub.title}`}
                            className="lh__item-logo"
                          />
                        </div>
                      )}

                      <div className="lh__item-text">
                        <div className="lh__item-top">
                          <strong className="lh__item-title">
                            {hub.title}
                          </strong>
                          <span
                            className={`lh__badge ${
                              hub.status
                                ? "lh__badge--active"
                                : "lh__badge--inactive"
                            }`}
                          >
                            {hub.status ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>

                        {hub.description && (
                          <p className="lh__item-desc">{hub.description}</p>
                        )}

                        <a
                          href={`/${hub.short_code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="lh__item-url"
                        >
                          {window.location.origin}/{hub.short_code}
                          <ExternalLink size={12} />
                        </a>

                        {hub.locked_unit_kerja_id && (
                          <div className="lh__item-locked">
                            <Lock size={11} />
                            <span>
                              {hub.locked_unit_kerja?.nama_unit_kerja ||
                                "Unit Kerja Tertentu"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lh__item-meta">
                      <div className="lh__meta-item">
                        <strong>{itemCount}</strong>
                        <span>link</span>
                      </div>
                      <div className="lh__meta-item" title="Total Klik">
                        <strong>{hub.click_count || 0}</strong>
                        <span>klik</span>
                      </div>
                      <div className="lh__meta-item" title="Total Scan QR">
                        <strong>{hub.scan_count || 0}</strong>
                        <span>scan</span>
                      </div>
                    </div>
                  </div>

                  <div className="lh__item-actions">
                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() => handleCopyLink(hub)}
                      title="Salin link publik"
                    >
                      <Copy size={14} /> Salin
                    </button>

                    <button
                      type="button"
                      className={`lh__btn-action ${
                        isOpen ? "lh__btn-action--active" : ""
                      }`}
                      onClick={() => handleToggleHub(hub)}
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp size={14} /> Tutup
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Kelola Link
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() => startEditLinkHub(hub)}
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() =>
                        setShowHubQr(showQr ? false : { id: hub.id })
                      }
                    >
                      <QrCode size={14} /> QR
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() => toggleLinkHubStatus(hub)}
                    >
                      <Power size={14} />
                      {hub.status ? "Nonaktifkan" : "Aktifkan"}
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action lh__btn-action--danger"
                      onClick={() => handleDeleteLinkHub(hub)}
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>

                  {showQr && (
                    <div className="lh__qr-wrapper">
                      <QRCodeCanvas
                        value={`${window.location.origin}/${hub.short_code}?source=qr`}
                        size={1500}
                        level="H"
                        includeMargin={true}
                        data-hub-id={hub.id}
                        style={{ width: "200px", height: "200px" }}
                        imageSettings={{
                          src: "/Lambang_Kabupaten_Landak.png",
                          height: 300,
                          width: 250,
                          excavate: true,
                        }}
                      />
                      <button
                        type="button"
                        className="lh__btn-secondary"
                        onClick={() => {
                          const canvas = document.querySelector(
                            `canvas[data-hub-id="${hub.id}"]`,
                          );
                          if (!canvas) return;
                          const link = document.createElement("a");
                          link.download = `QR-LinkHub-${hub.short_code}.png`;
                          link.href = canvas.toDataURL("image/png");
                          link.click();
                        }}
                      >
                        <Download size={14} /> Download QR
                      </button>
                    </div>
                  )}

                  {isOpen && (
                    <div className="lh__inner">
                      <div className="lh__inner-header">
                        <h4 className="lh__inner-title">
                          {editingLinkItem ? "Edit Link" : "Tambah Link"}
                        </h4>
                      </div>

                      {linkItemError && (
                        <div className="lh__error">{linkItemError}</div>
                      )}

                      <form
                        className="lh__inner-form"
                        onSubmit={
                          editingLinkItem
                            ? (e) => editLinkItem(e, hub.id, editingLinkItem.id)
                            : addLinkItem
                        }
                      >
                        <div className="lh__field-row">
                          <div className="lh__field">
                            <label>
                              Judul Link <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              className="lh__input"
                              type="text"
                              placeholder="Contoh: Website Resmi"
                              value={linkItemForm.title}
                              onChange={(e) =>
                                setLinkItemForm({
                                  ...linkItemForm,
                                  title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="lh__field">
                            <label>
                              URL <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              className="lh__input"
                              type="url"
                              placeholder="https://contoh.com"
                              value={linkItemForm.url}
                              onChange={(e) =>
                                setLinkItemForm({
                                  ...linkItemForm,
                                  url: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="lh__form-actions">
                          {editingLinkItem ? (
                            <button
                              type="button"
                              className="lh__btn-secondary"
                              onClick={() => {
                                setEditingLinkItem(null);
                                setLinkItemForm({ title: "", url: "" });
                              }}
                            >
                              Batal
                            </button>
                          ) : null}
                          <button
                            type="submit"
                            className="lh__submit lh__submit--inline"
                            disabled={linkItemLoading}
                          >
                            {linkItemLoading
                              ? "Menyimpan..."
                              : editingLinkItem
                                ? "Simpan Perubahan"
                                : "Tambah Link"}
                          </button>
                        </div>
                      </form>

                      <div className="lh__inner-list">
                        <h4 className="lh__inner-title">
                          Daftar Link ({itemCount})
                        </h4>

                        {itemCount === 0 ? (
                          <p className="lh__inner-empty">
                            Belum ada link. Tambahkan link pertama.
                          </p>
                        ) : (
                          [...(hub.items || [])]
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((item) => (
                              <div key={item.id} className="lh__link-row">
                                <div className="lh__link-info">
                                  <div className="lh__link-top">
                                    <strong>{item.title}</strong>
                                    <span
                                      className={`lh__badge ${
                                        item.status
                                          ? "lh__badge--active"
                                          : "lh__badge--inactive"
                                      }`}
                                    >
                                      {item.status ? "Aktif" : "Nonaktif"}
                                    </span>
                                  </div>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="lh__link-url"
                                  >
                                    {item.url}
                                  </a>
                                </div>

                                <div className="lh__link-actions">
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Naik"
                                    onClick={() =>
                                      moveLinkItem(hub.id, item.id, "up")
                                    }
                                  >
                                    <ArrowUp size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Turun"
                                    onClick={() =>
                                      moveLinkItem(hub.id, item.id, "down")
                                    }
                                  >
                                    <ArrowDown size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Toggle Status"
                                    onClick={() =>
                                      toggleLinkItemStatus(hub.id, item.id)
                                    }
                                  >
                                    <Power size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Edit"
                                    onClick={() => {
                                      setEditingLinkItem(item);
                                      setLinkItemForm({
                                        title: item.title,
                                        url: item.url,
                                      });
                                    }}
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn lh__icon-btn--danger"
                                    title="Hapus"
                                    onClick={() =>
                                      deleteLinkItem(hub.id, item.id)
                                    }
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LinkHub;
