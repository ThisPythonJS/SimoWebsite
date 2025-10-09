import React, { useState, useContext } from "react";
import { Button } from "../Mixed/Button";
import * as icon from "react-icons/bs";
import { Link } from "react-router-dom";
import { NotificationButton } from "../Notification/Button";
import { UserContext } from "../../contexts/UserContext";
import { LoginMenu } from "../DropdownMenu/Menu";
import "./index.css";

export const Header: React.FC = () => {
    const [showSearch, setShowSearch] = useState(false);
    const { user } = useContext(UserContext);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-[#0c0e12]/80 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg transition-all duration-300">
            <Link to="/" className="flex items-center space-x-2 select-none">
                <h1 className="font-bold text-gradient text-2xl tracking-wide leading-none">Simo</h1>
                <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
            </Link>
            <div className="flex-1 mx-6 hidden md:flex justify-center">
                <div className="relative w-full max-w-md transition-all duration-300 focus-within:max-w-2xl">
                    <input
                        type="text"
                        placeholder="Pesquise por um bot..."
                        className="w-full bg-[#1a1c22] text-white placeholder-white/40 text-sm py-2.5 pl-10 pr-4 rounded-lg border border-white/10 focus:border-[#00ffff]/40 focus:ring-2 focus:ring-[#00ffff]/30 outline-none transition-all duration-200"
                    />
                    <icon.BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
                >
                    <icon.BsSearch size={20} className="text-white/70" />
                </button>
                <NotificationButton />
                {user ? (
                    <LoginMenu />
                ) : (
                    <Link to={import.meta.env.VITE_AUTH_LINK}>
                        <Button clas="bg-[#00ffff]/20 hover:bg-[#00ffff]/30 px-4 py-1.5 rounded-lg text-white text-sm">
                            Entrar
                        </Button>
                    </Link>
                )}
            </div>
            {showSearch && (
                <div className="absolute top-full left-0 w-full mt-2 px-4 md:hidden">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Pesquise por um bot..."
                            className="w-full bg-[#1a1c22] text-white placeholder-white/40 text-sm py-2.5 pl-10 pr-4 rounded-lg border border-white/10 focus:border-[#00ffff]/40 focus:ring-2 focus:ring-[#00ffff]/30 outline-none transition-all duration-200"
                            autoFocus
                        />
                        <icon.BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    </div>
                </div>
            )}
        </header>
    );
};
