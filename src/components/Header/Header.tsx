import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NotificationButton } from "../Notification/Button";
import { UserContext } from "../../contexts/UserContext";
import * as iconMD from "react-icons/md";
import * as iconBS from "react-icons/bi";
import * as iconHi from "react-icons/hi2";
import api from "../../utils/api";
import simoLogo from "../../assets/images/simo-logo.png";

export const Header: React.FC = () => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 xl:px-3 xl:pt-3">
                <nav className="glass-strong w-full max-w-[1200px] rounded-2xl border border-dark-border px-4 py-2 xl:rounded-xl">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo and Navigation */}
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center transition-all group-hover:bg-primary/30">
                                    <img 
                                        src={simoLogo} 
                                        alt="Simo" 
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                            </Link>
                            
                            {/* Desktop Navigation Icons */}
                            <div className="flex items-center gap-1 ml-2 xl:hidden">
                                <Link 
                                    to="/" 
                                    className={`p-2 rounded-lg transition-all ${
                                        isActive('/') 
                                            ? 'bg-primary/20 text-primary-light' 
                                            : 'text-text-secondary hover:text-white hover:bg-dark-elevated'
                                    }`}
                                >
                                    <iconHi.HiHome size={20} />
                                </Link>
                                <Link 
                                    to="/addbot" 
                                    className={`p-2 rounded-lg transition-all ${
                                        isActive('/addbot') 
                                            ? 'bg-primary/20 text-primary-light' 
                                            : 'text-text-secondary hover:text-white hover:bg-dark-elevated'
                                    }`}
                                >
                                    <iconHi.HiPlus size={20} />
                                </Link>
                                <Link 
                                    to="/dashboard" 
                                    className={`p-2 rounded-lg transition-all ${
                                        isActive('/dashboard') 
                                            ? 'bg-primary/20 text-primary-light' 
                                            : 'text-text-secondary hover:text-white hover:bg-dark-elevated'
                                    }`}
                                >
                                    <iconHi.HiSquares2X2 size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <form 
                            action="/search" 
                            className={`flex-1 max-w-[500px] xl:hidden transition-all duration-300 ${
                                isSearchFocused ? 'max-w-[550px]' : ''
                            }`}
                        >
                            <div className={`flex items-center gap-3 bg-dark-elevated rounded-xl px-4 py-2.5 border transition-all duration-300 ${
                                isSearchFocused 
                                    ? 'border-primary/50 ring-2 ring-primary/20' 
                                    : 'border-dark-border hover:border-dark-border/80'
                            }`}>
                                <iconHi.HiMagnifyingGlass className="text-text-muted" size={18} />
                                <input
                                    className="bg-transparent outline-none w-full text-white placeholder:text-text-muted text-sm"
                                    name="bot"
                                    placeholder="Buscar bots..."
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                />
                                <div className="flex items-center gap-1">
                                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-text-muted bg-dark-bg rounded-md border border-dark-border">
                                        <span className="text-[10px]">^</span>K
                                    </kbd>
                                </div>
                            </div>
                        </form>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2" ref={menuRef}>
                            <NotificationButton />
                            
                            {/* User Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary hover:bg-primary-light transition-all text-white"
                            >
                                {user ? (
                                    <>
                                        <img 
                                            onError={async ({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = simoLogo;
                                            }}
                                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                                            className="w-6 h-6 rounded-full" 
                                            alt="Avatar" 
                                        />
                                        <iconHi.HiChevronDown 
                                            className={`transition-transform duration-300 xl:hidden ${isMenuOpen ? 'rotate-180' : ''}`} 
                                            size={16} 
                                        />
                                    </>
                                ) : (
                                    <>
                                        <iconHi.HiArrowRightOnRectangle size={18} />
                                        <span className="text-sm font-medium xl:hidden">Entrar</span>
                                    </>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`absolute right-4 top-[70px] w-56 rounded-xl bg-dark-card border border-dark-border shadow-xl transition-all duration-300 overflow-hidden ${
                                isMenuOpen 
                                    ? 'opacity-100 translate-y-0 visible' 
                                    : 'opacity-0 -translate-y-2 invisible'
                            }`}>
                                {user ? (
                                    <>
                                        <div className="p-3 border-b border-dark-border">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    onError={async ({ currentTarget }) => {
                                                        currentTarget.onerror = null;
                                                        currentTarget.src = simoLogo;
                                                    }}
                                                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                                    className="w-10 h-10 rounded-full"
                                                    alt="Avatar"
                                                />
                                                <div>
                                                    <p className="font-semibold text-white">{user.username}</p>
                                                    <p className="text-xs text-text-muted">Membro</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <Link 
                                                to="/dashboard" 
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary hover:text-white"
                                            >
                                                <iconMD.MdPerson size={18} />
                                                <span className="text-sm">Meu Perfil</span>
                                            </Link>
                                            <Link 
                                                to="/addbot" 
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary hover:text-white"
                                            >
                                                <iconBS.BiPlus size={18} />
                                                <span className="text-sm">Adicionar Bot</span>
                                            </Link>
                                            <Link 
                                                to="/notifications" 
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary hover:text-white"
                                            >
                                                <iconBS.BiBell size={18} />
                                                <span className="text-sm">Notificacoes</span>
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-dark-border">
                                            <button 
                                                onClick={async () => { 
                                                    await api.logoutUser(); 
                                                    window.location.reload();
                                                }}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 w-full"
                                            >
                                                <iconBS.BiExit size={18} />
                                                <span className="text-sm">Sair</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-2">
                                        <Link 
                                            to={import.meta.env.VITE_AUTH_LINK || '/login'}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary-light w-full"
                                        >
                                            <iconMD.MdPerson size={18} />
                                            <span className="text-sm font-medium">Fazer Login</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            
            {/* Spacer for fixed header */}
            <div className="h-[88px] xl:h-[76px]"></div>
        </>
    );
};
