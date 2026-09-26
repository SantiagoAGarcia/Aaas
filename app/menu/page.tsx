"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  ShoppingBag,
  User,
  Heart,
  Star,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  Utensils,
  Soup,
  Vegan,
  Cake,
  SlidersHorizontal,
  Home,
  ClipboardList,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  cook: string;
  price: number;
  image: string;
  quantity: number;
}

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: "Ajiaco de la casa",
      cook: "Doña Rosa",
      price: 18000,
      image: "/images/menu_ajiaco.jpg",
      quantity: 1,
    },
  ]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const dishes = [
    {
      id: 1,
      name: "Ajiaco de la casa",
      category: "Sopas",
      badge: "El favorito ♡",
      price: 18000,
      formattedPrice: "$18.000",
      image: "/images/menu_ajiaco.jpg",
      cook: "Doña Rosa",
      cookAvatar: "/images/dona_rosa_mascot.jpg",
      rating: "4,9",
      reviews: "120",
      distance: "A 350 m",
    },
    {
      id: 2,
      name: "Bandeja casera",
      category: "Almuerzos",
      badge: "Quedan 5",
      price: 22000,
      formattedPrice: "$22.000",
      image: "/images/menu_cazuela.jpg",
      cook: "Don Carlos",
      cookAvatar: "/images/hero_art_2.jpg",
      rating: "4,8",
      reviews: "95",
      distance: "A 600 m",
    },
    {
      id: 3,
      name: "Pollo guisado",
      category: "Almuerzos",
      badge: null,
      price: 17000,
      formattedPrice: "$17.000",
      image: "/images/dish_pollo_chalk.jpg",
      cook: "Doña Marta",
      cookAvatar: "/images/hero_art_1.jpg",
      rating: "4,8",
      reviews: "87",
      distance: "A 800 m",
    },
    {
      id: 4,
      name: "Lentejas con arroz",
      category: "Vegetariano",
      badge: null,
      price: 15000,
      formattedPrice: "$15.000",
      image: "/images/hero_plate_gourmet.jpg",
      cook: "María Elena",
      cookAvatar: "/images/olla_dish_2.jpg",
      rating: "4,7",
      reviews: "73",
      distance: "A 1,2 km",
    },
    {
      id: 5,
      name: "Sancocho de pollo",
      category: "Sopas",
      badge: "Hecho hoy ♡",
      price: 19000,
      formattedPrice: "$19.000",
      image: "/images/olla_dish_1.jpg",
      cook: "Don Luis",
      cookAvatar: "/images/hero_art_2.jpg",
      rating: "4,9",
      reviews: "101",
      distance: "A 1,1 km",
    },
    {
      id: 6,
      name: "Arroz con leche",
      category: "Postres",
      badge: null,
      price: 6000,
      formattedPrice: "$6.000",
      image: "/images/menu_postre.jpg",
      cook: "Doña Lucía",
      cookAvatar: "/images/dona_rosa_mascot.jpg",
      rating: "4,8",
      reviews: "64",
      distance: "A 900 m",
    },
  ];

  const addToCart = (dish: (typeof dishes)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          cook: dish.cook,
          price: dish.price,
          image: dish.image,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 3000 : 0;
  const total = subtotal + deliveryFee;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredDishes = dishes.filter((dish) => {
    const matchesFilter =
      activeFilter === "Todos" || dish.category === activeFilter;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.cook.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#2C241E] font-['Outfit',sans-serif] selection:bg-[#C84B31] selection:text-white">
      {/* ── 1. TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-xs px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center p-1 transition-transform group-hover:scale-105">
              <img
                src="/brand/ollacercana-icon.svg"
                alt="OllaCercana Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-['Outfit',sans-serif] font-extrabold text-2xl tracking-tight leading-none">
              <span className="text-[#F0822D]">Olla</span>
              <span className="text-[#62B869]">Cercana</span>
            </span>
          </Link>

          {/* Location Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 cursor-pointer hover:bg-stone-200/60 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Bogotá · Tu barrio</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
          </div>

          {/* Center Search Link & Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
            <a
              href="#explorar"
              className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explorar</span>
            </a>
            <Link
              href="/cocineras-cercanas"
              className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Cocinas cercanas</span>
            </Link>
            <Link
              href="/cuenta"
              className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Mis pedidos</span>
            </Link>
          </nav>

          {/* Right User Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Icon */}
            <a
              href="#cart-section"
              className="relative p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C84B31] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </a>

            {/* User Profile */}
            <Link
              href="/cuenta"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden relative border border-stone-300">
                <Image
                  src="/images/dona_rosa_mascot.jpg"
                  alt="Ana María Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden md:inline">Ana María</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER WITH Subtle Brick/Paper Wall Background ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* ── 2. HERO CHALKBOARD HANGING BANNERS ROW ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Large Hanging Chalkboard Sign */}
          <div className="lg:col-span-8 relative bg-[#1E2022] border-4 border-[#4A3728] rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Hanging Hooks & Rope Details on Top */}
            <div className="absolute top-2 left-10 flex items-center gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-stone-400 border-2 border-stone-700 shadow-inner" />
              <div className="w-0.5 h-4 bg-stone-600 shadow-xs" />
            </div>
            <div className="absolute top-2 right-16 flex items-center gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-stone-400 border-2 border-stone-700 shadow-inner" />
              <div className="w-0.5 h-4 bg-stone-600 shadow-xs" />
            </div>

            {/* Red Checkered Napkin Hanging Accent over top-right corner */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden z-20">
              <div className="w-32 h-32 bg-[#C84B31] border-2 border-stone-900 rotate-45 translate-x-12 -translate-y-16 shadow-lg flex items-end justify-center pb-2">
                <div className="w-full h-full bg-[radial-gradient(#fff_20%,transparent_20%)] bg-[size:10px_10px] opacity-30" />
              </div>
            </div>

            {/* Chalkboard Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-3">
                  {/* Steaming pot chalk drawing icon */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-10 h-10 stroke-[#E25B45] fill-none stroke-[2.5] stroke-linecap-round"
                    >
                      <path d="M16 28h32v20a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V28z" />
                      <path d="M12 28h40" />
                      <path d="M8 32h8M48 32h8" />
                      {/* Steam lines */}
                      <path d="M24 16c2-3 0-6 2-9M32 16c2-3 0-6 2-9M40 16c2-3 0-6 2-9" className="stroke-[#F4C430]" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-['Caveat',cursive] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide leading-none">
                      Hoy se come rico.
                    </h1>
                    {/* Chalk underline stroke */}
                    <div className="w-48 h-1.5 bg-[#F4C430] rounded-full mt-1 rotate-[-1deg]" />
                  </div>
                </div>

                <p className="text-stone-300 font-['Caveat',cursive] text-xl sm:text-2xl pt-2 font-normal">
                  Comida de casa, hecha por tus vecinos.
                </p>
              </div>

              {/* Hand Drawn Spoon & Fresh Badge */}
              <div className="flex md:flex-col items-center gap-4 self-end md:self-center shrink-0">
                {/* Chalk spoon doodle */}
                <div className="hidden sm:block text-stone-400 opacity-80 rotate-12">
                  <svg viewBox="0 0 40 100" className="w-8 h-20 stroke-stone-300 fill-none stroke-[2]">
                    <ellipse cx="20" cy="20" rx="14" ry="18" />
                    <path d="M20 38v55" />
                  </svg>
                </div>

                {/* Badge: ¡Recién hecho! */}
                <div className="px-4 py-2 rounded-full bg-[#EAB308]/20 border-2 border-dashed border-[#F4C430] text-[#F4C430] font-['Caveat',cursive] text-xl font-bold rotate-[-4deg] shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F4C430]" />
                  <span>¡Recién hecho!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Smaller Hanging Chalkboard Banner */}
          <div className="lg:col-span-4 relative bg-[#232528] border-4 border-[#4A3728] rounded-3xl p-6 shadow-xl flex flex-col justify-center text-center space-y-3 min-h-[180px]">
            {/* Hanging Rope detail */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-stone-400 border-2 border-stone-700" />
            </div>

            <h2 className="font-['Caveat',cursive] text-3xl md:text-4xl font-bold text-white leading-tight">
              La hora del almuerzo
            </h2>
            <p className="font-['Caveat',cursive] text-lg text-stone-300">
              Encuentra tu favorito cerca de casa. ♡
            </p>
          </div>
        </section>

        {/* ── 3. SEARCH & FILTERS ROW ── */}
        <section id="explorar" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca un plato o una cocina de tu barrio"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-stone-300 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-xs transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "Todos", label: "Todos", icon: Utensils },
              { id: "Almuerzos", label: "Almuerzos", icon: Utensils },
              { id: "Sopas", label: "Sopas", icon: Soup },
              { id: "Vegetariano", label: "Vegetariano", icon: Vegan },
              { id: "Postres", label: "Postres", icon: Cake },
              { id: "Filtros", label: "Filtros", icon: SlidersHorizontal },
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = activeFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-[#C84B31] text-white shadow-md shadow-red-950/20"
                      : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#C84B31]"}`} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 4. DISH GRID SECTION & RIGHT SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: DISH CARDS GRID */}
          <section className="lg:col-span-8 space-y-6">
            {/* Section Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-300/60 pb-3">
              <div className="space-y-1">
                <h2 className="font-serif text-3xl font-extrabold text-[#2C241E] flex items-center gap-2">
                  <span>¿Qué se te antoja hoy?</span>
                  <span className="w-12 h-1 bg-[#C84B31] rounded-full inline-block mt-2" />
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C84B31] bg-orange-100/70 border border-orange-200 px-3 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>Cocinas a menos de 2 km</span>
              </div>
            </div>

            {/* Dish Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-3xl border border-stone-300 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Chalkboard Upper Card */}
                  <div className="relative bg-[#1A1C1E] border-b-4 border-[#3A2D23] p-4 text-white min-h-[220px] flex flex-col justify-between overflow-hidden">
                    {/* Rope loops on top */}
                    <div className="absolute top-1 left-4 w-2 h-2 rounded-full bg-stone-500 border border-stone-800" />
                    <div className="absolute top-1 right-4 w-2 h-2 rounded-full bg-stone-500 border border-stone-800" />

                    {/* Header Chalk Title & Badge */}
                    <div className="flex items-start justify-between gap-2 z-10">
                      <h3 className="font-['Caveat',cursive] text-2xl font-bold leading-tight text-white group-hover:text-[#F4C430] transition-colors">
                        {dish.name}
                      </h3>

                      {dish.badge && (
                        <span className="px-2.5 py-0.5 rounded-full border border-dashed border-[#F4C430] bg-[#F4C430]/10 text-[#F4C430] font-['Caveat',cursive] text-sm font-semibold shrink-0">
                          {dish.badge}
                        </span>
                      )}
                    </div>

                    {/* Dish Image & Steam Details */}
                    <div className="relative w-full aspect-4/3 my-2 rounded-2xl overflow-hidden shadow-inner border border-stone-700/50">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Chalk Yellow Price */}
                    <div className="flex items-center justify-between z-10 pt-1">
                      <span className="font-['Caveat',cursive] text-2xl font-bold text-[#F4C430]">
                        {dish.formattedPrice}
                      </span>
                      {/* Steam doodle */}
                      <span className="text-stone-400 text-xs font-['Caveat',cursive]">
                        ♨️ Recién hecho
                      </span>
                    </div>
                  </div>

                  {/* Light Bottom Footer Card */}
                  <div className="p-4 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden relative border border-stone-300 shrink-0">
                        <Image
                          src={dish.cookAvatar}
                          alt={dish.cook}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-800 truncate">
                          {dish.cook}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {dish.rating} ({dish.reviews})
                          </span>
                          <span>•</span>
                          <span className="truncate">📍 {dish.distance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Circular Add to Cart Button */}
                    <button
                      onClick={() => addToCart(dish)}
                      className="w-9 h-9 rounded-full bg-[#C84B31] hover:bg-[#b33e26] text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
                      title="Agregar al pedido"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT 4 COLS: SIDEBAR (Cocina Invitada + Tu Pedido) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. MASCOTA / COCINA INVITADA PANEL */}
            <div className="bg-[#1C1E20] border-4 border-[#3A2D23] rounded-3xl p-6 shadow-xl relative overflow-hidden text-center space-y-4">
              {/* Rope hanging loops */}
              <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-stone-500 border border-stone-800" />
              <div className="absolute top-2 right-6 w-3 h-3 rounded-full bg-stone-500 border border-stone-800" />

              <span className="font-['Caveat',cursive] text-2xl font-bold text-white block">
                Nuestra Mascota
              </span>

              {/* Official 3D Pixar Mascot Character Portrait */}
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#F0822D] shadow-xl bg-stone-900">
                <Image
                  src="/images/abuelita_3d_mascot.jpg"
                  alt="Abuela OllaCercana - Mascot"
                  fill
                  className="object-cover scale-110 object-center"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-['Caveat',cursive] text-2xl md:text-3xl font-bold text-[#F4C430] leading-tight">
                  Abuela OllaCercana ♡
                </h4>
                <p className="font-['Caveat',cursive] text-stone-300 text-lg leading-snug">
                  La calidez y sazón de nuestra comunidad.
                </p>
              </div>

              <Link
                href="/cocineras-cercanas"
                className="w-full py-2.5 rounded-full bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-md"
              >
                <span>Conócela →</span>
              </Link>
            </div>

            {/* 2. CART SUMMARY PANEL ("TU PEDIDO") */}
            <div
              id="cart-section"
              className="bg-white border-4 border-stone-300 rounded-3xl p-6 shadow-xl relative space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C84B31]" />
                  <span>Tu pedido</span>
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-[#C84B31] transition-colors"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs space-y-2">
                  <p>Tu pedido está vacío.</p>
                  <p className="text-[11px] font-['Caveat',cursive] text-stone-500 text-base">
                    Agrega un delicioso plato casero con el botón +
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-stone-50 border border-stone-200"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-300">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone-500">{item.cook}</p>
                        <p className="text-xs font-extrabold text-[#C84B31]">
                          ${(item.price * item.quantity).toLocaleString("es-CO")}
                        </p>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation Summary */}
              {cart.length > 0 && (
                <div className="space-y-2 border-t border-stone-200 pt-4 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega (A 350 m)</span>
                    <span className="font-semibold">
                      ${deliveryFee.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-extrabold text-[#C84B31]">
                    <span>Total</span>
                    <span className="text-lg font-extrabold">
                      ${total.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                disabled={cart.length === 0}
                onClick={() => setOrderModalOpen(true)}
                className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                  cart.length > 0
                    ? "bg-[#C84B31] hover:bg-[#b33e26] text-white cursor-pointer"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
              >
                <span>¡A comer! →</span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* ── CHECKOUT ORDER CONFIRMATION MODAL ── */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-stone-300 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#62B869] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                ¡Tu pedido está listo!
              </h3>
              <p className="text-xs text-stone-500">
                Confirmando pedido con Doña Rosa y las cocineras de tu barrio.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-stone-700">
                  <span>
                    {item.quantity}x {item.name} ({item.cook})
                  </span>
                  <span className="font-bold">
                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-2 flex justify-between font-extrabold text-[#C84B31] text-sm">
                <span>Total a pagar</span>
                <span>${total.toLocaleString("es-CO")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/573000000000?text=Hola!%20Quiero%20confirmar%20mi%20pedido%20de%20OllaCercana%20por%20$${total.toLocaleString("es-CO")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setOrderModalOpen(false);
                  clearCart();
                }}
                className="w-full py-3.5 rounded-full bg-[#62B869] hover:bg-[#529d58] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Enviar Pedido por WhatsApp</span>
              </a>

              <button
                onClick={() => setOrderModalOpen(false)}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800"
              >
                Seguir pidiendo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
