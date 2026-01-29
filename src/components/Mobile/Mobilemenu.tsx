import { Link, useLocation } from "react-router-dom";
import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import api from "../../utils/api";
import * as iconHi from "react-icons/hi2";
const simoLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simo.png-wQfR3Tsf6ul3BMkEA9IXy4QBjoCqeZ.webp";

export const Mobilemenu: React.FC = () => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [profileMenu, setProfileMenu] = useState<boolean>(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Profile Menu Overlay */}
            {profileMenu && (
                <div 
                    className="hidden xl:fixed xl:inset-0 xl:bg-black/50 xl:z-40"
                    onClick={() => setProfileMenu(false)}
                ></div>
            )}

            {/* Profile Popup Menu */}
            <div className={`hidden xl:block fixed bottom-20 right-4 z-50 transition-all duration-300 ${
                profileMenu 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 translate-y-4 invisible'
            }`}>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-3 shadow-xl w-56">
                    {user ? (
                        <>
                            <div className="p-3 border-b border-dark-border mb-2">
                                <div className="flex items-center gap-3">
                                    <img 
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src = simoLogo;
                                        }}
                                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                        className="w-10 h-10 rounded-full"
                                        alt="Avatar"
                                    />
                                    <div>
                                        <p className="font-semibold text-white text-sm">{user.username}</p>
                                        <p className="text-xs text-text-muted">Membro</p>
                                    </div>
                                </div>
                            </div>
                            <Link 
                                to="/dashboard" 
                                onClick={() => setProfileMenu(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary hover:text-white"
                            >
                                <iconHi.HiUser size={18} />
                                <span className="text-sm">Meu Perfil</span>
                            </Link>
                            <Link 
                                to={`/user/${user.id}`}
                                onClick={() => setProfileMenu(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary hover:text-white"
                            >
                                <iconHi.HiEye size={18} />
                                <span className="text-sm">Ver Perfil</span>
                            </Link>
                            <div className="border-t border-dark-border mt-2 pt-2">
                                <button 
                                    onClick={async () => {
                                        await api.logoutUser();
                                        window.location.reload();
                                    }}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 w-full"
                                >
                                    <iconHi.HiArrowRightOnRectangle size={18} />
                                    <span className="text-sm">Sair</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link 
                            to={import.meta.env.VITE_AUTH_LINK || '/login'}
                            onClick={() => setProfileMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary-light w-full"
                        >
                            <iconHi.HiUser size={18} />
                            <span className="text-sm font-medium">Fazer Login</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="hidden xl:fixed xl:bottom-0 xl:left-0 xl:right-0 xl:z-40 xl:flex xl:justify-center xl:px-4 xl:pb-4">
                <nav className="glass-strong w-full max-w-md rounded-2xl border border-dark-border px-2 py-2">
                    <div className="flex items-center justify-around">
                        <Link 
                            to="/"
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                                isActive('/') 
                                    ? 'bg-primary/20 text-primary-light' 
                                    : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {isActive('/') ? (
                                <iconHi.HiHome size={22} />
                            ) : (
                                <iconHi.HiOutlineHome size={22} />
                            )}
                            <span className="text-[10px] font-medium">Inicio</span>
                        </Link>

                        <Link 
                            to="/search"
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                                isActive('/search') 
                                    ? 'bg-primary/20 text-primary-light' 
                                    : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {isActive('/search') ? (
                                <iconHi.HiMagnifyingGlass size={22} />
                            ) : (
                                <iconHi.HiOutlineMagnifyingGlass size={22} />
                            )}
                            <span className="text-[10px] font-medium">Buscar</span>
                        </Link>

                        <Link 
                            to="/addbot"
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                                isActive('/addbot') 
                                    ? 'bg-primary/20 text-primary-light' 
                                    : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {isActive('/addbot') ? (
                                <iconHi.HiPlusCircle size={22} />
                            ) : (
                                <iconHi.HiOutlinePlusCircle size={22} />
                            )}
                            <span className="text-[10px] font-medium">Adicionar</span>
                        </Link>

                        <Link 
                            to="/notifications"
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                                isActive('/notifications') 
                                    ? 'bg-primary/20 text-primary-light' 
                                    : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {isActive('/notifications') ? (
                                <iconHi.HiBell size={22} />
                            ) : (
                                <iconHi.HiOutlineBell size={22} />
                            )}
                            <span className="text-[10px] font-medium">Alertas</span>
                        </Link>

                        <button 
                            onClick={() => setProfileMenu(!profileMenu)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                                profileMenu 
                                    ? 'bg-primary/20 text-primary-light' 
                                    : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {user ? (
                                <img 
                                    className="w-6 h-6 rounded-full ring-2 ring-transparent group-hover:ring-primary/30"
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = simoLogo;
                                    }} 
                                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                    alt="Avatar"
                                />
                            ) : (
                                <iconHi.HiOutlineUser size={22} />
                            )}
                            <span className="text-[10px] font-medium">Perfil</span>
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
};
