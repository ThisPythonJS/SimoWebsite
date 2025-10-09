import { FC, useContext, useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from "@chakra-ui/react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Team, UserStructure } from "../../types";
import { borderColor } from "../../utils/theme/border";
import { Button } from "../Mixed/Button";
import * as iconAI from "react-icons/ai";
import { FiUser, FiUsers, FiEdit3, FiImage, FiSave, FiX } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import api from "../../utils/api";
import { Teams } from "../Team/Teams";
import { UserLoading } from "../User/UserLoading";
import simo from "../../assets/images/simo.png";
import { DashboardBot } from "./Bot";

export const DashboardComponent: FC = () => {
    const { color } = useContext(ThemeContext);

    const [user, setUser] = useState<UserStructure>();
    const [teams, setTeams] = useState<Team[]>();
    const [editActions, setEditActions] = useState<{
        changesLoading?: boolean;
        changesMade?: boolean;
        bio?: string | null;
        banner_url?: string | null;
    }>({
        banner_url: user?.banner_url,
        bio: user?.bio,
        changesLoading: false,
        changesMade: false
    });

    const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setEditActions({ bio: event?.target.value, banner_url: editActions.banner_url, changesMade: true });

    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => setEditActions({ banner_url: event?.target.value, bio: editActions.bio, changesMade: true });

    const getUserTeams = async () => {
        const req = await api.getUserTeams();
        setTeams(req.data);
    };

    const getUserData = async () => {
        const { data: { banner_url, bio }, data } = await api.getUserData();
        setEditActions({ bio, banner_url });
        setUser(data);
    };

    const updateUser = async () => {
        try {
            setEditActions({ changesLoading: true, changesMade: true, banner_url: editActions.banner_url, bio: editActions.bio });

            let updatedUserData = {
                banner_url: editActions.banner_url as string | null,
                bio: editActions.bio as string | null
            };

            if (updatedUserData.bio === null) {
                updatedUserData.bio = null;
            }

            if (updatedUserData.banner_url === null) {
                updatedUserData.banner_url = null;
            }

            await api.patchUser(updatedUserData);

            setEditActions({ changesMade: false, changesLoading: false, banner_url: editActions.banner_url, bio: editActions.bio });
        } catch {
            setEditActions({ changesLoading: false, changesMade: false, banner_url: editActions.banner_url, bio: editActions.bio });
        }
    };

    useEffect(() => {
        getUserTeams();
    }, [user]);

    useEffect(() => {
        getUserData();
    }, []);

    return user ? (
        <main className="max-w-[1500px] w-full px-6 xl:px-4 mb-12">
            <section className="w-full flex flex-row xl:flex-col gap-8 text-white items-start xl:items-center justify-center my-10">
                
                <div className="relative w-full max-w-sm xl:max-w-none overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#080c14]"></div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8]/5 rounded-full blur-3xl"></div>
                    
                    {editActions.banner_url && (
                        <div className="relative h-40 overflow-hidden">
                            <img 
                                className="w-full h-full object-cover" 
                                onError={({ currentTarget }) => {
                                    currentTarget.src = "http://www.luquips.com.br/wp-content/uploads/2015/04/banner-vazio-300x86.png";
                                }} 
                                src={editActions.banner_url} 
                                alt="Banner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0e1a]/80"></div>
                        </div>
                    )}
                    
                    <div className={`relative flex flex-col items-center gap-4 p-8 ${editActions.banner_url ? "-mt-16" : ""}`}>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffff] to-[#00b4d8] rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
                            <img
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = simo;
                                }}
                                className="relative rounded-full w-32 h-32 border-4 border-[#00b4d8]/50 shadow-2xl"
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`}
                                alt={user.username}
                            />
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00b4d8] bg-clip-text text-transparent">
                                {user.username}
                            </h2>
                            <span className="text-gray-400 text-sm font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                {user.id}
                            </span>
                        </div>
                        
                        {editActions.bio && (
                            <p className="text-gray-300 text-center leading-relaxed max-w-xs">
                                {editActions.bio}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col gap-6">
                    <div className="text-center xl:text-center">
                        <h1 className="text-4xl xl:text-3xl font-bold mb-2">
                            Bem-vindo, <span className="bg-gradient-to-r from-[#00ffff] to-[#00b4d8] bg-clip-text text-transparent">{user?.username}</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Gerencie seu perfil e configurações</p>
                    </div>

                    <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ffff]/5 rounded-full blur-3xl"></div>
                        
                        <Tabs position="relative" variant="unstyled">
                            <div className="relative px-8 pt-6 pb-2">
                                <TabList className="flex gap-2 border-b border-white/10">
                                    <Tab className="flex items-center gap-2 px-6 py-3 rounded-t-xl text-gray-400 hover:text-white transition-all duration-300 _selected:text-white _selected:bg-white/5">
                                        <FiUser size={18} />
                                        <span className="font-semibold">Perfil</span>
                                    </Tab>
                                    <Tab className="flex items-center gap-2 px-6 py-3 rounded-t-xl text-gray-400 hover:text-white transition-all duration-300 _selected:text-white _selected:bg-white/5">
                                        <FiUsers size={18} />
                                        <span className="font-semibold">Times</span>
                                    </Tab>
                                    <Tab className="flex items-center gap-2 px-6 py-3 rounded-t-xl text-gray-400 hover:text-white transition-all duration-300 _selected:text-white _selected:bg-white/5">
                                        <BsRobot size={18} />
                                        <span className="font-semibold">Bots</span>
                                    </Tab>
                                </TabList>
                                <TabIndicator className="h-1 bg-gradient-to-r from-[#00ffff] to-[#00b4d8] rounded-full shadow-lg shadow-[#00ffff]/30" />
                            </div>

                            <TabPanels>
                                <TabPanel className="p-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="relative bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#00b4d8]/30 transition-all">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="p-3 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl">
                                                    <FiEdit3 className="text-[#00ffff]" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-white mb-1">Biografia</h3>
                                                    <p className="text-gray-400 text-sm">Fale mais sobre você em até 200 caracteres</p>
                                                </div>
                                            </div>
                                            <textarea
                                                value={editActions.bio || ""}
                                                onChange={handleBioChange}
                                                placeholder="Digite sua biografia aqui..."
                                                maxLength={200}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00b4d8]/50 transition-all resize-none h-32"
                                            />
                                            <div className="flex justify-end mt-2">
                                                <span className="text-xs text-gray-500">
                                                    {editActions.bio?.length || 0} / 200
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#00b4d8]/30 transition-all">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="p-3 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl">
                                                    <FiImage className="text-[#00ffff]" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-white mb-1">Banner</h3>
                                                    <p className="text-gray-400 text-sm">Cole a URL de uma imagem para usar como banner</p>
                                                </div>
                                            </div>
                                            <input
                                                value={editActions.banner_url || ""}
                                                onChange={handleBannerChange}
                                                placeholder="https://exemplo.com/banner.png"
                                                maxLength={200}
                                                type="url"
                                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00b4d8]/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </TabPanel>

                                <TabPanel className="p-8">
                                    <Teams teams={teams} />
                                </TabPanel>

                                <TabPanel className="p-8">
                                    <DashboardBot />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </div>
                </div>
            </section>

            {editActions.changesMade && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
                    <div className="relative bg-gradient-to-r from-[#0a0e1a] to-[#0f1419] border border-white/20 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/5 to-[#00b4d8]/5"></div>
                        <div className="relative flex items-center gap-6 px-8 py-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-[#00ffff]/20 rounded-lg">
                                    <iconAI.AiOutlineWarning className="text-[#00ffff]" size={24} />
                                </div>
                                <span className="text-white font-semibold">Você tem alterações não salvas</span>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setEditActions({ changesMade: false, banner_url: user.banner_url, bio: user.bio })}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-300 hover:scale-105"
                                >
                                    <FiX size={18} />
                                    Desfazer
                                </button>
                                <button
                                    onClick={updateUser}
                                    disabled={editActions.changesLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 border border-[#00ffff]/40 hover:border-[#00ffff]/60 text-white font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-[#00ffff]/20"
                                >
                                    {editActions.changesLoading ? (
                                        <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={18} />
                                    ) : (
                                        <FiSave size={18} />
                                    )}
                                    {editActions.changesLoading ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    ) : (
        <UserLoading />
    );
};
