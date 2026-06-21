import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";

function Navbar({ cartCount, user, setUser }) {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const lastScroll = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  /* Hide on scroll down */
  useEffect(() => {
    const onScroll = () => {
      const curr = window.scrollY;
      setHide(curr > lastScroll.current && curr > 80);
      lastScroll.current = curr;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${hide ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <nav className="mx-3 mt-3 rounded-3xl bg-white/95 backdrop-blur-xl shadow-xl border border-pink-100">

        {/* TOP ROW */}
        <div className="h-[64px] px-5 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="font-black text-lg leading-tight bg-gradient-to-r from-pink-500 to-rose-400 text-transparent bg-clip-text"
          >
            SHIV SHAKTI
            <span className="block text-[11px] font-semibold text-pink-300 tracking-widest">
              GENERAL STORE
            </span>
          </Link>

          {/* User Name & Icons */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest leading-none">Welcome back</span>
                <span className="text-sm font-black text-gray-800 leading-tight">Hi, {user.name.split(' ')[0]}</span>
              </div>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="relative w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center"
            >
              <ShoppingCart size={18} className="text-pink-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            className="border-t border-pink-100 px-5 py-6"
          >
            {user && (
              <div className="mb-6 px-4 py-3 bg-pink-50 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-pink-500 shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[8px] font-black text-pink-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-black text-gray-800">{user.name}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Link to="/" className="rounded-2xl bg-gray-50 py-4 text-center font-black text-gray-700 hover:bg-pink-50 transition">Home</Link>
              <Link to="/orders" className="rounded-2xl bg-gray-50 py-4 text-center font-black text-gray-700 hover:bg-pink-50 transition">My Orders</Link>
              {user?.isAdmin && (
                <Link to="/admin" className="rounded-2xl bg-rose-50 py-4 text-center font-black text-rose-500 hover:bg-rose-500 hover:text-white transition col-span-2">Boutique Console</Link>
              )}
              {!user ? (
                <Link to="/login" className="rounded-2xl bg-pink-500 py-4 text-center font-black text-white hover:bg-pink-600 transition col-span-2 shadow-lg shadow-pink-500/20">Login</Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-gray-100 py-4 text-center font-black text-gray-500 hover:bg-red-50 hover:text-red-500 transition col-span-2"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
