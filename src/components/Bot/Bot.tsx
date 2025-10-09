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
        <section className="max-w-[1500px] w-full px-6 xl:px-4">
            {!botData.approved && (
                <div className="fixed flex items-center justify-center backdrop-blur-md inset-0 z-50 bg-black/50">
                    <div className="flex gap-5 items-center justify-center flex-col w-[90%] max-w-lg p-10 border-2 rounded-3xl bg-gradient-to-br from-[#e8a60c] via-[#d89b0a] to-[#c78a09] border-[#9e7514] shadow-2xl shadow-orange-500/20">
                        <div className="relative">
                            <icon.BsClockFill size={50} className="text-white" />
                            <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
                        </div>
                        <span className="text-xl text-center text-white font-bold leading-relaxed">
                            A aplicação <span className="text-yellow-100">{botData.name}</span> está em análise
                        </span>
                        <p className="text-white/80 text-center">Aguarde até que a análise seja finalizada</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center gap-8 my-8">
                <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/10 via-[#00b4d8]/5 to-transparent animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0e1a] via-[#0f1419] to-[#12161f]"></div>
                    <div className="relative z-10 flex xl:flex-col items-center gap-8 p-10 xl:p-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff] to-[#00b4d8] rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                            <img
                                className="relative w-36 h-36 xl:w-32 xl:h-32 rounded-3xl border-4 border-[#00b4d8]/50 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                                onError={async ({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                }}
                                src={`https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png`}
                                alt={botData.name + "'s Avatar"}
                            />
                        </div>
                        <div className="flex-grow flex flex-col gap-4 xl:items-center xl:text-center">
                            <div className="flex items-center gap-4 xl:flex-col">
                                <h1 className="text-5xl xl:text-4xl font-bold bg-gradient-to-r from-[#00ffff] via-[#00d4ff] to-[#00b4d8] bg-clip-text text-transparent">
                                    {botData.name}
                                </h1>
                                <CopyButton name="ID" text={botData.id} key={Math.random()}/>
                            </div>
                            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-yellow-500/30 w-fit">
                                {Array(stars).fill(0).map((_, index) => (
                                    <icon.BsStarFill key={index} className="text-yellow-400 text-lg" />
                                ))}
                                {Array(5 - stars).fill(0).map((_, index) => (
                                    <icon.BsStar key={index} className="text-gray-600 text-lg" />
                                ))}
                                <span className="text-yellow-400 font-bold ml-2">{stars}.0</span>
                            </div>

                            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                                {botData.short_description}
                            </p>
                        </div>
                        <div className="flex xl:flex-col gap-4 xl:w-full">
                            <Link
                                className="group relative overflow-hidden border-2 border-[#00ffff]/40 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 text-white font-bold transition-all duration-300 px-8 py-4 rounded-xl min-w-[160px] text-center hover:scale-105 hover:shadow-lg hover:shadow-[#00ffff]/30 active:scale-95"
                                to={`/vote/${botData.id}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <TiArrowSortedUp size={24} className="text-[#00ffff]" />
                                    Votar
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </Link>
                            <Link
                                className="group relative overflow-hidden border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-bold transition-all duration-300 px-8 py-4 rounded-xl min-w-[160px] text-center hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95"
                                to={`https://discord.com/api/oauth2/authorize?client_id=${botData.id}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <icon.BsPlus size={24} />
                                    Adicionar
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full grid lg:grid-cols-[1fr_380px] gap-6">
                    <div className="bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] border border-white/10 rounded-3xl p-8 xl:p-6 shadow-2xl">
                        <div className="prose prose-invert prose-lg max-w-none">
                            <Markdown markdown={botData.long_description} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl">
                                    <FiUser className="text-[#00ffff]" size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Desenvolvedor</h2>
                            </div>
                            <Link 
                                to={`/user/${dev?.id}`} 
                                className="group block border-2 border-white/10 hover:border-[#00b4d8]/50 bg-white/5 hover:bg-[#00b4d8]/10 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            onError={async ({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                            }} 
                                            className="rounded-2xl h-16 w-16 border-2 border-[#00b4d8]/30 group-hover:border-[#00ffff]/50 transition-all" 
                                            src={`https://cdn.discordapp.com/avatars/${dev?.id}/${dev?.avatar}.png?size=2048`} 
                                            alt={`${dev?.username}'s Avatar`} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-lg group-hover:text-[#00ffff] transition-colors">{dev?.username}</span>
                                        <span className="text-gray-400 text-sm">Criador do bot</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {team && (
                            <div className="bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] border border-white/10 rounded-3xl p-6 shadow-2xl">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl">
                                        <FiUsers className="text-[#00ffff]" size={22} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Time</h2>
                                </div>
                                <Link 
                                    to={`/team/${team.id}`} 
                                    className="group block border-2 border-white/10 hover:border-[#00b4d8]/50 bg-white/5 hover:bg-[#00b4d8]/10 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img 
                                                onError={async ({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                                }} 
                                                className="rounded-2xl h-16 w-16 border-2 border-[#00b4d8]/30 group-hover:border-[#00ffff]/50 transition-all" 
                                                src={team.avatar_url} 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-lg group-hover:text-[#00ffff] transition-colors">{team.name}</span>
                                            <span className="text-gray-400 text-sm">Equipe de desenvolvimento</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                        <div className="bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl">
                                    <HiOutlineInformationCircle className="text-[#00ffff]" size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Informações</h2>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-[#00b4d8]/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiHash className="text-[#00ffff]" size={18} />
                                        <strong className="text-white">Prefixo</strong>
                                    </div>
                                    <span className="text-gray-300 font-mono bg-black/30 px-3 py-1 rounded-lg inline-block">
                                        {botData.prefixes.join(", ")}
                                    </span>
                                </div>
                                <div className="bg-gradient-to-br from-[#00ffff]/10 to-[#00b4d8]/10 p-4 rounded-2xl border border-[#00b4d8]/30 hover:border-[#00ffff]/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TiArrowSortedUp className="text-[#00ffff]" size={20} />
                                        <strong className="text-white">Total de Votos</strong>
                                    </div>
                                    <span className="text-[#00ffff] text-3xl font-bold">
                                        {botData.votes.reduce((votesCount, vote) => votesCount + vote.votes, 0)}
                                    </span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-[#00b4d8]/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiTag className="text-[#00ffff]" size={18} />
                                        <strong className="text-white">Tags</strong>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {botData.tags.map((tag, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 border border-[#00b4d8]/40 px-3 py-1.5 rounded-xl text-sm text-[#00ffff] font-semibold hover:border-[#00ffff]/60 hover:scale-105 transition-all cursor-default"
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                                    {botData?.support_server && (
                                        <Link 
                                            to={botData?.support_server.includes("https://") ? botData?.support_server : "https://" + botData?.support_server} 
                                            className="group flex items-center gap-4 p-4 bg-gradient-to-r from-[#5662F6]/10 to-[#5662F6]/5 hover:from-[#5662F6]/20 hover:to-[#5662F6]/10 border border-[#5662F6]/30 hover:border-[#5662F6]/50 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <div className="p-3 bg-[#5662F6]/20 rounded-xl group-hover:scale-110 transition-transform">
                                                <icon.BsDiscord size={24} className="text-[#5662F6]" />
                                            </div>
                                            <div className="flex flex-col flex-grow">
                                                <span className="text-white font-semibold group-hover:text-[#5662F6] transition-colors">Discord</span>
                                                <span className="text-gray-400 text-sm">Servidor de suporte</span>
                                            </div>
                                            <FiExternalLink className="text-gray-400 group-hover:text-[#5662F6] transition-colors" size={18} />
                                        </Link>
                                    )}
                                    
                                    {botData?.source_code && (
                                        <Link 
                                            to={botData?.source_code.includes("https://") ? botData?.source_code : "https://" + botData?.source_code} 
                                            className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                                                <icon.BsGithub size={24} className="text-white" />
                                            </div>
                                            <div className="flex flex-col flex-grow">
                                                <span className="text-white font-semibold group-hover:text-gray-300 transition-colors">GitHub</span>
                                                <span className="text-gray-400 text-sm">Código fonte</span>
                                            </div>
                                            <FiExternalLink className="text-gray-400 group-hover:text-white transition-colors" size={18} />
                                        </Link>
                                    )}
                                    
                                    {botData?.website_url && (
                                        <Link 
                                            to={botData?.website_url.includes("https://") ? botData?.website_url : "https://" + botData?.website_url} 
                                            className="group flex items-center gap-4 p-4 bg-gradient-to-r from-[#00b4d8]/10 to-[#00ffff]/5 hover:from-[#00b4d8]/20 hover:to-[#00ffff]/10 border border-[#00b4d8]/30 hover:border-[#00ffff]/50 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <div className="p-3 bg-[#00b4d8]/20 rounded-xl group-hover:scale-110 transition-transform">
                                                <icon.BsGlobe size={24} className="text-[#00ffff]" />
                                            </div>
                                            <div className="flex flex-col flex-grow min-w-0">
                                                <span className="text-white font-semibold group-hover:text-[#00ffff] transition-colors">Website</span>
                                                <span className="text-[#00b4d8] text-sm truncate">{botData?.website_url}</span>
                                            </div>
                                            <FiExternalLink className="text-gray-400 group-hover:text-[#00ffff] transition-colors flex-shrink-0" size={18} />
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
