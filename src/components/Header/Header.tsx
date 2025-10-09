import React, { useState, useContext, useRef } from "react";
import * as icon from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Mixed/Button";
import { UserContext } from "../../contexts/UserContext";
import simo from "../../assets/images/simo.png";
import api from "../../utils/api";
import "./index.css";

export const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const headerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?bot=${encodeURIComponent(query)}`);
      setShowSearch(false);
    }
  };

  const handleLogout = async () => {
    await api.logoutUser();
    window.location.reload();
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full md:w-[95%] max-w-6xl 
                   z-50 bg-[#0c0e12]/90 backdrop-blur-md border-b border-white/10 
                   px-5 py-2.5 flex items-center justify-between shadow-lg"
      >
        <Link to="/" className="flex items-center space-x-2 select-none">
          <h1 className="font-bold text-gradient text-xl sm:text-2xl tracking-wide">Simo</h1>
          <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
        </Link>

        <div className="flex-1 mx-6 hidden md:flex justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <input
              type="text"
              name="bot"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar bots..."
              className="w-full px-4 py-2 rounded-lg bg-[#1a1c22] text-white text-sm outline-none border border-white/10 focus:border-[#00ffff]/50 transition"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              <icon.BsSearch size={18} />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3 ml-auto relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Pesquisar"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <icon.BsSearch size={20} className="text-white/70" />
          </button>

          <button
            aria-label="Notificações"
            className="p-2 rounded-lg hover:bg-white/10 transition relative"
          >
            <icon.BsBell size={20} className="text-white/70" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00ffff] rounded-full" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:opacity-80 transition"
              >
                <img
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = simo;
                  }}
                  className="w-8 h-8 rounded-full border border-white/10"
                  alt="avatar"
                />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-[#0c0e12]/90 backdrop-blur-md border border-white/10 
                             rounded-lg shadow-lg flex flex-col py-2 animate-fadeIn z-50"
                >
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <icon.BsPersonCircle className="text-[#00ffff]" size={16} />
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 text-left transition flex items-center gap-2"
                  >
                    <icon.BsBoxArrowRight className="text-red-400" size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={import.meta.env.VITE_AUTH_LINK}>
              <Button clas="bg-[#00ffff]/20 hover:bg-[#00ffff]/30 px-3 py-1.5 rounded-lg text-white text-sm">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </header>

      {showSearch && (
        <div className="fixed top-[60px] left-1/2 -translate-x-1/2 w-[95%] z-40 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              name="bot"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar bots..."
              className="w-full px-4 py-2 rounded-lg bg-[#1a1c22] text-white text-sm outline-none border border-white/10 focus:border-[#00ffff]/50 transition"
            />
            <button
              type="submit"
              aria-label="Pesquisar"
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/10"
            >
              <icon.BsSearch size={18} className="text-white/70" />
            </button>
          </form>
        </div>
      )}

      <div className="h-[60px]" />
    </>
  );
};
