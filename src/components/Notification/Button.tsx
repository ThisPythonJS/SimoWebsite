import { FC, useContext, useEffect, useRef, useState } from "react";
import * as iconHi from "react-icons/hi2";
import { ThemeContext } from "../../contexts/ThemeContext";
import { UserContext } from "../../contexts/UserContext";
import { NotificationStructure } from "../../types";
import api from "../../utils/api";
import * as iconAI from "react-icons/ai";
import { NotificationCard } from "./Card";
import { Link } from "react-router-dom";

export const NotificationButton: FC = () => {
    const { color } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [notifications, setNotifications] = useState<NotificationStructure>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bulkLoading, setBulkLoading] = useState<boolean>(false);
    const [viewedNotifications, setViewedNotifications] = useState<boolean>(user?.notifications_viewed as boolean);

    const getNotifications = async () => {
        setIsLoading(true);
        const { data } = await api.getNotifications();
        setNotifications(data);
        setIsLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (user) {
            setViewedNotifications(user?.notifications_viewed as boolean);
            getNotifications();
        }
    }, [user, isOpen]);

    return user && (
        <section ref={menuRef} className={`${!user && "invisible"} xl:hidden`}>
            <button 
                onClick={async () => {
                    setIsOpen(!isOpen);
                    if (!user.notifications_viewed) {
                        await api.patchUser({ notifications_viewed: true });
                        setViewedNotifications(true);
                    }
                }} 
                className="relative p-2.5 rounded-xl bg-dark-elevated border border-dark-border hover:border-primary/30 transition-all"
            >
                {!viewedNotifications && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-dark-elevated" />
                )}
                <iconHi.HiBell className="text-text-secondary hover:text-white transition-colors" size={18} />
            </button>
            
            <div className={`${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"} 
                absolute right-20 top-[70px] w-[400px] max-h-[400px] 
                bg-dark-card border border-dark-border rounded-xl shadow-xl 
                transition-all duration-300 overflow-hidden`}
            >
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        <h2 className="text-lg font-bold text-white text-center">Notificacoes</h2>
                        <div className="w-full bg-dark-elevated animate-pulse h-16 rounded-lg"></div>
                        <div className="w-full bg-dark-elevated animate-pulse h-12 rounded-lg"></div>
                        <div className="w-full bg-dark-elevated animate-pulse h-14 rounded-lg"></div>
                    </div>
                ) : (
                    <div>
                        <div className="p-4 border-b border-dark-border">
                            <h2 className="text-lg font-bold text-white text-center">Notificacoes</h2>
                        </div>
                        
                        {user.notifications && Object.keys(notifications).length > 0 ? (
                            <>
                                <div className="max-h-[250px] overflow-y-auto p-3 space-y-2">
                                    {Object.keys(notifications).map((key, index) => (
                                        <NotificationCard 
                                            updateNotifications={getNotifications} 
                                            user={user} 
                                            notification={notifications[key]} 
                                            key={index} 
                                            keyc={key} 
                                            color={color} 
                                        />
                                    ))}
                                </div>
                                <div className="p-3 border-t border-dark-border space-y-2">
                                    <Link 
                                        to="/notifications" 
                                        className="block text-center text-primary-light hover:text-primary text-sm transition-colors"
                                    >
                                        Ver todas as notificacoes
                                    </Link>
                                    <button 
                                        onClick={async () => {
                                            setBulkLoading(true);
                                            await api.deleteAllNotifications(user?.id);
                                            await getNotifications();
                                            setBulkLoading(false);
                                        }} 
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-dark-elevated hover:bg-dark-card-hover border border-dark-border text-text-secondary hover:text-white transition-all text-sm"
                                    >
                                        {bulkLoading ? (
                                            <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={16} />
                                        ) : (
                                            <>
                                                <iconHi.HiTrash size={16} />
                                                <span>Limpar notificacoes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <iconHi.HiBellSlash className="text-text-muted mx-auto mb-3" size={40} />
                                <p className="text-text-secondary">Voce nao tem notificacoes.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
};
