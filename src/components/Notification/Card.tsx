import { FC, useState } from "react";
import { NotificationBody, Theme, UserStructure } from "../../types";
import * as iconHi from "react-icons/hi2";
import * as iconAI from "react-icons/ai";
import api from "../../utils/api";
import { Markdown } from "../Markdown/Markdown";
import simoLogo from "../../assets/images/simo-logo.png";

export const NotificationCard: FC<{
    notification: NotificationBody;
    color: Theme;
    user: UserStructure | null;
    keyc: string;
    updateNotifications: () => Promise<void>;
    mobile?: boolean;
}> = ({ notification, color, user, keyc, updateNotifications, mobile }) => {
    const [deleted, setDeleted] = useState<boolean>(false);

    const handleDeleteNotification = async (): Promise<void> => {
        setDeleted(true);
        await api.deleteNotification(user?.id, keyc);
        await updateNotifications();
        setDeleted(false);
    };

    const typeSchemas: Record<number, { colors: string; bgColor: string; icon: React.ReactNode; url?: string }> = {
        0: {
            colors: "border-l-text-muted",
            bgColor: "bg-dark-elevated",
            icon: <iconHi.HiChatBubbleLeft className="text-text-muted" size={24} />
        },
        1: {
            colors: "border-l-accent",
            bgColor: "bg-accent/10",
            icon: <iconHi.HiCheckCircle className="text-accent" size={24} />
        },
        2: {
            colors: "border-l-red-500",
            bgColor: "bg-red-500/10",
            icon: <iconHi.HiXCircle className="text-red-500" size={24} />
        },
        3: {
            colors: "border-l-primary",
            bgColor: "bg-primary/10",
            icon: <iconHi.HiInformationCircle className="text-primary-light" size={24} />
        }
    };

    const cardStyles = `flex items-center gap-3 ${typeSchemas[notification.type].colors} ${typeSchemas[notification.type].bgColor} border-l-4 border border-dark-border rounded-lg p-3 w-full transition-all hover:border-dark-border/80`;

    return (
        <div className={cardStyles}>
            {notification.type !== 3 ? (
                typeSchemas[notification.type].icon
            ) : (
                <img 
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = simoLogo;
                    }} 
                    className="w-10 h-10 rounded-full object-cover" 
                    src={notification.url || simoLogo}
                    alt="Notification"
                />
            )}
            <div className="flex-1 min-w-0">
                <div className="text-sm text-white">
                    <Markdown markdown={notification.content} />
                </div>
                {notification.sent_at && (
                    <p className="text-xs text-text-muted mt-1">
                        {new Date(notification.sent_at).toLocaleDateString('pt-BR')}
                    </p>
                )}
            </div>
            <button 
                disabled={deleted} 
                onClick={handleDeleteNotification} 
                className="p-1.5 rounded-lg hover:bg-dark-card-hover transition-colors disabled:cursor-default flex-shrink-0"
            >
                {deleted ? (
                    <iconAI.AiOutlineLoading3Quarters className="text-text-muted animate-spin" size={18} />
                ) : (
                    <iconHi.HiXMark className="text-text-muted hover:text-red-400 transition-colors" size={18} />
                )}
            </button>
        </div>
    );
};
