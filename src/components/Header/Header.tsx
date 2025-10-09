import React, { useState, useContext, useRef } from "react";
import { Button } from "../Mixed/Button";
import * as icon from "react-icons/bs";
import { Link } from "react-router-dom";
import { NotificationButton } from "../Notification/Button";
import { UserContext } from "../../contexts/UserContext";
import { LoginMenu } from "../DropdownMenu/Menu";
import { InputSearch } from "../Search/InputSearch";
import simo from "../../assets/images/simo.png";
import "./index.css";

export const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const [showSearch, setShowSearch] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const handleSearchClick = () => {
    const input = headerRef.current?.querySelector('input[name="bot"]') as HTMLInputElement | null;
    if (input) {
      input.focus();
    } else {
      setShowSearch(true);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50
                   bg-[#0c0e12]/80 backdrop-blur-md border border-white/10 rounded-2xl
                   px-5 py-3 flex items-center justify-between shadow-lg"
      >
          
        <Link to="/" className="flex items-center space-x-2 select-none">
          <h1 className="font-boldonse text-gradient text-2xl tracking-wide">Simo</h1>
          <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
        </Link>

        <div className="flex-1 mx-6 hidden md:flex justify-center">
          <div className="w-full max-w-md">
            <InputSearch show={true} />
          </div>
        </div>
          
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handleSearchClick}
            aria-label="Pesquisar"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <icon.BsSearch size={20} className="text-white/70" />
          </button>

          <div className="hidden md:block">
            <NotificationButton />
          </div>
          <Link
            to="/notifications"
            aria-label="Notificações"
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            <icon.BsBell size={20} className="text-white/70" />
          </Link>

          {/* Perfil/Login: LoginMenu no desktop, fallback avatar/login no mobile */}
          <div className="hidden md:block">
            <LoginMenu />
          </div>
          <div className="md:hidden">
            {user ? (
              <Link to="/dashboard" className="p-1 rounded-full">
                <img
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = simo;
                  }}
                  className="w-8 h-8 rounded-full border border-white/10"
                  alt="avatar"
                />
              </Link>
            ) : (
              <Link to={import.meta.env.VITE_AUTH_LINK}>
                <Button clas="bg-[#00ffff]/20 hover:bg-[#00ffff]/30 px-3 py-1.5 rounded-lg text-white text-sm">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
        
      {showSearch && (
        <div className="fixed top-[90px] left-1/2 -translate-x-1/2 w-[95%] z-40 md:hidden">
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
        
      <div className="h-[96px] md:h-[80px]" />
    </>
  );
};
