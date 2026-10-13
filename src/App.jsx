import { useState, useEffect, lazy, Suspense } from "react";

import Login from "./Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Lazy load — komponen ini baru di-download saat dibuka
const Dashboard = lazy(() => import("./components/Dashboard"));
const ShortLink = lazy(() => import("./components/ShortLink"));
const LinkHub = lazy(() => import("./components/LinkHub"));
const Statistik = lazy(() => import("./components/Statistik"));
const Users = lazy(() => import("./components/Users"));
const Feedback = lazy(() => import("./components/Feedback"));
const Profile = lazy(() => import("./components/Profile"));
const LockedAlias = lazy(() => import("./components/LockedAlias"));
const Pengaturan = lazy(() => import("./components/Pengaturan"));

import "./components/PublicLinkHub.css";
import { useToast } from "./components/Toast";
import { useConfirm } from "./components/ConfirmModal";
import NotificationModal from "./components/NotificationModal";
import "./App.css";

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const toast = useToast();

  const confirm = useConfirm();

  // =====================================================
  // PUBLIC LINK HUB
  // =====================================================

  const [publicHub, setPublicHub] = useState(null);
  const [publicHubLoading, setPublicHubLoading] = useState(true);
  const [publicHubError, setPublicHubError] = useState("");

  const [publicHubErrorCode, setPublicHubErrorCode] = useState(null);
  const [publicHubLockedUnit, setPublicHubLockedUnit] = useState("");
  const [lockedShortLink, setLockedShortLink] = useState(null);
  const [lockedShortLinkUnit, setLockedShortLinkUnit] = useState("");

  // Daftar halaman yang di-handle React (bukan public link hub)
  const RESERVED_PATHS = [
    "dashboard",
    "shortlink",
    "linkhub",
    "statistik",
    "saran",
    "feedback-list",
    "users",
    "locked-aliases",
    "pengaturan",
    "login",
    "register",
  ];

  const pathParts = window.location.pathname.split("/").filter(Boolean);

  const isPublicHub =
    pathParts.length === 1 && !RESERVED_PATHS.includes(pathParts[0]);

  // =====================================================
  // STATE
  // =====================================================

  const [activePage, setActivePage] = useState("dashboard");

  // =====================================================
  // STATE — NOTIFICATION MODAL
  // =====================================================
  const [notifModal, setNotifModal] = useState({
    isOpen: false,
    variant: "info",
    emoji: "ℹ️",
    title: "",
    message: "",
  });

  // =====================================================
  // URL SYNC — baca URL saat pertama load
  // =====================================================
  useEffect(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");

    if (path && RESERVED_PATHS.includes(path)) {
      setActivePage(path);
    } else if (!path) {
      const search = window.location.search;
      const hasGoogleToken = search.includes("google_token");
      const hasLockedLink = search.includes("locked_link");

      if (!hasGoogleToken && !hasLockedLink) {
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, []);

  // =====================================================
  // URL SYNC — listen tombol back/forward browser
  // =====================================================
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, "");

      if (path && RESERVED_PATHS.includes(path)) {
        setActivePage(path);
      } else {
        setActivePage("dashboard");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // =====================================================
  // DETEKSI SHORT LINK TERKUNCI (dari query ?locked_link=)
  // =====================================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lockedLink = params.get("locked_link");
    const lockedUnit = params.get("unit");

    if (!lockedLink) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setLockedShortLink(lockedLink);
      setLockedShortLinkUnit(lockedUnit || "");
      return;
    }

    fetch(`${API_URL}/api/short-links/${lockedLink}/resolve`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const result = await response.json();

        if (response.ok && result.original_url) {
          window.location.replace(result.original_url);
          return;
        }

        setLockedShortLink(lockedLink);
        setLockedShortLinkUnit(lockedUnit || "");
      })
      .catch(() => {
        setLockedShortLink(lockedLink);
        setLockedShortLinkUnit(lockedUnit || "");
      });
  }, [API_URL]);

  // =====================================================
  // Navigation helper
  // =====================================================
  const navigateTo = (page, resetProfile = true) => {
    setActivePage(page);
    if (resetProfile) {
      setShowProfile(false);
    }
    window.history.pushState({}, "", `/${page}`);
  };

  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [feedbackType, setFeedbackType] = useState("saran");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showEditUserPassword, setShowEditUserPassword] = useState(false);

  const getFeedbackBadge = (type) => {
    const badges = {
      saran: { label: "Saran", background: "#dcfce7", color: "#15803d" },
      masukan: { label: "Masukan", background: "#ffedd5", color: "#c2410c" },
      kendala: { label: "Kendala", background: "#dbeafe", color: "#1d4ed8" },
      lainnya: { label: "Lainnya", background: "#f1f5f9", color: "#475569" },
    };

    return badges[type] || badges.lainnya;
  };

  const [user, setUser] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // ROLE CHECKS — SUPPORT admin_unit
  // =====================================================
  const currentRole = String(user?.role || "").toLowerCase();

  const isSuperAdmin = currentRole === "super_admin";
  const isAdminUnit = currentRole === "admin_unit";

  const isAdmin =
    currentRole === "admin" ||
    currentRole === "super_admin" ||
    currentRole === "admin_unit";

  const [showUnitKerjaForm, setShowUnitKerjaForm] = useState(false);
  const [selectedUnitKerja, setSelectedUnitKerja] = useState("");
  const [unitKerjaOptions, setUnitKerjaOptions] = useState([]);
  const [unitKerjaLoading, setUnitKerjaLoading] = useState(false);
  const [unitKerjaSaving, setUnitKerjaSaving] = useState(false);
  const [unitKerjaError, setUnitKerjaError] = useState("");

  // =====================================================
  // SHORT LINK
  // =====================================================

  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [shortLinkType, setShortLinkType] = useState("UMUM");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortLinks, setShortLinks] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [statsDays, setStatsDays] = useState(7);
  const [todayClicks, setTodayClicks] = useState(0);
  const [monthClicks, setMonthClicks] = useState(0);

  const [editingShortLink, setEditingShortLink] = useState(null);
  const [editShortLinkForm, setEditShortLinkForm] = useState({
    original_url: "",
    short_code: "",
    title: "",
  });
  const [editShortLinkLoading, setEditShortLinkLoading] = useState(false);
  const [editShortLinkError, setEditShortLinkError] = useState("");

  // =====================================================
  // DATA USER ADMIN
  // =====================================================

  const [adminUsers, setAdminUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [unitKerjas, setUnitKerjas] = useState([]);

  const [adminStats, setAdminStats] = useState(null);
  const [qrScans, setQrScans] = useState(0);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "UMUM",
    role: "user",
    unit_kerja_id: "",
  });
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [userFormError, setUserFormError] = useState("");

  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "UMUM",
    role: "user",
    unit_kerja_id: "",
  });
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState("");

  // =====================================================
  // LINK HUB
  // =====================================================

  const [linkHubs, setLinkHubs] = useState([]);
  const [linkHubLoading, setLinkHubLoading] = useState(false);
  const [linkHubError, setLinkHubError] = useState("");
  const [showLinkHubForm, setShowLinkHubForm] = useState(false);
  const [linkHubForm, setLinkHubForm] = useState({
    title: "",
    description: "",
    short_code: "",
    type: "UMUM",
  });

  // ✨ STATE BARU: Logo untuk Link Hub
  const [logoFile, setLogoFile] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  const [editingLinkHub, setEditingLinkHub] = useState(null);
  const [editLinkHubForm, setEditLinkHubForm] = useState({
    title: "",
    description: "",
    short_code: "",
    type: "UMUM",
  });
  const [editLinkHubLoading, setEditLinkHubLoading] = useState(false);
  const [editLinkHubError, setEditLinkHubError] = useState("");

  const [selectedHub, setSelectedHub] = useState(null);
  const [showHubQr, setShowHubQr] = useState(false);

  const [linkItemForm, setLinkItemForm] = useState({ title: "", url: "" });
  const [editingLinkItem, setEditingLinkItem] = useState(null);
  const [linkItemLoading, setLinkItemLoading] = useState(false);
  const [linkItemError, setLinkItemError] = useState("");

  // =====================================================
  // PUBLIC LINK HUB
  // =====================================================

  useEffect(() => {
    if (!isPublicHub) {
      setPublicHubLoading(false);
      return;
    }

    const path = window.location.pathname;
    const shortCode = path.replace(/^\/+/, "").replace(/\/$/, "");

    if (!shortCode) {
      setPublicHubError("Link Hub tidak ditemukan.");
      setPublicHubLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const headers = { Accept: "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${API_URL}/api/public/link-hubs/${shortCode}`, { headers })
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          if (result.error_code) {
            setPublicHubErrorCode(result.error_code);
            setPublicHubLockedUnit(result.locked_unit_kerja || "");
          }
          throw new Error(
            result.message || "Link Hub tidak ditemukan atau tidak aktif.",
          );
        }

        return result;
      })
      .then((result) => {
        setPublicHub(result.data);
        setPublicHubLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil Link Hub:", error);
        setPublicHubError(error.message);
        setPublicHubLoading(false);
      });
  }, [isPublicHub]);

  // =====================================================
  // CEK LOGIN
  // =====================================================

  useEffect(() => {
    if (isPublicHub) {
      setCheckingLogin(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCheckingLogin(false);
      return;
    }

    fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token tidak valid");
        }
        return response.json();
      })
      .then((result) => {
        setUser(result);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setCheckingLogin(false);
      });
  }, [isPublicHub]);

  // =====================================================
  // AMBIL DATA SHORT LINK
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(
      isAdmin
        ? `${API_URL}/api/admin/short-links`
        : `${API_URL}/api/short-links`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data short link");
        }
        return response.json();
      })
      .then((result) => {
        setShortLinks(result.data || []);
      })
      .catch((error) => {
        console.error("Gagal mengambil data:", error);
      });
  }, [user]);

  // =====================================================
  // AMBIL DATA LINK HUB
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLinkHubLoading(true);

    fetch(`${API_URL}/api/link-hubs`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data Link Hub");
        }
        return response.json();
      })
      .then((result) => {
        setLinkHubs(result.data || []);
        setLinkHubError("");
      })
      .catch((error) => {
        console.error("Gagal mengambil data Link Hub:", error);
        setLinkHubError(error.message);
      })
      .finally(() => {
        setLinkHubLoading(false);
      });
  }, [user]);

  // =====================================================
  // AMBIL DATA STATISTIK
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/short-links/stats?days=${statsDays}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data statistik");
        }
        return response.json();
      })
      .then((result) => {
        setStatsData(result.data || []);
      })
      .catch((error) => {
        console.error("Gagal mengambil statistik:", error);
      });
  }, [user, statsDays]);

  // =====================================================
  // AMBIL KLIK HARI INI & BULAN INI
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/short-links/today-clicks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setTodayClicks(result.total_clicks_today ?? 0);
      })
      .catch((error) => {
        console.error("Gagal mengambil klik hari ini:", error);
      });

    fetch(`${API_URL}/api/short-links/month-clicks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setMonthClicks(result.total_clicks_this_month ?? 0);
      })
      .catch((error) => {
        console.error("Gagal mengambil klik bulan ini:", error);
      });
  }, [user]);

  // =====================================================
  // AMBIL DATA USER ADMIN
  // =====================================================

  useEffect(() => {
    if (!user || !isAdmin) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data user");
        }
        return response.json();
      })
      .then((result) => {
        setAdminUsers(result.data || []);
      })
      .catch((error) => {
        console.error("Gagal mengambil data user:", error);
      });
  }, [user]);

  // =====================================================
  // AMBIL DATA UNIT KERJA
  // =====================================================

  useEffect(() => {
    if (!user || !isAdmin) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/admin/unit-kerjas`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data unit kerja");
        }
        return response.json();
      })
      .then((result) => {
        setUnitKerjas(result.data || []);
      })
      .catch((error) => {
        console.error("Gagal mengambil unit kerja:", error);
      });
  }, [user, isAdmin]);

  // =====================================================
  // AMBIL STATISTIK ADMIN (PARALLEL FETCH)
  // =====================================================

  useEffect(() => {
    if (!user || !isAdmin) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const fetchAdminStats = fetch(`${API_URL}/api/admin/statistics`, {
      method: "GET",
      headers,
    }).then((response) => response.json());

    const fetchQrScans = fetch(`${API_URL}/api/short-links/qr-scans`, {
      method: "GET",
      headers,
    }).then((response) => response.json());

    Promise.all([fetchAdminStats, fetchQrScans])
      .then(([statsResult, qrResult]) => {
        setAdminStats(statsResult.data || null);
        setQrScans(qrResult.total_qr_scans || 0);
      })
      .catch((error) => {
        console.error("Gagal mengambil statistik admin:", error);
        setQrScans(0);
      });
  }, [user, isAdmin]);

  // =====================================================
  // LOGIN BERHASIL
  // =====================================================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    const role = String(loggedInUser.role || "").toLowerCase();
    const userType = String(loggedInUser.user_type || "").toUpperCase();

    if (role === "admin" || role === "super_admin" || role === "admin_unit") {
      setShowUnitKerjaForm(false);
      return;
    }

    if (userType === "UMUM") {
      setShowUnitKerjaForm(false);
      return;
    }

    if (!loggedInUser.unit_kerja_id) {
      setShowUnitKerjaForm(true);
    } else {
      setShowUnitKerjaForm(false);
    }
  };

  // =====================================================
  // SIMPAN UNIT KERJA USER
  // =====================================================

  const handleSaveUnitKerja = async () => {
    if (!selectedUnitKerja) {
      setUnitKerjaError("Silakan pilih unit kerja terlebih dahulu.");
      return;
    }

    try {
      setUnitKerjaSaving(true);
      setUnitKerjaError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/user/unit-kerja`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unit_kerja_id: selectedUnitKerja,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan unit kerja.");
      }

      setUser(result.user);
      setShowUnitKerjaForm(false);
      setSelectedUnitKerja("");
      toast.success("Unit kerja berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan unit kerja:", error);
      setUnitKerjaError(error.message);
      toast.error(error.message);
    } finally {
      setUnitKerjaSaving(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackTitle.trim()) {
      setFeedbackError("Judul masukan wajib diisi.");
      setTimeout(() => {
        setFeedbackError("");
      }, 4000);
      return;
    }

    if (!feedbackMessage.trim()) {
      setFeedbackError("Saran atau masukan wajib diisi.");
      setTimeout(() => {
        setFeedbackError("");
      }, 4000);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: feedbackType,
          title: feedbackTitle,
          message: feedbackMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("FEEDBACK ERROR:", result);

        const errorMessage = result.errors
          ? Object.values(result.errors)[0]?.[0]
          : result.message;

        setFeedbackError(errorMessage || "Gagal mengirim masukan.");
        setTimeout(() => {
          setFeedbackError("");
        }, 4000);
        return;
      }

      setFeedbackSuccess("Saran dan masukan berhasil dikirim.");
      setFeedbackTitle("");
      setFeedbackMessage("");
      setFeedbackType("saran");

      setTimeout(() => {
        setFeedbackSuccess("");
      }, 4000);
    } catch (error) {
      console.error("FEEDBACK ERROR:", error);
      setFeedbackError("Tidak dapat terhubung ke server.");
      setTimeout(() => {
        setFeedbackError("");
      }, 4000);
    }
  };

  // =====================================================
  // AUTO-CHECK: Sembunyikan form "Lengkapi Profil" untuk user UMUM
  // =====================================================
  useEffect(() => {
    if (!user) return;

    const role = String(user.role || "").toLowerCase();
    const userType = String(user.user_type || "").toUpperCase();

    if (
      role === "admin" ||
      role === "super_admin" ||
      role === "admin_unit" ||
      userType === "UMUM"
    ) {
      setShowUnitKerjaForm(false);
      return;
    }

    if (!user.unit_kerja_id) {
      setShowUnitKerjaForm(true);
    } else {
      setShowUnitKerjaForm(false);
    }
  }, [user]);

  // =====================================================
  // AMBIL DAFTAR UNIT KERJA UNTUK USER
  // =====================================================

  useEffect(() => {
    if (!showUnitKerjaForm) return;

    setUnitKerjaLoading(true);
    setUnitKerjaError("");

    fetch(`${API_URL}/api/unit-kerjas`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil daftar unit kerja.");
        }
        return response.json();
      })
      .then((result) => {
        setUnitKerjaOptions(result.data || []);
      })
      .catch((error) => {
        console.error("Gagal mengambil unit kerja:", error);
        setUnitKerjaError(error.message);
      })
      .finally(() => {
        setUnitKerjaLoading(false);
      });
  }, [showUnitKerjaForm]);

  // =====================================================
  // AMBIL DATA SARAN & MASUKAN UNTUK ADMIN
  // =====================================================

  const loadFeedbacksData = async () => {
    try {
      setFeedbackLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/admin/feedbacks`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("FEEDBACK LIST ERROR:", result);
        return;
      }

      setFeedbacks(result.data || []);
    } catch (error) {
      console.error("FEEDBACK LIST ERROR:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleLoadFeedbacks = async () => {
    await loadFeedbacksData();
    navigateTo("feedback-list");
  };

  const handleDeleteFeedback = async (feedback) => {
    const yakin = await confirm({
      title: "Hapus Masukan",
      message: `Yakin ingin menghapus masukan "${feedback.title}"?`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      type: "danger",
    });

    if (!yakin) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi login tidak ditemukan.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/feedbacks/${feedback.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus masukan.");
      }

      setFeedbacks((prev) => prev.filter((item) => item.id !== feedback.id));

      if (selectedFeedback?.id === feedback.id) {
        setSelectedFeedback(null);
      }

      toast.success("Saran & masukan berhasil dihapus.");
    } catch (error) {
      console.error("DELETE FEEDBACK ERROR:", error);
      toast.error(error.message);
    }
  };

  const toggleLinkHubStatus = async (hub) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/link-hubs/${hub.id}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status Link Hub.");
      }

      setLinkHubs((prevHubs) =>
        prevHubs.map((item) =>
          item.id === hub.id ? { ...item, ...result.data } : item,
        ),
      );

      setSelectedHub((prev) => {
        if (!prev || prev.id !== hub.id) return prev;
        return { ...prev, ...result.data };
      });

      toast.success(result.message);
    } catch (error) {
      console.error("Gagal mengubah status Link Hub:", error);
      toast.error(error.message || "Gagal mengubah status Link Hub.");
    }
  };

  const handleDeleteLinkHub = async (hub) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    const yakin = await confirm({
      title: "Hapus Link Hub",
      message: `Yakin ingin menghapus Link Hub "${hub.title}"?`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      type: "danger",
    });

    if (!yakin) return;

    try {
      const response = await fetch(`${API_URL}/api/link-hubs/${hub.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus Link Hub.");
      }

      setLinkHubs((prevHubs) => prevHubs.filter((item) => item.id !== hub.id));

      if (selectedHub && selectedHub.id === hub.id) {
        setSelectedHub(null);
      }

      if (editingLinkHub && editingLinkHub.id === hub.id) {
        setEditingLinkHub(null);
        setEditLinkHubForm({
          title: "",
          description: "",
          short_code: "",
          type: "UMUM",
        });
        setEditLinkHubError("");
      }

      if (showHubQr && showHubQr.id === hub.id) {
        setShowHubQr(false);
      }

      // ✨ Modal card notifikasi
      setNotifModal({
        isOpen: true,
        variant: "success",
        emoji: "🗑️",
        title: "Link Hub Berhasil Dihapus",
        message: `Link Hub "${hub.title}" telah dihapus dari sistem.`,
      });
    } catch (error) {
      console.error("Gagal menghapus Link Hub:", error);
      toast.error(error.message || "Gagal menghapus Link Hub.");
    }
  };

  const startEditLinkHub = (hub) => {
    setEditingLinkHub({
      id: hub.id,
      title: hub.title || "",
      description: hub.description || "",
      short_code: hub.short_code || "",
      logo_url: hub.logo_url || null,
    });

    setEditLinkHubForm({
      title: hub.title || "",
      description: hub.description || "",
      short_code: hub.short_code || "",
      type: hub.type || "UMUM",
      locked_unit_kerja_id: hub.locked_unit_kerja_id || "",
    });

    // ✨ Reset state logo setiap kali mulai edit
    setLogoFile(null);
    setRemoveLogo(false);
    setEditLinkHubError("");
  };

  const handleUpdateLinkHub = async () => {
    if (!editingLinkHub) {
      setEditLinkHubError("Link Hub yang sedang diedit tidak ditemukan.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setEditLinkHubError("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    const titleValue = editLinkHubForm.title.trim();
    const descriptionValue = editLinkHubForm.description.trim();
    const shortCodeValue = editLinkHubForm.short_code.trim();

    if (!titleValue) {
      setEditLinkHubError("Judul Link Hub wajib diisi.");
      return;
    }

    if (!shortCodeValue) {
      setEditLinkHubError("Alias Link Hub wajib diisi.");
      return;
    }

    try {
      setEditLinkHubLoading(true);
      setEditLinkHubError("");

      const updateUrl = `${API_URL}/api/link-hubs/${editingLinkHub.id}`;

      // ✨ Pakai FormData karena ada upload file logo
      const formData = new FormData();
      formData.append("title", titleValue);
      formData.append("description", descriptionValue || "");
      formData.append("short_code", shortCodeValue);
      formData.append("type", editLinkHubForm.type || "UMUM");
      formData.append(
        "locked_unit_kerja_id",
        editLinkHubForm.locked_unit_kerja_id || "",
      );
      formData.append("_method", "PUT"); // ← Laravel method spoofing

      if (logoFile) {
        formData.append("logo", logoFile);
      }
      if (removeLogo) {
        formData.append("remove_logo", "true");
      }

      const response = await fetch(updateUrl, {
        method: "POST", // ← POST + _method=PUT untuk FormData
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Response bukan JSON:", responseText);
        throw new Error(
          `Server mengembalikan response yang tidak valid (HTTP ${response.status}).`,
        );
      }

      if (!response.ok) {
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage ||
            result.message ||
            `Gagal memperbarui Link Hub (HTTP ${response.status}).`,
        );
      }

      if (!result.data) {
        throw new Error(
          "Server berhasil merespons, tetapi data Link Hub tidak ditemukan.",
        );
      }

      setLinkHubs((prevHubs) =>
        prevHubs.map((hub) =>
          hub.id === editingLinkHub.id ? { ...hub, ...result.data } : hub,
        ),
      );

      setSelectedHub((prev) => {
        if (!prev || prev.id !== editingLinkHub.id) return prev;
        return { ...prev, ...result.data };
      });

      setEditingLinkHub(null);

      setEditLinkHubForm({
        title: "",
        description: "",
        short_code: "",
        type: "UMUM",
        locked_unit_kerja_id: "",
      });

      // ✨ Reset state logo setelah sukses
      setLogoFile(null);
      setRemoveLogo(false);

      setEditLinkHubError("");

      // ✨ Modal card notifikasi
      setNotifModal({
        isOpen: true,
        variant: "success",
        emoji: "✅",
        title: "Link Hub Berhasil Diperbarui",
        message: "Perubahan pada Link Hub sudah tersimpan.",
      });
    } catch (error) {
      console.error("GAGAL UPDATE LINK HUB:", error);
      setEditLinkHubError(error.message || "Gagal memperbarui Link Hub.");
      toast.error(error.message || "Gagal memperbarui Link Hub.");
    } finally {
      setEditLinkHubLoading(false);
    }
  };

  // =====================================================
  // CREATE LINK HUB — DENGAN LOGIKA KHUSUS OPD
  // =====================================================

  const createLinkHub = async (
    e,
    aliasOverride = null,
    lockedUnitKerjaId = null,
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setLinkHubError("Token login tidak ditemukan.");
      return;
    }

    if (!linkHubForm.title) {
      setLinkHubError("Judul Link Hub wajib diisi.");
      return;
    }

    const finalAlias = aliasOverride || linkHubForm.short_code;

    if (!finalAlias) {
      setLinkHubError("Alias Link Hub wajib diisi.");
      return;
    }

    try {
      setLinkHubLoading(true);
      setLinkHubError("");

      // ✨ Pakai FormData karena ada upload file logo
      const formData = new FormData();
      formData.append("title", linkHubForm.title);
      formData.append("description", linkHubForm.description || "");
      formData.append("short_code", finalAlias);
      formData.append("type", linkHubForm.type);
      formData.append("locked_unit_kerja_id", lockedUnitKerjaId || "");

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch(`${API_URL}/api/link-hubs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // ✨ LOGIKA KHUSUS LINK HUB: Jika alias sudah dimiliki oleh OPD user
        if (result.error_code === "alias_already_owned_by_you") {
          setNotifModal({
            isOpen: true,
            variant: "info",
            emoji: "ℹ️",
            title: "Alias Sudah Dimiliki OPD Anda",
            message:
              "Anda sudah memiliki Link Hub dengan alias ini. Sistem akan mengarahkan Anda ke halaman edit.",
          });

          setShowLinkHubForm(false);

          const existingHub = linkHubs.find(
            (hub) => hub.id === result.existing_id,
          );
          if (existingHub) {
            startEditLinkHub(existingHub);
          }
          return;
        }

        // ✨ LOGIKA KHUSUS LINK HUB: Jika alias terkunci untuk OPD lain
        if (result.error_code === "alias_locked_to_other") {
          setNotifModal({
            isOpen: true,
            variant: "error",
            emoji: "🚫",
            title: "Alias Terkunci OPD Lain",
            message:
              "Alias ini sudah digunakan dan dikunci oleh OPD lain. Silakan pilih alias yang berbeda.",
          });
          return;
        }

        // Error biasa (termasuk alias duplikat biasa)
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage || result.message || "Gagal membuat Link Hub.",
        );
      }

      setLinkHubs((prev) => [result.data, ...prev]);

      setLinkHubForm({
        title: "",
        description: "",
        short_code: "",
        type: "UMUM",
      });

      // ✨ Reset state logo setelah sukses
      setLogoFile(null);
      setRemoveLogo(false);

      setShowLinkHubForm(false);
      setLinkHubError("");

      // ✨ Modal card notifikasi (bukan toast)
      setNotifModal({
        isOpen: true,
        variant: "success",
        emoji: "✅",
        title: "Link Hub Berhasil Dibuat",
        message: `Link Hub "${linkHubForm.title}" berhasil dibuat dan siap digunakan.`,
      });
    } catch (error) {
      console.error("Gagal membuat Link Hub:", error);
      setLinkHubError(error.message);
      toast.error(error.message);
    } finally {
      setLinkHubLoading(false);
    }
  };

  // =====================================================
  // ADD LINK ITEM KE LINK HUB — DENGAN CEK KONTEN SENSITIF
  // =====================================================

  const addLinkItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setLinkItemError("Token login tidak ditemukan.");
      return;
    }

    if (!selectedHub) {
      setLinkItemError("Link Hub belum dipilih.");
      return;
    }

    if (!linkItemForm.title) {
      setLinkItemError("Judul link wajib diisi.");
      return;
    }

    if (!linkItemForm.url) {
      setLinkItemError("URL wajib diisi.");
      return;
    }

    try {
      setLinkItemLoading(true);
      setLinkItemError("");

      const response = await fetch(
        `${API_URL}/api/link-hubs/${selectedHub.id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: linkItemForm.title,
            url: linkItemForm.url,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // ✨ KONTEN SENSITIF — Pakai MODAL
        if (result.error_code === "blocked_content") {
          setNotifModal({
            isOpen: true,
            variant: "error",
            emoji: "🚫",
            title: "Link Diblokir",
            message: result.message,
          });
          return;
        }

        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage || result.message || "Gagal menambahkan link.",
        );
      }

      const newItem = result.data;

      setSelectedHub((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: [...(prev.items || []), newItem],
        };
      });

      setLinkHubs((prev) =>
        prev.map((hub) =>
          hub.id === selectedHub.id
            ? {
                ...hub,
                items: [...(hub.items || []), newItem],
              }
            : hub,
        ),
      );

      setLinkItemForm({ title: "", url: "" });
      setLinkItemError("");

      toast.success("Link berhasil ditambahkan.");
    } catch (error) {
      console.error("Gagal menambahkan link:", error);
      setLinkItemError(error.message);
      toast.error(error.message);
    } finally {
      setLinkItemLoading(false);
    }
  };

  // =====================================================
  // TOGGLE STATUS LINK ITEM
  // =====================================================

  const toggleLinkItemStatus = async (hubId, itemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Silakan login terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/link-hubs/${hubId}/items/${itemId}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status link.");
      }

      const updatedItem = result.data;

      setLinkHubs((prev) =>
        prev.map((hub) =>
          hub.id === hubId
            ? {
                ...hub,
                items: (hub.items || []).map((item) =>
                  item.id === itemId ? updatedItem : item,
                ),
              }
            : hub,
        ),
      );

      setSelectedHub((prev) =>
        prev
          ? {
              ...prev,
              items: (prev.items || []).map((item) =>
                item.id === itemId ? updatedItem : item,
              ),
            }
          : prev,
      );

      toast.success(
        updatedItem.status
          ? "Link berhasil diaktifkan."
          : "Link berhasil dinonaktifkan.",
      );
    } catch (error) {
      console.error("Gagal mengubah status link:", error);
      toast.error(error.message || "Gagal mengubah status link.");
    }
  };

  // =====================================================
  // EDIT LINK ITEM — DENGAN CEK KONTEN SENSITIF
  // =====================================================

  const editLinkItem = async (e, hubId, itemId) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Silakan login terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/link-hubs/${hubId}/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: linkItemForm.title,
            url: linkItemForm.url,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // ✨ KONTEN SENSITIF — Pakai MODAL
        if (result.error_code === "blocked_content") {
          setNotifModal({
            isOpen: true,
            variant: "error",
            emoji: "🚫",
            title: "Link Diblokir",
            message: result.message,
          });
          return;
        }

        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage || result.message || "Gagal memperbarui link.",
        );
      }

      const updatedItem = result.data;

      setLinkHubs((prev) =>
        prev.map((hub) =>
          hub.id === hubId
            ? {
                ...hub,
                items: (hub.items || []).map((item) =>
                  item.id === itemId ? updatedItem : item,
                ),
              }
            : hub,
        ),
      );

      setSelectedHub((prev) =>
        prev
          ? {
              ...prev,
              items: (prev.items || []).map((item) =>
                item.id === itemId ? updatedItem : item,
              ),
            }
          : prev,
      );

      setEditingLinkItem(null);
      setLinkItemForm({ title: "", url: "" });

      toast.success("Link berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal memperbarui link:", error);
      toast.error(error.message || "Gagal memperbarui link.");
    }
  };

  const moveLinkItem = async (hubId, itemId, direction) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Silakan login terlebih dahulu.");
      return;
    }

    try {
      const hub = linkHubs.find((hub) => hub.id === hubId);

      if (!hub || !hub.items) return;

      const items = [...hub.items].sort((a, b) => a.sort_order - b.sort_order);

      const currentIndex = items.findIndex((item) => item.id === itemId);

      if (currentIndex === -1) return;

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= items.length) return;

      const currentItem = items[currentIndex];
      const targetItem = items[targetIndex];

      const currentOrder = currentItem.sort_order;
      const targetOrder = targetItem.sort_order;

      const response1 = await fetch(
        `${API_URL}/api/link-hubs/${hubId}/items/${currentItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: currentItem.title,
            url: currentItem.url,
            sort_order: targetOrder,
          }),
        },
      );

      const response2 = await fetch(
        `${API_URL}/api/link-hubs/${hubId}/items/${targetItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: targetItem.title,
            url: targetItem.url,
            sort_order: currentOrder,
          }),
        },
      );

      const result1 = await response1.json();
      const result2 = await response2.json();

      if (!response1.ok || !response2.ok) {
        throw new Error(
          result1.message || result2.message || "Gagal mengubah urutan link.",
        );
      }

      const updatedCurrentItem = result1.data;
      const updatedTargetItem = result2.data;

      const newItems = items.map((item) => {
        if (item.id === updatedCurrentItem.id) return updatedCurrentItem;
        if (item.id === updatedTargetItem.id) return updatedTargetItem;
        return item;
      });

      setLinkHubs((prev) =>
        prev.map((hub) =>
          hub.id === hubId ? { ...hub, items: newItems } : hub,
        ),
      );

      setSelectedHub((prev) =>
        prev && prev.id === hubId ? { ...prev, items: newItems } : prev,
      );
    } catch (error) {
      console.error("Gagal mengubah urutan link:", error);
      toast.error(error.message || "Gagal mengubah urutan link.");
    }
  };

  // =====================================================
  // DELETE LINK ITEM
  // =====================================================

  const deleteLinkItem = async (hubId, itemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Silakan login terlebih dahulu.");
      return;
    }

    const yakin = await confirm({
      title: "Hapus Link",
      message: "Apakah Anda yakin ingin menghapus link ini?",
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      type: "danger",
    });

    if (!yakin) return;

    try {
      const response = await fetch(
        `${API_URL}/api/link-hubs/${hubId}/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus link.");
      }

      setLinkHubs((prev) =>
        prev.map((hub) =>
          hub.id === hubId
            ? {
                ...hub,
                items: (hub.items || []).filter((item) => item.id !== itemId),
              }
            : hub,
        ),
      );

      setSelectedHub((prev) =>
        prev
          ? {
              ...prev,
              items: (prev.items || []).filter((item) => item.id !== itemId),
            }
          : prev,
      );

      setEditingLinkItem(null);
      setLinkItemForm({ title: "", url: "" });

      toast.success("Link berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus link:", error);
      toast.error(error.message || "Gagal menghapus link.");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch(`${API_URL}/api/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");

    setUser(null);
    setShortLinks([]);
    setAdminUsers([]);
    setUnitKerjas([]);
    setLinkHubs([]);
    setSelectedHub(null);
    setShortUrl("");
    setShowAddUserForm(false);
    setShowEditUserForm(false);
    setShowLinkHubForm(false);
    setEditingUserId(null);

    window.history.pushState({}, "", "/");
  };

  // =====================================================
  // UBAH PASSWORD
  // =====================================================

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.warning("Password lama wajib diisi.");
      return;
    }

    if (!newPassword) {
      toast.warning("Password baru wajib diisi.");
      return;
    }

    if (newPassword.length < 8) {
      toast.warning("Password baru minimal 8 karakter.");
      return;
    }

    if (!confirmNewPassword) {
      toast.warning("Konfirmasi password wajib diisi.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.warning("Konfirmasi password tidak sama.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Sesi login tidak ditemukan.");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmNewPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah password.");
      }

      toast.success("Password berhasil diubah.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.email) {
          throw new Error("Email tersebut sudah digunakan.");
        }
        throw new Error(result.message || "Gagal memperbarui profil.");
      }

      setUser(result.user);
      setEditingProfile(false);
      toast.success("Profil berhasil diperbarui.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =====================================================
  // TAMBAH USER
  // =====================================================

  const handleAddUser = async (e) => {
    e.preventDefault();

    setUserFormError("");
    setUserFormLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setUserFormError("Sesi login tidak ditemukan.");
      setUserFormLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          user_type: userForm.user_type,
          role: (userForm.role || "user").toLowerCase(),
          unit_kerja_id: userForm.unit_kerja_id
            ? Number(userForm.unit_kerja_id)
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const firstError = Object.values(result.errors)[0];

          if (Array.isArray(firstError)) {
            throw new Error(firstError[0]);
          }

          throw new Error(firstError);
        }

        throw new Error(result.message || "Gagal menambahkan user.");
      }

      setAdminUsers((prevUsers) => [result.data, ...prevUsers]);

      setUserForm({
        name: "",
        email: "",
        password: "",
        user_type: "UMUM",
        role: "user",
        unit_kerja_id: "",
      });

      setShowAddUserForm(false);
      toast.success("User berhasil ditambahkan.");
    } catch (error) {
      setUserFormError(error.message);
      toast.error(error.message);
    } finally {
      setUserFormLoading(false);
    }
  };

  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEditUser = (adminUser) => {
    setShowAddUserForm(false);
    setUserFormError("");

    setEditingUserId(adminUser.id);

    setEditUserForm({
      name: adminUser.name || "",
      email: adminUser.email || "",
      password: "",
      user_type: adminUser.user_type || "UMUM",
      role: adminUser.role || "user",
      unit_kerja_id: adminUser.unit_kerja_id || "",
    });

    setEditUserError("");
    setShowEditUserForm(true);
  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    setEditUserError("");
    setEditUserLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setEditUserError("Sesi login tidak ditemukan.");
      setEditUserLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${editingUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editUserForm.name,
            email: editUserForm.email,
            password: editUserForm.password || null,
            user_type: editUserForm.user_type,
            role: (editUserForm.role || "user").toLowerCase(),
            unit_kerja_id: editUserForm.unit_kerja_id
              ? Number(editUserForm.unit_kerja_id)
              : null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const firstError = Object.values(result.errors)[0];

          if (Array.isArray(firstError)) {
            throw new Error(firstError[0]);
          }

          throw new Error(firstError);
        }

        throw new Error(result.message || "Gagal memperbarui user.");
      }

      setAdminUsers((prevUsers) =>
        prevUsers.map((adminUser) =>
          adminUser.id === editingUserId ? result.data : adminUser,
        ),
      );

      setEditUserForm({
        name: "",
        email: "",
        password: "",
        user_type: "UMUM",
        role: "user",
        unit_kerja_id: "",
      });

      setShowEditUserForm(false);
      setEditingUserId(null);

      toast.success("User berhasil diperbarui.");
    } catch (error) {
      setEditUserError(error.message);
      toast.error(error.message);
    } finally {
      setEditUserLoading(false);
    }
  };

  // =====================================================
  // HAPUS USER
  // =====================================================

  const handleDeleteUser = async (adminUser) => {
    const yakin = await confirm({
      title: "Hapus User",
      message: `Yakin ingin menghapus user "${adminUser.name}"?\n\nAksi ini tidak bisa dibatalkan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      type: "danger",
    });

    if (!yakin) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi login tidak ditemukan.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${adminUser.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus user.");
      }

      setAdminUsers((prev) => prev.filter((u) => u.id !== adminUser.id));

      toast.success("User berhasil dihapus.");
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      toast.error(error.message);
    }
  };

  // =====================================================
  // MEMBUAT SHORT URL — DENGAN CEK KONTEN SENSITIF
  // =====================================================

  const shortenUrl = async (lockedUnitKerjaId = null) => {
    if (!url) {
      toast.warning("Masukkan URL terlebih dahulu");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/short-links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_url: url,
          short_code: alias || null,
          type: shortLinkType,
          title: title || null,
          locked_unit_kerja_id: lockedUnitKerjaId || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // ✨ KONTEN SENSITIF — Pakai MODAL
        if (result.error_code === "blocked_content") {
          setNotifModal({
            isOpen: true,
            variant: "error",
            emoji: "🚫",
            title: "Link Diblokir",
            message: result.message,
          });
          return;
        }

        // ✨ ERROR BIASA (Termasuk Alias Duplikat) — Pakai TOAST
        const errorMessage =
          result.message ||
          (result.errors ? Object.values(result.errors).flat().join(" ") : "");
        throw new Error(errorMessage || "Gagal membuat short URL");
      }

      setShortUrl(`${API_URL}/${result.data.short_code}`);
      setShortLinks((prevLinks) => [result.data, ...prevLinks]);
      setUrl("");
      setAlias("");
      setTitle("");

      toast.success("Short link berhasil dibuat.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MULAI EDIT SHORT LINK
  // =====================================================

  const startEditShortLink = (link) => {
    setEditingShortLink(link);

    setEditShortLinkForm({
      original_url: link.original_url || "",
      short_code: link.short_code || "",
      title: link.title || "",
      locked_unit_kerja_id: link.locked_unit_kerja_id || "",
    });

    setEditShortLinkError("");
  };

  // =====================================================
  // SIMPAN EDIT SHORT LINK — DENGAN CEK KONTEN SENSITIF
  // =====================================================

  const handleEditShortLink = async (e) => {
    e.preventDefault();

    if (!editingShortLink) return;

    setEditShortLinkError("");
    setEditShortLinkLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setEditShortLinkError("Sesi login tidak ditemukan.");
      setEditShortLinkLoading(false);
      return;
    }

    try {
      const response = await fetch(
        isAdmin
          ? `${API_URL}/api/admin/short-links/${editingShortLink.id}`
          : `${API_URL}/api/short-links/${editingShortLink.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            original_url: editShortLinkForm.original_url,
            short_code: editShortLinkForm.short_code,
            title: editShortLinkForm.title || null,
            locked_unit_kerja_id:
              editShortLinkForm.locked_unit_kerja_id || null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // ✨ KONTEN SENSITIF — Pakai MODAL
        if (result.error_code === "blocked_content") {
          setNotifModal({
            isOpen: true,
            variant: "error",
            emoji: "🚫",
            title: "Link Diblokir",
            message: result.message,
          });
          return;
        }

        // ✨ ERROR BIASA (Termasuk Alias Duplikat) — Pakai TOAST
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage ||
            result.message ||
            "Gagal memperbarui short link.",
        );
      }

      setShortLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === editingShortLink.id ? result.data : link,
        ),
      );

      setShortUrl(`${API_URL}/${result.data.short_code}`);
      setEditingShortLink(null);

      setEditShortLinkForm({
        original_url: "",
        short_code: "",
        title: "",
      });

      toast.success("Short link berhasil diperbarui.");
    } catch (error) {
      setEditShortLinkError(error.message);
      toast.error(error.message);
    } finally {
      setEditShortLinkLoading(false);
    }
  };

  // =====================================================
  // BATAL EDIT SHORT LINK
  // =====================================================

  const cancelEditShortLink = () => {
    setEditingShortLink(null);
    setEditShortLinkError("");

    setEditShortLinkForm({
      original_url: "",
      short_code: "",
      title: "",
      locked_unit_kerja_id: "",
    });
  };

  // =====================================================
  // COPY SHORT URL
  // =====================================================

  const copyShortUrl = () => {
    if (!shortUrl) return;

    navigator.clipboard.writeText(shortUrl);
    toast.success("Short URL berhasil disalin");
  };

  // =====================================================
  // DOWNLOAD QR
  // =====================================================

  const downloadQR = (id) => {
    const canvas = document.querySelector(`#qr-${id}`);

    if (!canvas) return;

    const padding = 20;
    const border = 3;

    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width + (padding + border) * 2;
    newCanvas.height = canvas.height + (padding + border) * 2;

    const ctx = newCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = border;
    ctx.strokeRect(
      border / 2,
      border / 2,
      newCanvas.width - border,
      newCanvas.height - border,
    );

    ctx.drawImage(
      canvas,
      padding + border,
      padding + border,
      canvas.width,
      canvas.height,
    );

    const link = document.createElement("a");
    link.download = `QR-Code-${id}.png`;
    link.href = newCanvas.toDataURL("image/png", 1.0);
    link.click();
  };

  // =====================================================
  // AKTIF / NONAKTIF SHORT LINK
  // =====================================================

  const handleToggleShortLink = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi login tidak ditemukan.");
      return;
    }

    try {
      const response = await fetch(
        isAdmin
          ? `${API_URL}/api/admin/short-links/${id}/status`
          : `${API_URL}/api/short-links/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status short link.");
      }

      setShortLinks((prevLinks) =>
        prevLinks.map((link) => (link.id === id ? result.data : link)),
      );

      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =====================================================
  // HAPUS SHORT LINK
  // =====================================================

  const handleDeleteShortLink = async (id) => {
    const confirmDelete = await confirm({
      title: "Hapus Short Link",
      message: "Yakin ingin menghapus short link ini?",
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      type: "danger",
    });

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi login tidak ditemukan.");
      return;
    }

    try {
      const response = await fetch(
        isAdmin
          ? `${API_URL}/api/admin/short-links/${id}`
          : `${API_URL}/api/short-links/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus short link.");
      }

      setShortLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));

      if (
        shortUrl &&
        shortLinks.some(
          (link) =>
            link.id === id && `${API_URL}/${link.short_code}` === shortUrl,
        )
      ) {
        setShortUrl("");
      }

      if (editingShortLink && editingShortLink.id === id) {
        cancelEditShortLink();
      }

      toast.success("Short link berhasil dihapus.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =====================================================
  // STATISTIK DASAR
  // =====================================================

  const totalClicks = shortLinks.reduce(
    (total, link) => total + Number(link.click_count ?? 0),
    0,
  );

  const activeLinks = shortLinks.filter((link) => link.status).length;

  const filteredUsers = adminUsers.filter((adminUser) => {
    const keyword = userSearch.toLowerCase().trim();

    if (!keyword) return true;

    return (
      adminUser.name?.toLowerCase().includes(keyword) ||
      adminUser.email?.toLowerCase().includes(keyword) ||
      adminUser.user_type?.toLowerCase().includes(keyword) ||
      adminUser.role?.toLowerCase().includes(keyword) ||
      adminUser.unit_kerja?.nama_unit_kerja?.toLowerCase().includes(keyword)
    );
  });

  const renderPublicHub = () => {
    if (publicHubLoading) {
      return (
        <div className="pub">
          <div className="pub__loading">
            <div className="pub__spinner" />
            <p>Memuat Link Hub...</p>
          </div>
        </div>
      );
    }

    if (publicHubError) {
      if (publicHubErrorCode === "login_required") {
        return (
          <div className="pub">
            <div className="pub__error-card">
              <div className="pub__error-icon">🔐</div>
              <h1>Perlu Login</h1>
              <p>
                Link Hub ini terkunci untuk{" "}
                <b>{publicHubLockedUnit || "unit kerja tertentu"}</b>. Silakan
                login terlebih dahulu dengan akun yang sesuai.
              </p>
              <a
                href="/"
                className="pub__share-btn pub__share-btn--copy"
                style={{ marginTop: 16, display: "inline-flex" }}
              >
                ← Ke Halaman Login
              </a>
            </div>
          </div>
        );
      }

      if (publicHubErrorCode === "forbidden") {
        return (
          <div className="pub">
            <div className="pub__error-card">
              <div className="pub__error-icon">🔒</div>
              <h1>Link Hub Terkunci</h1>
              <p>
                Link Hub ini hanya dapat diakses oleh unit kerja:
                <br />
                <b>{publicHubLockedUnit || "Tertentu"}</b>
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 8 }}>
                Akun kamu tidak memiliki akses ke unit kerja tersebut.
              </p>
              <a
                href="/"
                className="pub__share-btn pub__share-btn--copy"
                style={{ marginTop: 16, display: "inline-flex" }}
              >
                ← Ke Halaman Utama
              </a>
            </div>
          </div>
        );
      }

      return (
        <div className="pub">
          <div className="pub__error-card">
            <div className="pub__error-icon">🔗</div>
            <h1>Link Hub Tidak Ditemukan</h1>
            <p>{publicHubError}</p>
          </div>
        </div>
      );
    }

    if (!publicHub) {
      return (
        <div className="pub">
          <div className="pub__loading">
            <p>Link Hub tidak ditemukan.</p>
          </div>
        </div>
      );
    }

    const activeItems = (publicHub.items || [])
      .filter((item) => item.status)
      .sort((a, b) => a.sort_order - b.sort_order);

    const publicUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${publicHub.short_code}`
        : "";

    const handleCopyLink = () => {
      navigator.clipboard.writeText(publicUrl);
      toast.success("Link berhasil disalin!");
    };

    return (
      <div className="pub">
        <div className="pub__container">
          <div className="pub__hero">
            <div className="pub__hero-deco" aria-hidden="true">
              <div className="pub__hero-circle pub__hero-circle--1" />
              <div className="pub__hero-circle pub__hero-circle--2" />
            </div>

            <div className="pub__hero-content">
              <div className="pub__logo-wrap">
                {/* ✨ Pakai logo custom kalau ada, kalau tidak pakai logo Kominfo default */}
                <img
                  src={publicHub.logo_url || "/Lambang_Kabupaten_Landak.png"}
                  alt={`Logo ${publicHub.title}`}
                  className="pub__logo"
                />
              </div>

              <span className="pub__badge">✨ PENINK • LINK HUB</span>

              <h1 className="pub__title">{publicHub.title}</h1>

              {publicHub.description && (
                <p className="pub__description">{publicHub.description}</p>
              )}

              <div className="pub__share">
                <button
                  type="button"
                  className="pub__share-btn pub__share-btn--copy"
                  onClick={handleCopyLink}
                  title="Salin link"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Salin Link
                </button>
              </div>
            </div>
          </div>

          <div className="pub__links">
            {activeItems.length > 0 ? (
              activeItems.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub__link"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="pub__link-icon">↗</div>

                  <div className="pub__link-info">
                    <span className="pub__link-title">{item.title}</span>
                    {item.url && (
                      <span className="pub__link-url">
                        {new URL(item.url).hostname.replace("www.", "")}
                      </span>
                    )}
                  </div>

                  <div className="pub__link-arrow">→</div>
                </a>
              ))
            ) : (
              <div className="pub__empty">
                <div className="pub__empty-icon">📭</div>
                <p>Belum ada link aktif pada Link Hub ini.</p>
              </div>
            )}
          </div>

          <footer className="pub__footer">
            <div className="pub__footer-brand">
              <strong>PENINK</strong>
              <span>Platform Short Link &amp; Link Hub</span>
            </div>
            <div className="pub__footer-copy">
              © {new Date().getFullYear()} Diskominfo Kabupaten Landak
            </div>
          </footer>
        </div>
      </div>
    );
  };

  // =====================================================
  // JIKA SHORT LINK TERKUNCI (dari ?locked_link=)
  // =====================================================

  if (lockedShortLink) {
    return (
      <div className="pub">
        <div className="pub__error-card">
          <div className="pub__error-icon">🔒</div>
          <h1>Link Terkunci</h1>
          <p>
            Short link ini hanya dapat diakses oleh unit kerja:
            <br />
            <b>{decodeURIComponent(lockedShortLinkUnit) || "Tertentu"}</b>
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 8 }}>
            Silakan login dengan akun yang sesuai untuk mengakses link ini.
          </p>
          <a
            href="/"
            className="pub__share-btn pub__share-btn--copy"
            style={{ marginTop: 16, display: "inline-flex" }}
          >
            ← Ke Halaman Login
          </a>
        </div>
      </div>
    );
  }

  // =====================================================
  // JIKA PUBLIC LINK HUB
  // =====================================================

  if (isPublicHub) {
    return renderPublicHub();
  }

  // =====================================================
  // CEK LOGIN
  // =====================================================

  if (checkingLogin) {
    return <div style={{ padding: "40px" }}>Memeriksa login...</div>;
  }

  // =====================================================
  // TAMPIL LOGIN
  // =====================================================

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (showUnitKerjaForm) {
    return (
      <div className="unit-kerja-page">
        <div className="unit-kerja-card">
          <h1>Lengkapi Profil</h1>

          <p>Sebelum menggunakan PENINK, silakan pilih unit kerja Anda.</p>

          <label>Unit Kerja</label>

          {unitKerjaLoading ? (
            <p>Memuat daftar unit kerja...</p>
          ) : (
            <select
              value={selectedUnitKerja}
              onChange={(e) => setSelectedUnitKerja(e.target.value)}
            >
              <option value="">-- Pilih Unit Kerja --</option>

              {unitKerjaOptions.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.nama_unit_kerja}
                </option>
              ))}
            </select>
          )}

          {unitKerjaError && (
            <div className="unit-kerja-error">{unitKerjaError}</div>
          )}

          <button
            type="button"
            onClick={handleSaveUnitKerja}
            disabled={unitKerjaSaving || !selectedUnitKerja}
          >
            {unitKerjaSaving ? "Menyimpan..." : "Simpan Unit Kerja"}
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN UTAMA
  // =====================================================

  return (
    <>
      <Sidebar
        activePage={activePage}
        setActivePage={navigateTo}
        setShowProfile={setShowProfile}
        user={user}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
        isAdminUnit={isAdminUnit}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="app-main">
        <Header
          activePage={activePage}
          user={user}
          isSuperAdmin={isSuperAdmin}
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => {
            navigateTo("dashboard", false);
            setShowProfile(true);
          }}
        />

        <Suspense
          fallback={
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#64748b" }}>
                Memuat halaman...
              </div>
            </div>
          }
        >
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
                  {activePage === "dashboard" && (
                    <Dashboard
                      API_URL={API_URL}
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
                      type={shortLinkType}
                      setType={setShortLinkType}
                      loading={loading}
                      shortenUrl={shortenUrl}
                      setActivePage={navigateTo}
                    />
                  )}

                  {activePage === "shortlink" && (
                    <ShortLink
                      API_URL={API_URL}
                      user={user}
                      url={url}
                      setUrl={setUrl}
                      title={title}
                      setTitle={setTitle}
                      alias={alias}
                      setAlias={setAlias}
                      type={shortLinkType}
                      setType={setShortLinkType}
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

                  {activePage === "linkhub" && (
                    <LinkHub
                      API_URL={API_URL}
                      user={user}
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
                      /* ✨ Props baru untuk upload logo */
                      logoFile={logoFile}
                      setLogoFile={setLogoFile}
                      removeLogo={removeLogo}
                      setRemoveLogo={setRemoveLogo}
                    />
                  )}

                  {activePage === "statistik" && (
                    <Statistik
                      isAdmin={isAdmin}
                      adminStats={adminStats}
                      qrScans={qrScans}
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

                  {activePage === "saran" && (
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
                      loadFeedbacksData={loadFeedbacksData}
                      handleDeleteFeedback={handleDeleteFeedback}
                      getFeedbackBadge={getFeedbackBadge}
                      activePage={activePage}
                      setActivePage={navigateTo}
                    />
                  )}

                  {activePage === "feedback-list" && (
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
                      setActivePage={navigateTo}
                    />
                  )}

                  {activePage === "users" && (
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

                  {activePage === "locked-aliases" && (
                    <LockedAlias
                      API_URL={API_URL}
                      user={user}
                      unitKerjas={unitKerjas}
                    />
                  )}

                  {activePage === "pengaturan" && (
                    <Pengaturan user={user} API_URL={API_URL} />
                  )}
                </>
              )}
            </div>
          </main>
        </Suspense>
      </div>

      {/* ✨ NOTIFICATION MODAL — Pakai Gaya Card dengan Emoji */}
      <NotificationModal
        isOpen={notifModal.isOpen}
        variant={notifModal.variant}
        emoji={notifModal.emoji}
        title={notifModal.title}
        message={notifModal.message}
        buttonText="Mengerti"
        onClose={() => setNotifModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}

export default App;
