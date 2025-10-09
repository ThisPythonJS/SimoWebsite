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
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const User: React.FC = () => {
    const params: Params = useParams<string>();
    const userid: string = params.userid as string;
    const [user, setUser] = useState<UserStructure>();
    const [userBots, setUserBots] = useState<BotStructure[]>([]);
    const [showBadgesInfo, setShowBadgesInfo] = useState(false);
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

    return (
        <main className="max-w-[1500px] flex justify-center text-white">
            {!user ? (
                <UserLoading />
            ) : (
                <section className="w-screen flex flex-row p-5 items-start xl:items-center justify-center gap-10 xl:flex-col">
                    {/* Card lateral */}
                    <div
                        className={`${borderColor[color]} border-2 ${
                            user.banner_url ? "min-h-[260px]" : "p-6"
                        } ${
                            user?.flags > 0 && user.banner_url && "min-h-[320px]"
                        } w-[320px] xl:w-[90vw] rounded-2xl bg-neutral-900/60 backdrop-blur-lg shadow-lg flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01]`}
                    >
                        {user.banner_url && (
                            <img
                                className="w-full h-40 object-cover rounded-t-lg opacity-90"
                                src={user.banner_url}
                                alt="Banner do usuário"
                            />
                        )}

                        {/* Avatar */}
                        <div
                            className={`w-full flex justify-center ${
                                user.banner_url &&
                                "absolute top-[90px] left-0 transform translate-y-[0%]"
                            }`}
                        >
                            <img
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = simo;
                                }}
                                className="rounded-full w-32 border-4 border-neutral-900 shadow-xl"
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                alt={`${user.username}'s Avatar`}
                            />
                        </div>

                        {/* Nome e ID */}
                        <div className="flex flex-col items-center gap-1 z-2 relative mt-[120px]">
                            <strong className="text-xl font-bold tracking-wide">{user.username}</strong>
                            <CopyButton name="ID" text={user.id} key={Math.random()} />
                        </div>

                        {/* Badges / Flags */}
                        {user.flags > 0 && (
                            <div className="flex justify-center mt-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowBadgesInfo(true)}
                                    className="p-3 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-all duration-300"
                                >
                                    <Badges key={Math.random()} flags={user.flags} />
                                </motion.button>
                            </div>
                        )}

                        {/* Modal de informações das flags */}
                        <AnimatePresence>
                            {showBadgesInfo && (
                                <motion.div
                                    className="fixed inset-0 flex justify-center items-center bg-black/50 z-[100]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="bg-neutral-900 rounded-xl p-6 w-[90%] md:w-[500px] border border-neutral-700 shadow-lg relative"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                    >
                                        <button
                                            onClick={() => setShowBadgesInfo(false)}
                                            className="absolute top-3 right-3 text-gray-400 hover:text-white"
                                        >
                                            <X size={20} />
                                        </button>

                                        <h2 className="text-xl font-bold mb-4 text-center">Suas Insígnias</h2>
                                        <Badges flags={user.flags} />
                                        <p className="text-sm mt-4 text-neutral-400 text-center">
                                            Cada insígnia representa uma conquista ou status especial na plataforma.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Infos e bots */}
                    <div className="flex items-start w-full flex-col gap-3">
                        <h1 className="text-[33px]">
                            Perfil de <strong>{user.username}</strong>
                        </h1>
                        {user?.bio && (
                            <span
                                className={
                                    user.bio.includes(" ")
                                        ? "break-words text-neutral-300"
                                        : "break-all text-neutral-300"
                                }
                            >
                                {user.bio}
                            </span>
                        )}

                        <hr className="w-full my-3 border-neutral-700" />

                        <div className="w-full flex xl:items-center xl:justify-center">
                            {userBots.length === 0 ? (
                                <div className="text-center text-[22px] text-neutral-400">
                                    {user.username} não tem bots para serem listados.
                                </div>
                            ) : (
                                <div className="grid-cols-2 grid gap-8 text-white m-2 xl:grid-cols-1 xl:place-items-center xl:w-[95vw]">
                                    {userBots.map((bot: BotStructure, index: number) => (
                                        <BotCard key={index} bot={bot} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};
