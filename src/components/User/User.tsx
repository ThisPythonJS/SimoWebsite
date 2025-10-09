import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { Params, useParams } from "react-router-dom";
import { BotStructure, UserStructure } from "../../types";
import { ThemeContext } from "../../contexts/ThemeContext";
import { borderColor } from "../../utils/theme/border";
import { BotCard } from "../BotList/BotCard";
import { UserLoading } from "./UserLoading";
import simo from "../../assets/images/simo.png";
import { CopyButton } from "../Mixed/Copy";
import { Badges } from "../Badges/Badges";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const User: React.FC = () => {
    const params: Params = useParams<string>();
    const userid: string = params.userid as string;
    const [user, setUser] = useState<UserStructure>();
    const [userBots, setUserBots] = useState<BotStructure[]>([]);
    const [showFlagsInfo, setShowFlagsInfo] = useState(false);
    const { color } = useContext(ThemeContext);

    const getUserData = async () => {
        try {
            const { data } = await api.getUserFromDB(userid);
            const bots = await api.getAllBots();
            const userBots = bots.data.filter((bot) => bot.owner_id === userid);
            setUserBots(userBots);
            setUser(data);
        } catch (error) {
            console.error(error);
            window.location.href = "/";
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    if (!user) return <UserLoading />;

    return (
        <main className="flex justify-center w-full text-white px-4 py-6">
            <section className="flex flex-col w-full max-w-[1200px] bg-neutral-950/50 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                {/* Banner */}
                <div className="relative w-full h-[230px] bg-neutral-900">
                    {user.banner_url ? (
                        <img
                            src={user.banner_url}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
                    )}
                    {/* Avatar centralizado */}
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <img
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = simo;
                            }}
                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                            alt={user.username}
                            className="w-32 h-32 rounded-full border-[6px] border-neutral-950 shadow-xl object-cover"
                        />
                    </div>
                </div>

                {/* Infos principais */}
                <div className="flex flex-col items-center mt-20 pb-6 text-center px-6">
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <CopyButton name="ID" text={user.id} />
                    </div>

                    {/* Quadradinho de flags */}
                    {user.flags > 0 && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowFlagsInfo(true)}
                                className="flex items-center justify-center w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 transition-all duration-200"
                                title="Ver insígnias"
                            >
                                <Badges flags={user.flags} />
                            </button>
                        </div>
                    )}

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-neutral-400 mt-5 max-w-[600px] text-sm leading-relaxed">
                            {user.bio}
                        </p>
                    )}
                </div>

                {/* Lista de bots */}
                <div className="border-t border-neutral-800 py-8 px-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Bots de {user.username}</h2>
                    {userBots.length === 0 ? (
                        <div className="text-center text-neutral-400 text-lg">
                            Nenhum bot encontrado.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 xl:grid-cols-1 gap-8 place-items-center">
                            {userBots.map((bot: BotStructure, index: number) => (
                                <BotCard key={index} bot={bot} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal das flags */}
            <AnimatePresence>
                {showFlagsInfo && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-[90%] max-w-[420px] shadow-lg relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <button
                                onClick={() => setShowFlagsInfo(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-bold mb-4 text-center">Suas Insígnias</h3>
                            <Badges flags={user.flags} />
                            <p className="text-neutral-400 text-sm text-center mt-3">
                                Cada insígnia representa uma conquista ou status especial na plataforma.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};
