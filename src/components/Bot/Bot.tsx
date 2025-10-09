import { useEffect, useState, useContext, FC } from "react";
import { useParams, Link, Params } from "react-router-dom";
import { BotStructure, Team } from "../../types";
import api from '../../utils/api';
import { ThemeContext } from "../../contexts/ThemeContext";
import { Feedbacks } from "../../components/Feedbacks/Feedbacks";
import { Markdown } from "../../components/Markdown/Markdown";
import { borderAndBg } from "../../utils/theme/border&bg";
import { borderColor } from "../../utils/theme/border";
import * as icon from "react-icons/bs";
import { TiArrowSortedUp } from "react-icons/ti";
import { FiUser, FiUsers, FiHash, FiTag, FiExternalLink } from "react-icons/fi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BotLoading } from "./BotLoading";
import { CopyButton } from "../Mixed/Copy";

export const BotComponent: FC = () => {
    const params: Params = useParams<string>();
    const botid: string = params.botid as string;
    const { color } = useContext(ThemeContext);

    const [botData, setBotData] = useState<BotStructure>();
    const [stars, setStars] = useState<number>(0);
    const [dev, setDev] = useState<{ id: string, avatar: string, username: string }>();
    const [team, setTeam] = useState<Team | null>();

    const getBotStars = async () => {
        const res = await api.getBotFeedbacks(params.botid as string);
        const stars = res.data.map(a => a.stars);
        let count = 0;
        stars?.forEach(value => count += value as number);
        return setStars(Math.round(count / stars.length));
    };

    const getBotData = async () => {
        try {
            const { data: { owner_id }, data } = await api.getBotInfos(botid);
            const { data: { username, avatar, id } } = await api.getUserFromDB(owner_id);

            if (data.team_id) {
                const team = await api.getTeam(data.team_id as string);
                setTeam(!team.data ? null : team.data);
            }

            setDev({ username, avatar, id });
            setBotData(data);
        } catch (error) {
            console.error(error);
            window.location.href = "/";
        }
    };

    useEffect(() => {
        getBotData();
        getBotStars();
    }, []);

    return botData ? (
        <section className="max-w-[1500px] w-full px-6 xl:px-4 mb-12">
            {!botData.approved && (
                <div className="fixed flex items-center justify-center backdrop-blur-md inset-0 z-50 bg-black/60">
                    <div className="relative flex gap-6 items-center justify-center flex-col w-[90%] max-w-lg p-12 rounded-3xl bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309] shadow-2xl shadow-orange-600/40 border-2 border-orange-400/30">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                        <div className="relative">
                            <icon.BsClockFill size={56} className="text-white drop-shadow-lg" />
                            <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full animate-pulse"></div>
                        </div>
                        <div className="relative flex flex-col gap-3 items-center">
                            <span className="text-2xl text-center text-white font-bold leading-relaxed">
                                Bot <span className="text-yellow-100">{botData.name}</span> em análise
                            </span>
                            <p className="text-white/90 text-center text-lg">Aguarde a aprovação da equipe</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center gap-6 my-6">
                <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-[#00b4d8]/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,255,0.08),transparent_70%)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#080c14]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ffff]/5 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-6 p-8 xl:p-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffff] via-[#00d4ff] to-[#00b4d8] rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
                            <img
                                className="relative w-32 h-32 xl:w-28 xl:h-28 rounded-3xl border-3 border-[#00b4d8]/50 shadow-2xl group-hover:scale-105 transition-all duration-500"
                                onError={async ({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                }}
                                src={`https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png?size=512`}
                                alt={botData.name}
                            />
                        </div>

                        <div className="flex flex-col gap-3 items-center">
                            <div className="flex items-center gap-3 flex-wrap justify-center">
                                <h1 className="text-4xl xl:text-3xl font-black bg-gradient-to-r from-[#00ffff] via-[#00d4ff] to-[#00b4d8] bg-clip-text text-transparent">
                                    {botData.name}
                                </h1>
                                <CopyButton name="ID" text={botData.id} key={Math.random()}/>
                            </div>

                            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-orange-500/15 backdrop-blur-xl px-4 py-2 rounded-full border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                                {Array(stars).fill(0).map((_, index) => (
                                    <icon.BsStarFill key={index} className="text-yellow-400 text-base" />
                                ))}
                                {Array(5 - stars).fill(0).map((_, index) => (
                                    <icon.BsStar key={index} className="text-gray-600 text-base" />
                                ))}
                                <span className="text-yellow-400 font-bold text-sm ml-1">{stars}.0</span>
                            </div>

                            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                                {botData.short_description}
                            </p>
                        </div>

                        <div className="flex flex-row gap-3 w-full max-w-md">
                            <Link
                                className="group relative overflow-hidden border-2 border-[#00ffff]/40 bg-gradient-to-br from-[#00ffff]/15 via-[#00d4ff]/10 to-[#00b4d8]/15 text-white font-bold transition-all duration-300 px-6 py-3 rounded-xl flex-1 text-center hover:scale-105 hover:shadow-lg hover:shadow-[#00ffff]/30 active:scale-95 hover:border-[#00ffff]/60"
                                to={`/vote/${botData.id}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                                    <TiArrowSortedUp size={20} className="text-[#00ffff]" />
                                    Votar
                                </span>
                            </Link>
                            <Link
                                className="group relative overflow-hidden border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white font-bold transition-all duration-300 px-6 py-3 rounded-xl flex-1 text-center hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95 backdrop-blur-sm"
                                to={`https://discord.com/api/oauth2/authorize?client_id=${botData.id}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                                    <icon.BsPlus size={20} />
                                    Adicionar
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="w-full grid lg:grid-cols-[1fr_400px] xl:grid-cols-1 gap-6">
                    <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 xl:p-5 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8]/5 rounded-full blur-3xl"></div>
                        <div className="relative prose prose-invert prose-base max-w-none">
                            <Markdown markdown={botData.long_description} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border-2 border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00ffff]/5 rounded-full blur-2xl"></div>
                            <div className="relative flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gradient-to-br from-[#00ffff]/30 to-[#00b4d8]/30 rounded-2xl shadow-lg shadow-[#00ffff]/20">
                                    <FiUser className="text-[#00ffff]" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Desenvolvedor</h2>
                            </div>
                            <Link 
                                to={`/user/${dev?.id}`} 
                                className="relative group block border-2 border-white/10 hover:border-[#00b4d8]/60 bg-white/5 hover:bg-[#00b4d8]/15 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center gap-5">
                                    <div className="relative">
                                        <img 
                                            onError={async ({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                            }} 
                                            className="rounded-2xl h-20 w-20 border-3 border-[#00b4d8]/40 group-hover:border-[#00ffff]/60 transition-all shadow-lg" 
                                            src={`https://cdn.discordapp.com/avatars/${dev?.id}/${dev?.avatar}.png?size=256`} 
                                            alt={dev?.username} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/30 to-[#00b4d8]/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white font-bold text-xl group-hover:text-[#00ffff] transition-colors">{dev?.username}</span>
                                        <span className="text-gray-400 text-sm font-medium">Criador do bot</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {team && (
                            <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border-2 border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#00b4d8]/5 rounded-full blur-2xl"></div>
                                <div className="relative flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-[#00ffff]/30 to-[#00b4d8]/30 rounded-2xl shadow-lg shadow-[#00ffff]/20">
                                        <FiUsers className="text-[#00ffff]" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Time</h2>
                                </div>
                                <Link 
                                    to={`/team/${team.id}`} 
                                    className="relative group block border-2 border-white/10 hover:border-[#00b4d8]/60 bg-white/5 hover:bg-[#00b4d8]/15 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center gap-5">
                                        <div className="relative">
                                            <img 
                                                onError={async ({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                                }} 
                                                className="rounded-2xl h-20 w-20 border-3 border-[#00b4d8]/40 group-hover:border-[#00ffff]/60 transition-all shadow-lg" 
                                                src={team.avatar_url} 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/30 to-[#00b4d8]/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-bold text-xl group-hover:text-[#00ffff] transition-colors">{team.name}</span>
                                            <span className="text-gray-400 text-sm font-medium">Equipe de desenvolvimento</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border-2 border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00ffff]/5 rounded-full blur-2xl"></div>
                            <div className="relative flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gradient-to-br from-[#00ffff]/30 to-[#00b4d8]/30 rounded-2xl shadow-lg shadow-[#00ffff]/20">
                                    <HiOutlineInformationCircle className="text-[#00ffff]" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Informações</h2>
                            </div>
                            
                            <div className="relative flex flex-col gap-5">
                                <div className="bg-white/5 p-5 rounded-2xl border-2 border-white/10 hover:border-[#00b4d8]/40 transition-all hover:bg-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <FiHash className="text-[#00ffff]" size={20} />
                                        <strong className="text-white text-lg">Prefixo</strong>
                                    </div>
                                    <span className="text-gray-200 font-mono text-lg bg-black/40 px-4 py-2 rounded-xl inline-block border border-white/10">
                                        {botData.prefixes.join(", ")}
                                    </span>
                                </div>

                                <div className="relative overflow-hidden bg-gradient-to-br from-[#00ffff]/15 to-[#00b4d8]/15 p-5 rounded-2xl border-2 border-[#00b4d8]/40 hover:border-[#00ffff]/60 transition-all hover:shadow-lg hover:shadow-[#00ffff]/20">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffff]/10 rounded-full blur-2xl"></div>
                                    <div className="relative flex items-center gap-3 mb-3">
                                        <TiArrowSortedUp className="text-[#00ffff] drop-shadow-lg" size={24} />
                                        <strong className="text-white text-lg">Total de Votos</strong>
                                    </div>
                                    <span className="text-[#00ffff] text-4xl font-black drop-shadow-lg">
                                        {botData.votes.reduce((votesCount, vote) => votesCount + vote.votes, 0)}
                                    </span>
                                </div>

                                <div className="bg-white/5 p-5 rounded-2xl border-2 border-white/10 hover:border-[#00b4d8]/40 transition-all hover:bg-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FiTag className="text-[#00ffff]" size={20} />
                                        <strong className="text-white text-lg">Tags</strong>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {botData.tags.map((tag, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-gradient-to-r from-[#00ffff]/25 to-[#00b4d8]/25 border-2 border-[#00b4d8]/50 px-4 py-2 rounded-xl text-sm text-[#00ffff] font-bold hover:border-[#00ffff]/70 hover:scale-110 transition-all cursor-default shadow-lg shadow-[#00b4d8]/20"
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
          {(botData.support_server || botData.source_code || botData.website_url) && (
                            <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border-2 border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#00b4d8]/5 rounded-full blur-2xl"></div>
                                <div className="relative flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-[#00ffff]/30 to-[#00b4d8]/30 rounded-2xl shadow-lg shadow-[#00ffff]/20">
                                        <FiExternalLink className="text-[#00ffff]" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Links</h2>
                                </div>
                                
                                <div className="relative flex flex-col gap-4">
                                    {botData?.support_server && (
                                        <Link 
                                            to={botData.support_server.includes("https://") ? botData.support_server : "https://" + botData.support_server} 
                                            className="group flex items-center gap-5 p-5 bg-gradient-to-r from-[#5662F6]/15 to-[#5662F6]/5 hover:from-[#5662F6]/25 hover:to-[#5662F6]/15 border-2 border-[#5662F6]/40 hover:border-[#5662F6]/70 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#5662F6]/30"
                                        >
                                            <div className="p-4 bg-[#5662F6]/30 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-[#5662F6]/30">
                                                <icon.BsDiscord size={28} className="text-[#5662F6]" />
                                            </div>
                                            <div className="flex flex-col flex-grow">
                                                <span className="text-white font-bold text-lg group-hover:text-[#5662F6] transition-colors">Discord</span>
                                                <span className="text-gray-400 font-medium">Servidor de suporte</span>
                                            </div>
                                            <FiExternalLink className="text-gray-400 group-hover:text-[#5662F6] transition-colors" size={20} />
                                        </Link>
                                    )}
                                    
                                    {botData?.source_code && (
                                        <Link 
                                            to={botData.source_code.includes("https://") ? botData.source_code : "https://" + botData.source_code} 
                                            className="group flex items-center gap-5 p-5 bg-white/5 hover:bg-white/15 border-2 border-white/20 hover:border-white/50 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-white/20"
                                        >
                                            <div className="p-4 bg-white/15 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                                                <icon.BsGithub size={28} className="text-white" />
                                            </div>
                                            <div className="flex flex-col flex-grow">
                                                <span className="text-white font-bold text-lg group-hover:text-gray-300 transition-colors">GitHub</span>
                                                <span className="text-gray-400 font-medium">Código fonte</span>
                                            </div>
                                            <FiExternalLink className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                                        </Link>
                                    )}
                                    
                                    {botData?.website_url && (
                                        <Link 
                                            to={botData.website_url.includes("https://") ? botData.website_url : "https://" + botData.website_url} 
                                            className="group flex items-center gap-5 p-5 bg-gradient-to-r from-[#00b4d8]/15 to-[#00ffff]/5 hover:from-[#00b4d8]/25 hover:to-[#00ffff]/15 border-2 border-[#00b4d8]/40 hover:border-[#00ffff]/70 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#00ffff]/30"
                                        >
                                            <div className="p-4 bg-[#00b4d8]/30 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-[#00b4d8]/30">
                                                <icon.BsGlobe size={28} className="text-[#00ffff]" />
                                            </div>
                                            <div className="flex flex-col flex-grow min-w-0">
                                                <span className="text-white font-bold text-lg group-hover:text-[#00ffff] transition-colors">Website</span>
                                                <span className="text-[#00b4d8] font-medium truncate">{botData.website_url}</span>
                                            </div>
                                            <FiExternalLink className="text-gray-400 group-hover:text-[#00ffff] transition-colors flex-shrink-0" size={20} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Feedbacks botid={botid} bot={botData} dev={dev} />
            </div>
        </section>
    ) : (
        <BotLoading />
    );
};
