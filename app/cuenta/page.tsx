"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  ArrowLeft,
  ChefHat,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  KeyRound,
  CreditCard,
  Building,
  Star,
  RefreshCw,
  X,
  Check,
  UserPlus,
  HelpCircle,
  RotateCcw,
  LogOut,
  Home,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: "comprador" | "cocinera" | "admin";
  commercialName?: string;
  bio?: string;
  residentialComplex?: string;
  paymentMethods: string[];
  isLoggedIn: boolean;
}

interface Reservation {
  id: string;
  dish: string;
  quantity: number;
  buyerName: string;
  buyerPhone: string;
  paymentMethod: string;
  price: string;
  status: "pending" | "confirmed" | "rejected" | "closed";
  rejectionReason?: string;
  rejectionComment?: string;
  expiresAt: number; // timestamp
  createdTimestamp: number;
  cocineraConfirmedDelivery: boolean;
  cocineraConfirmedPayment: boolean;
  cocineraClosedAt?: number;
  compradorClosedAt?: number;
  isAutoClosed?: boolean;
  rated?: boolean;
}

export default function CuentaPage() {
  // Mode: Auth or Profile
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeRoleTab, setActiveRoleTab] = useState<"cocinero" | "comprador" | "admin">("cocinero");
  
  // User Session State
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Login Form State
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState<"comprador" | "cocinera">("comprador");
  const [regTerms, setRegTerms] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Profile Form State
  const [commercialName, setCommercialName] = useState("");
  const [bio, setBio] = useState("");
  const [residentialComplex, setResidentialComplex] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["Efectivo", "Nequi"]);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [otpError, setOtpError] = useState("");

  // Cook Requests & Reservations State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rejectingResId, setRejectingResId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("Sin porciones disponibles");
  const [rejectComment, setRejectComment] = useState("");
  const [rejectError, setRejectError] = useState("");

  // Rating Modal State
  const [ratingResId, setRatingResId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(5);

  // Load Session & Remembered Identifier on Mount
  useEffect(() => {
    const remembered = localStorage.getItem("ollacercana_remembered_id");
    if (remembered) {
      setLoginId(remembered);
      setRememberSession(true);
    }

    const savedUserJson = localStorage.getItem("ollacercana_user");
    if (savedUserJson) {
      try {
        const parsed: UserProfile = JSON.parse(savedUserJson);
        if (parsed.isLoggedIn) {
          setUser(parsed);
          setCommercialName(parsed.commercialName || "Cocina de Doña Elena");
          setBio(parsed.bio || "Especialidad en guisos tradicionales a fuego lento y repostería artesanal.");
          setResidentialComplex(parsed.residentialComplex || "Torres del Norte - Apto 302");
          setEditPhone(parsed.phone);
          setSelectedPaymentMethods(parsed.paymentMethods || ["Efectivo", "Nequi"]);
          if (parsed.role === "cocinera") setActiveRoleTab("cocinero");
          else if (parsed.role === "comprador") setActiveRoleTab("comprador");
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedResJson = localStorage.getItem("ollacercana_reservations");
    if (savedResJson) {
      try {
        setReservations(JSON.parse(savedResJson));
      } catch (e) {
        initDefaultReservations();
      }
    } else {
      initDefaultReservations();
    }
  }, []);

  const initDefaultReservations = () => {
    const defaultRes: Reservation[] = [
      {
        id: "RES-101",
        dish: "Guiso Tradicional en Cazuela",
        quantity: 2,
        buyerName: "Carlos Rodríguez",
        buyerPhone: "3104567890",
        paymentMethod: "Nequi",
        price: "$34.000",
        status: "pending",
        expiresAt: Date.now() + 10 * 60 * 1000 - 15000,
        createdTimestamp: Date.now() - 15000,
        cocineraConfirmedDelivery: false,
        cocineraConfirmedPayment: false,
      },
      {
        id: "RES-102",
        dish: "Empanadas Artesanales",
        quantity: 4,
        buyerName: "María Fernanda Gómez",
        buyerPhone: "3159876543",
        paymentMethod: "Efectivo",
        price: "$24.000",
        status: "confirmed",
        expiresAt: Date.now() + 600000,
        createdTimestamp: Date.now() - 3600000,
        cocineraConfirmedDelivery: false,
        cocineraConfirmedPayment: false,
      },
    ];
    setReservations(defaultRes);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(defaultRes));
  };

  // Timer Ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));

      setReservations((prev) => {
        let changed = false;
        const updated = prev.map((res) => {
          if (res.status === "confirmed" && (res.cocineraConfirmedDelivery || res.compradorClosedAt)) {
            const ageHours = (Date.now() - res.createdTimestamp) / (1000 * 3600);
            if (ageHours >= 24 && !res.isAutoClosed) {
              changed = true;
              return { ...res, status: "closed" as const, isAutoClosed: true };
            }
          }
          return res;
        });
        if (changed) {
          localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Login Submit Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginId.trim() || !loginPassword.trim()) {
      setLoginError("Ingresa tu identificador y contraseña.");
      return;
    }

    if (rememberSession) {
      localStorage.setItem("ollacercana_remembered_id", loginId);
    } else {
      localStorage.removeItem("ollacercana_remembered_id");
    }

    const newUser: UserProfile = {
      name: loginId.includes("@") ? loginId.split("@")[0] : "Cocinera Elena",
      email: loginId.includes("@") ? loginId : "elena@ollacercana.com",
      phone: "3001234567",
      role: activeRoleTab === "cocinero" ? "cocinera" : activeRoleTab === "comprador" ? "comprador" : "admin",
      commercialName: "Cocina de Doña Elena",
      bio: "Especialidad en guisos tradicionales a fuego lento y repostería artesanal.",
      residentialComplex: "Torres del Norte - Apto 302",
      paymentMethods: ["Efectivo", "Nequi", "Daviplata"],
      isLoggedIn: true,
    };

    setUser(newUser);
    setCommercialName(newUser.commercialName!);
    setBio(newUser.bio!);
    setResidentialComplex(newUser.residentialComplex!);
    setEditPhone(newUser.phone);
    localStorage.setItem("ollacercana_user", JSON.stringify(newUser));
  };

  // Register Submit Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!regName.trim()) {
      errors.name = "El nombre es obligatorio.";
    }

    if (!regEmail.trim() || !/\S+@\S+\.\S+/.test(regEmail)) {
      errors.email = "Correo electrónico inválido (ej: usuario@correo.com).";
    }

    if (!/^3\d{9}$/.test(regPhone)) {
      errors.phone = "El celular debe contener exactamente 10 dígitos y comenzar por 3.";
    }

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!pwdRegex.test(regPassword)) {
      errors.password = "La contraseña debe incluir al menos una mayúscula, una minúscula y un número.";
    }

    if (regPassword !== regConfirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (!regTerms) {
      errors.terms = "Debes aceptar los términos y condiciones.";
    }

    if (regEmail.toLowerCase() === "duplicado@correo.com") {
      errors.email = "El correo ya se encuentra registrado (409 Conflict).";
    }
    if (regPhone === "3000000000") {
      errors.phone = "El número celular ya está registrado (409 Conflict).";
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});
    const newUser: UserProfile = {
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: regRole,
      commercialName: regRole === "cocinera" ? `Cocina de ${regName}` : undefined,
      bio: "Cocinera de barrio apasionada por la comida real.",
      residentialComplex: "Conjunto Residencial El Rosal",
      paymentMethods: ["Efectivo", "Nequi"],
      isLoggedIn: true,
    };

    setUser(newUser);
    setCommercialName(newUser.commercialName || "");
    setBio(newUser.bio || "");
    setResidentialComplex(newUser.residentialComplex || "");
    setEditPhone(newUser.phone);
    localStorage.setItem("ollacercana_user", JSON.stringify(newUser));
  };

  // Profile Save Handler
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editPhone !== user.phone && /^3\d{9}$/.test(editPhone)) {
      setShowOtpModal(true);
      setOtpTimer(300);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      return;
    }

    const updated: UserProfile = {
      ...user,
      commercialName,
      bio,
      residentialComplex,
      phone: editPhone,
      paymentMethods: selectedPaymentMethods,
    };
    setUser(updated);
    localStorage.setItem("ollacercana_user", JSON.stringify(updated));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // OTP Verification Submit
  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setOtpError("Ingresa el código completo de 6 dígitos.");
      return;
    }

    if (code === "000000") {
      setOtpError("Código incorrecto o expirado.");
      return;
    }

    if (!user) return;

    const updated: UserProfile = {
      ...user,
      phone: editPhone,
      commercialName,
      bio,
      residentialComplex,
      paymentMethods: selectedPaymentMethods,
    };
    setUser(updated);
    localStorage.setItem("ollacercana_user", JSON.stringify(updated));
    setShowOtpModal(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // Logout Handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ollacercana_user");
  };

  // Cook Request Decision Handler
  const handleConfirmReservation = (resId: string) => {
    const updated = reservations.map((r) =>
      r.id === resId ? { ...r, status: "confirmed" as const } : r
    );
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
  };

  const handleOpenRejectModal = (resId: string) => {
    setRejectingResId(resId);
    setRejectReason("Sin porciones disponibles");
    setRejectComment("");
    setRejectError("");
  };

  const handleSubmitReject = () => {
    if (!rejectingResId) return;

    if (rejectReason === "Otro" && !rejectComment.trim()) {
      setRejectError("Escribe una breve observación cuando selecciones 'Otro'.");
      return;
    }

    const updated = reservations.map((r) =>
      r.id === rejectingResId
        ? {
            ...r,
            status: "rejected" as const,
            rejectionReason: rejectReason,
            rejectionComment: rejectComment,
          }
        : r
    );

    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
    setRejectingResId(null);
  };

  // Delivery Closing Flow Handlers (HU-23)
  const handleToggleCocineraCheck = (resId: string, type: "delivery" | "payment") => {
    const updated = reservations.map((r) => {
      if (r.id === resId) {
        return {
          ...r,
          cocineraConfirmedDelivery: type === "delivery" ? !r.cocineraConfirmedDelivery : r.cocineraConfirmedDelivery,
          cocineraConfirmedPayment: type === "payment" ? !r.cocineraConfirmedPayment : r.cocineraConfirmedPayment,
        };
      }
      return r;
    });
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
  };

  const handleConfirmClosing = (resId: string) => {
    const updated = reservations.map((r) => {
      if (r.id === resId) {
        const cocineraTimestamp = Date.now();
        const fullyClosed = !!r.compradorClosedAt;
        return {
          ...r,
          cocineraClosedAt: cocineraTimestamp,
          status: fullyClosed ? ("closed" as const) : ("confirmed" as const),
        };
      }
      return r;
    });
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
  };

  const handleSimulateCompradorConfirm = (resId: string) => {
    const updated = reservations.map((r) => {
      if (r.id === resId) {
        const compradorTimestamp = Date.now();
        const fullyClosed = !!r.cocineraClosedAt;
        return {
          ...r,
          compradorClosedAt: compradorTimestamp,
          status: fullyClosed ? ("closed" as const) : ("confirmed" as const),
        };
      }
      return r;
    });
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
  };

  const handleRatingSubmit = () => {
    if (!ratingResId) return;
    const updated = reservations.map((r) =>
      r.id === ratingResId ? { ...r, rated: true } : r
    );
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
    setRatingResId(null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getRemainingTime = (expiresAt: number) => {
    const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0d1510] text-[#f4efe6] font-['Outfit',sans-serif] overflow-x-hidden flex flex-col justify-between selection:bg-[#F0822D] selection:text-white">
      
      {/* ── FULL-BLEED ATMOSPHERIC BACKGROUND WITH CINEMATIC DARK OVERLAYS ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_art_1.jpg"
          alt="Atmospheric Home Kitchen Background"
          fill
          priority
          className="object-cover object-center filter brightness-50 contrast-110"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1510] via-[#0d1510]/80 to-[#0d1510]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0d1510]/50 to-[#0d1510]/95" />
      </div>

      {/* ── TOP HEADER / BRAND TITLE (UPPER CENTER) ── */}
      <header className="relative z-10 w-full pt-12 pb-6 px-6 text-center">
        <div className="inline-flex items-center justify-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-black/60 border border-orange-500/40 backdrop-blur-md flex items-center justify-center p-2 transition-transform group-hover:scale-105 shadow-xl shadow-black/60">
            <img
              src="/brand/ollacercana-icon.svg"
              alt="OllaCercana Icon"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-['Outfit',sans-serif] font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none drop-shadow-2xl">
            <span className="text-[#F0822D]">Olla</span>
            <span className="text-[#62B869]">Cercana</span>
          </h1>
        </div>
        <p className="text-xs uppercase tracking-widest text-stone-300 font-semibold mt-2 drop-shadow-md">
          Sabor de Hogar • Gestión de Cuenta
        </p>
      </header>

      {/* ── MAIN CONTENT CONTAINER (CENTER / FORM PANEL) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col items-center justify-center">
        
        {/* IF NOT LOGGED IN: COMPACT LOGIN FORM PANEL (POSITIONED CENTER-LEFT MATCHING REFERENCE) */}
        {!user ? (
          <div className="w-full max-w-md mx-auto lg:mr-auto lg:ml-12 bg-black/65 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 space-y-6">
            
            {/* Login / Register Toggle Header */}
            <div className="flex items-center justify-around border-b border-white/10 pb-3">
              <button
                onClick={() => setAuthMode("login")}
                className={`text-sm font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all cursor-pointer ${
                  authMode === "login"
                    ? "border-[#F0822D] text-[#F0822D]"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`text-sm font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all cursor-pointer ${
                  authMode === "register"
                    ? "border-[#F0822D] text-[#F0822D]"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                Registrarme
              </button>
            </div>

            {/* LOGIN FORM */}
            {authMode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 backdrop-blur-md">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email / Phone Field */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-300">
                    Identificador (Correo o Celular)
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="ej: usuario@ollacercana.com"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-[#F0822D] focus:ring-1 focus:ring-[#F0822D] outline-none transition-all"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-300">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-[#F0822D] focus:ring-1 focus:ring-[#F0822D] outline-none transition-all"
                  />
                  <div className="text-right pt-0.5">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Enlace de recuperación enviado a tu identificador.");
                      }}
                      className="text-xs text-[#F0822D] hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>

                {/* Remember Session Checkbox */}
                <div className="flex items-center justify-between pt-1 text-xs text-stone-300">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-4 h-4 accent-[#F0822D] rounded border-white/30"
                    />
                    <span>Recordar sesión</span>
                  </label>
                </div>

                {/* Full-width Accent Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-3 py-3.5 rounded-xl bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-orange-950/50 active:scale-[0.98]"
                >
                  Iniciar Sesión
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-300 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ej: Elena Ramírez"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:border-[#F0822D] outline-none"
                  />
                  {regErrors.name && <span className="text-[11px] text-rose-400">{regErrors.name}</span>}
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-300 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ej: elena@correo.com"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:border-[#F0822D] outline-none"
                  />
                  {regErrors.email && <span className="text-[11px] text-rose-400 font-mono">{regErrors.email}</span>}
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-300 block mb-1">Celular (10 dígitos)</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="ej: 3001234567"
                    maxLength={10}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:border-[#F0822D] outline-none"
                  />
                  {regErrors.phone && <span className="text-[11px] text-rose-400 font-mono">{regErrors.phone}</span>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-300 block mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F0822D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-300 block mb-1">Confirmar</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F0822D] outline-none"
                    />
                  </div>
                </div>
                {regErrors.password && <span className="text-[11px] text-rose-400 font-mono block">{regErrors.password}</span>}
                {regErrors.confirmPassword && <span className="text-[11px] text-rose-400 block">{regErrors.confirmPassword}</span>}

                {/* Role Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-300 block mb-1">Rol en OllaCercana</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole("comprador")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        regRole === "comprador"
                          ? "bg-[#62B869]/20 border-[#62B869] text-[#62B869]"
                          : "bg-black/40 border-white/20 text-stone-400"
                      }`}
                    >
                      Comprador
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole("cocinera")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        regRole === "cocinera"
                          ? "bg-[#F0822D]/20 border-[#F0822D] text-[#F0822D]"
                          : "bg-black/40 border-white/20 text-stone-400"
                      }`}
                    >
                      Cocinera
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                      className="accent-[#F0822D] rounded"
                    />
                    <span>Acepto Términos y Condiciones</span>
                  </label>
                  {regErrors.terms && <span className="text-[11px] text-rose-400 block">{regErrors.terms}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                >
                  Crear Mi Cuenta
                </button>
              </form>
            )}

          </div>
        ) : (
          /* IF LOGGED IN: DASHBOARD PANEL & PROFILE */
          <div className="w-full max-w-4xl bg-black/75 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-6">
            
            {/* Logged in User Bar */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F0822D]/20 border border-[#F0822D]/40 flex items-center justify-center text-[#F0822D] font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white">{user.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">{user.email} • {user.role.toUpperCase()}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            {/* Role Tab Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10">
              <button
                onClick={() => setActiveRoleTab("cocinero")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRoleTab === "cocinero"
                    ? "bg-[#F0822D] text-white shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Cocinero</span>
              </button>

              <button
                onClick={() => setActiveRoleTab("comprador")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRoleTab === "comprador"
                    ? "bg-[#62B869] text-white shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprador</span>
              </button>

              <button
                onClick={() => setActiveRoleTab("admin")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRoleTab === "admin"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            {/* Cook Requests & HU-23 Flow */}
            {activeRoleTab === "cocinero" && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-[#F0822D] flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    <span>Gestión de Solicitudes (Vista Cocinera)</span>
                  </h4>
                  <span className="text-xs text-stone-400 font-mono">
                    {reservations.filter((r) => r.status === "pending").length} pendientes
                  </span>
                </div>

                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <span className="text-xs font-mono text-[#F0822D] font-bold">{res.id}</span>
                          <h5 className="text-base font-bold text-white">{res.dish}</h5>
                        </div>

                        <div className="flex items-center gap-2">
                          {res.status === "pending" && (
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Quedan: {getRemainingTime(res.expiresAt)}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            res.status === "pending" ? "bg-amber-500/20 text-amber-300" :
                            res.status === "confirmed" ? "bg-emerald-500/20 text-emerald-300" :
                            res.status === "closed" ? "bg-sky-500/20 text-sky-300" : "bg-rose-500/20 text-rose-300"
                          }`}>
                            {res.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-300">
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">Comprador</span>
                          <span className="font-semibold text-white">{res.buyerName}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">Cantidad</span>
                          <span className="font-semibold text-white">{res.quantity} porciones</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">Pago</span>
                          <span className="font-semibold text-amber-300">{res.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">Total</span>
                          <span className="font-bold text-[#F0822D]">{res.price}</span>
                        </div>
                      </div>

                      {res.status === "pending" && (
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => handleConfirmReservation(res.id)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Confirmar Reserva
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(res.id)}
                            className="flex-1 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-rose-500 text-stone-300 hover:text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </button>
                        </div>
                      )}

                      {res.status === "confirmed" && (
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                          <h6 className="text-xs font-bold uppercase tracking-wider text-[#F0822D] flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Cierre de Entrega (HU-23)
                          </h6>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={res.cocineraConfirmedDelivery}
                                onChange={() => handleToggleCocineraCheck(res.id, "delivery")}
                                className="accent-[#F0822D] w-4 h-4 rounded"
                              />
                              <span>Entregado</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={res.cocineraConfirmedPayment}
                                onChange={() => handleToggleCocineraCheck(res.id, "payment")}
                                className="accent-[#F0822D] w-4 h-4 rounded"
                              />
                              <span>Pagado</span>
                            </label>

                            <button
                              onClick={() => handleConfirmClosing(res.id)}
                              disabled={!res.cocineraConfirmedDelivery || !res.cocineraConfirmedPayment || !!res.cocineraClosedAt}
                              className="px-5 py-2 rounded-xl bg-[#F0822D] hover:bg-[#d97224] disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                              {res.cocineraClosedAt ? "Cierre Enviado" : "Confirmar Cierre"}
                            </button>
                          </div>

                          {res.cocineraClosedAt && !res.compradorClosedAt && (
                            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Confirmación pendiente por el comprador.
                              </span>
                              <button
                                onClick={() => handleSimulateCompradorConfirm(res.id)}
                                className="px-2.5 py-1 rounded bg-amber-400 text-black text-[10px] font-bold"
                              >
                                Simular Cierre Comprador
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {res.status === "closed" && (
                        <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/40 flex items-center justify-between text-xs text-sky-200">
                          <span className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-sky-400" />
                            Transacción completada ✨ {res.isAutoClosed ? "(Cierre automático por 24h)" : ""}
                          </span>
                          
                          {!res.rated ? (
                            <button
                              onClick={() => setRatingResId(res.id)}
                              className="px-4 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs transition-colors cursor-pointer"
                            >
                              Calificar
                            </button>
                          ) : (
                            <span className="text-amber-300 font-mono">★ Calificado</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleProfileSave} className="space-y-4 text-left border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#F0822D]" />
                  Perfil & Datos Comerciales
                </h4>
                {profileSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Perfil Actualizado
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Nombre Comercial</label>
                <input
                  type="text"
                  value={commercialName}
                  onChange={(e) => setCommercialName(e.target.value)}
                  placeholder="ej: Cocina de Doña Elena"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F0822D] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Presentación / Biografía</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F0822D] outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#F0822D]" /> Conjunto Residencial / Barrio
                </label>
                <input
                  type="text"
                  value={residentialComplex}
                  onChange={(e) => setResidentialComplex(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F0822D] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#F0822D]" /> Teléfono (Modificar activa OTP)
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  maxLength={10}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F0822D] outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#F0822D]" /> Medios de Pago
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Efectivo", "Nequi", "Daviplata"].map((method) => {
                    const isSelected = selectedPaymentMethods.includes(method);
                    return (
                      <button
                        type="button"
                        key={method}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPaymentMethods(selectedPaymentMethods.filter((m) => m !== method));
                          } else {
                            setSelectedPaymentMethods([...selectedPaymentMethods, method]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F0822D]/20 border-[#F0822D] text-[#F0822D]"
                            : "bg-black/40 border-white/20 text-stone-400"
                        }`}
                      >
                        {isSelected ? "✓ " : ""}{method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Guardar Perfil
              </button>
            </form>

          </div>
        )}
      </div>

      {/* ── CORNER MENU (BOTTOM-RIGHT CORNER MATCHING REFERENCE LAYOUT) ── */}
      <footer className="relative z-10 w-full px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
        {/* Left Back link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4 text-[#F0822D]" />
          <span>Volver a OllaCercana</span>
        </Link>

        {/* Right Corner Menu Links */}
        <div className="flex flex-wrap items-center justify-end gap-6 text-xs font-bold tracking-widest uppercase text-stone-300">
          {!user ? (
            <button
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#F0822D]" />
              <span>{authMode === "login" ? "Crear cuenta" : "Iniciar sesión"}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveRoleTab(activeRoleTab === "cocinero" ? "comprador" : "cocinero")}
              className="hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#62B869]" />
              <span>Cambiar de rol</span>
            </button>
          )}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Centro de Ayuda OllaCercana: Soporte para cocineras y compradores vecinales.");
            }}
            className="hover:text-white flex items-center gap-2 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>Ayuda</span>
          </a>

          <span className="text-[11px] text-stone-500 font-mono tracking-normal">v2.4</span>
        </div>
      </footer>

      {/* ── MODALS (REJECTION REASON / OTP / RATING) ── */}
      {rejectingResId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1A1C1E] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-rose-400">Rechazar Solicitud {rejectingResId}</h4>
              <button onClick={() => setRejectingResId(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {rejectError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                {rejectError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 font-medium block">Motivo del rechazo</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              >
                <option value="Sin porciones disponibles">Sin porciones disponibles</option>
                <option value="No alcancé a entregar">No alcancé a entregar</option>
                <option value="Pedido incompatible">Pedido incompatible</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 font-medium block">
                Observación {rejectReason === "Otro" ? "(Obligatoria)" : "(Opcional)"}
              </label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={3}
                placeholder="Explica brevemente al comprador..."
                className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRejectingResId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-stone-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitReject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#1A1C1E] border border-[#F0822D]/40 rounded-3xl p-6 shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#F0822D]/20 border border-[#F0822D]/40 flex items-center justify-center text-[#F0822D] mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Verificación OTP Celular</h4>
              <p className="text-xs text-stone-400 mt-1">
                Código de 6 dígitos enviado al <span className="text-[#F0822D] font-mono">{editPhone}</span>
              </p>
            </div>

            {otpError && (
              <div className="w-full p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                {otpError}
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updated = [...otpDigits];
                    updated[idx] = val;
                    setOtpDigits(updated);
                    if (val && idx < 5) {
                      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  className="w-10 h-12 text-center text-lg font-bold bg-black/60 border border-white/20 rounded-xl focus:border-[#F0822D] text-white outline-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono text-amber-400">Expira en: {formatTimer(otpTimer)}</span>
              <button
                type="button"
                onClick={() => {
                  setOtpTimer(300);
                  setOtpError("");
                  setOtpDigits(["", "", "", "", "", ""]);
                  alert("Nuevo código enviado.");
                }}
                className="text-[#F0822D] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reenviar
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-stone-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-2.5 rounded-xl bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs"
              >
                Validar
              </button>
            </div>
          </div>
        </div>
      )}

      {ratingResId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#1A1C1E] border border-sky-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <h4 className="text-base font-bold text-white">Calificar Transacción</h4>
            <p className="text-xs text-stone-300">¿Cómo fue la experiencia del pedido {ratingResId}?</p>

            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star className={`w-7 h-7 ${star <= ratingStars ? "fill-amber-400" : "text-stone-700"}`} />
                </button>
              ))}
            </div>

            <button
              onClick={handleRatingSubmit}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs"
            >
              Guardar Calificación
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
