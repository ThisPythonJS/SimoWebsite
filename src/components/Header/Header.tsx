import React, { useState, useContext, useRef } from "react";
import * as icon from "react-icons/bs";
import { Link } from "react-router-dom";
import { Button } from "../Mixed/Button";
import { NotificationButton } from "../Notification/Button";
import { InputSearch } from "../Search/InputSearch";
import { UserContext } from "../../contexts/UserContext";
import simo from "../../assets/images/simo.png";
import api from "../../utils/api";
import "./index.css";

export const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const handleSearchClick = () => {
    const input = headerRef.current?.querySelector('input[name="bot"]') as HTMLInputElement | null;
    if (input) input.focus();
    else setShowSearch(true);
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
          <h1 className="font-boldonse text-gradient text-xl sm:text-2xl tracking-wide">Simo</h1>
          <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
        </Link>

        <div className="flex-1 mx-6 hidden md:flex justify-center">
          <div className="w-full max-w-md">
            <InputSearch show={true} />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto relative">
          <button
            onClick={handleSearchClick}
            aria-label="Pesquisar"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <icon.BsSearch size={20} className="text-white/70" />
          </button>

          <NotificationButton />

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
                  className="absolute right-0 mt-2 w-40 bg-[#1a1c22] border border-white/10 
                             rounded-lg shadow-lg flex flex-col py-2 animate-fadeIn z-50"
                >
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                    onClick={() => setShowMenu(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 text-left transition"
                  >
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
          <div className="relative">
            <InputSearch show={true} />
            <button
              onClick={() => setShowSearch(false)}
              aria-label="Fechar pesquisa"
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/10"
            >
              <icon.BsX size={18} className="text-white/70" />
            </button>
          </div>
        </div>
      )}

      <div className="h-[60px]" />
    </>
  );
};
