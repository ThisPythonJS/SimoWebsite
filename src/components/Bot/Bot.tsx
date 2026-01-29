import { useEffect, useState, FC } from "react";
import { useParams, Link, Params } from "react-router-dom";
import { BotStructure, Team } from "../../types";
import api from '../../utils/api';
import { Feedbacks } from "../../components/Feedbacks/Feedbacks";
import { Markdown } from "../../components/Markdown/Markdown";
import * as iconHi from "react-icons/hi2";
import * as iconBs from "react-icons/bs";
import { BotLoading } from "./BotLoading";
import { CopyButton } from "../Mixed/Copy";
const simoLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simo.png-wQfR3Tsf6ul3BMkEA9IXy4QBjoCqeZ.webp";

export const BotComponent: FC = () => {
    const params: Params = useParams<string>();
    const botid: string = params.botid as string;

    const [botData, setBotData] = useState<BotStructure>();
    const [stars, setStars] = useState<number>(0);
    const [dev, setDev] = useState<{ id: string, avatar: string, username: string }>();
    const [team, setTeam] = useState<Team | null>();

    const getBotStars = async () => {
        const res = await api.getBotFeedbacks(params.botid as string);
        const starsArr = res.data.map(a => a.stars);
        let count = 0;
        starsArr?.forEach(value => count += value as number);
        return setStars(Math.round(count / starsArr.length));
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

    const totalVotes = botData?.votes.reduce((votesCount, vote) => votesCount + vote.votes, 0) || 0;

    return botData ? (
        <section className="max-w-[1200px] w-full px-4">
            {/* Pending Approval Banner */}
            {!botData.approved && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-dark-bg/80">
                    <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-md mx-4">
                        <div className="p-4 rounded-full bg-amber-500/20">
                            <iconHi.HiClock className="text-amber-500" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-white text-center">Em Analise</h2>
                        <p className="text-text-secondary text-center">
                            O bot <span className="text-white font-medium">{botData.name}</span> esta aguardando aprovacao. Por favor, aguarde ate que a analise seja concluida.
                        </p>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative mt-8 mb-8">
                {/* Banner Background */}
                <div className="h-40 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-accent/30 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
                    </div>
                </div>

                {/* Bot Info Card */}
                <div className="relative -mt-16 mx-4 xl:mx-2">
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6 xl:p-4">
                        <div className="flex xl:flex-col gap-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <img
                                    className="w-28 h-28 xl:w-24 xl:h-24 xl:mx-auto rounded-2xl border-4 border-dark-card shadow-xl object-cover bg-dark-elevated"
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = simoLogo;
                                    }}
                                    src={`https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png`}
                                    alt={botData.name}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 xl:text-center">
                                <div className="flex items-center gap-3 xl:justify-center mb-2">
                                    <h1 className="text-2xl font-bold text-white">{botData.name}</h1>
                                    {botData.verified && (
                                        <div className="p-1 rounded-full bg-accent/20">
                                            <iconHi.HiCheck className="text-accent" size={14} />
                                        </div>
                                    )}
                                    <CopyButton name="ID" text={botData.id} />
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-3 xl:justify-center">
                                    {Array(stars).fill(0).map((_, index) => (
                                        <iconHi.HiStar key={index} className="text-amber-400" size={18} />
                                    ))}
                                    {Array(5 - stars).fill(0).map((_, index) => (
                                        <iconHi.HiOutlineStar key={index} className="text-text-muted" size={18} />
                                    ))}
                                    <span className="text-text-muted text-sm ml-1">({stars}/5)</span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 xl:justify-center">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-elevated">
                                        <iconHi.HiArrowTrendingUp className="text-accent" size={16} />
                                        <span className="text-white text-sm font-medium">{totalVotes} votos</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-elevated">
                                        <iconHi.HiCommandLine className="text-primary-light" size={16} />
                                        <span className="text-white text-sm font-medium">{botData.prefixes.join(", ")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 xl:flex-row xl:justify-center">
                                <Link
                                    to={`/vote/${botData.id}`}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-light font-medium transition-all"
                                >
                                    <iconHi.HiArrowTrendingUp size={18} />
                                    <span>Votar</span>
                                </Link>
                                <Link
                                    to={botData.invite_url || `https://discord.com/api/oauth2/authorize?client_id=${botData.id}&permissions=70368744177655&scope=bot%20applications.commands`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-light text-white font-medium transition-all"
                                >
                                    <iconHi.HiPlus size={18} />
                                    <span>Adicionar</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-3 xl:grid-cols-1 gap-6 mb-8">
                {/* Description */}
                <div className="col-span-2 xl:col-span-1">
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <iconHi.HiDocumentText className="text-primary-light" size={20} />
                            Descricao
                        </h2>
                        <div className="prose prose-invert max-w-none text-text-secondary">
                            <Markdown markdown={botData.long_description} />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Developer */}
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <iconHi.HiUser className="text-primary-light" size={20} />
                            Desenvolvedor
                        </h2>
                        <Link 
                            to={`/user/${dev?.id}`} 
                            className="flex items-center gap-3 p-3 rounded-xl bg-dark-elevated hover:bg-dark-card-hover border border-dark-border transition-all"
                        >
                            <img 
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = simoLogo;
                                }} 
                                className="w-12 h-12 rounded-full object-cover" 
                                src={`https://cdn.discordapp.com/avatars/${dev?.id}/${dev?.avatar}.png`} 
                                alt={dev?.username}
                            />
                            <span className="font-medium text-white">{dev?.username}</span>
                        </Link>
                    </div>

                    {/* Team */}
                    {team && (
                        <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <iconHi.HiUserGroup className="text-primary-light" size={20} />
                                Time
                            </h2>
                            <Link 
                                to={`/team/${team.id}`} 
                                className="flex items-center gap-3 p-3 rounded-xl bg-dark-elevated hover:bg-dark-card-hover border border-dark-border transition-all"
                            >
                                <img 
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = simoLogo;
                                    }} 
                                    className="w-12 h-12 rounded-full object-cover" 
                                    src={team.avatar_url} 
                                    alt={team.name}
                                />
                                <span className="font-medium text-white">{team.name}</span>
                            </Link>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <iconHi.HiTag className="text-primary-light" size={20} />
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {botData.tags.map((tag, index) => (
                                <span 
                                    key={index} 
                                    className="px-3 py-1.5 text-sm rounded-lg bg-dark-elevated text-text-secondary border border-dark-border"
                                >
                                    # {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {(botData.support_server || botData.source_code || botData.website_url) && (
                        <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <iconHi.HiLink className="text-primary-light" size={20} />
                                Links
                            </h2>
                            <div className="space-y-2">
                                {botData.support_server && (
                                    <a 
                                        href={botData.support_server.includes("https://") ? botData.support_server : "https://" + botData.support_server}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-dark-elevated hover:bg-dark-card-hover border border-dark-border transition-all"
                                    >
                                        <iconBs.BsDiscord className="text-[#5662F6]" size={20} />
                                        <span className="text-text-secondary">Servidor de Suporte</span>
                                    </a>
                                )}
                                {botData.source_code && (
                                    <a 
                                        href={botData.source_code.includes("https://") ? botData.source_code : "https://" + botData.source_code}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-dark-elevated hover:bg-dark-card-hover border border-dark-border transition-all"
                                    >
                                        <iconBs.BsGithub className="text-white" size={20} />
                                        <span className="text-text-secondary">Repositorio</span>
                                    </a>
                                )}
                                {botData.website_url && (
                                    <a 
                                        href={botData.website_url.includes("https://") ? botData.website_url : "https://" + botData.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-dark-elevated hover:bg-dark-card-hover border border-dark-border transition-all"
                                    >
                                        <iconHi.HiGlobeAlt className="text-primary-light" size={20} />
                                        <span className="text-text-secondary">Website</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Feedbacks */}
            <Feedbacks botid={botid} bot={botData} dev={dev} />
        </section>
    ) : (
        <BotLoading />
    );
};
