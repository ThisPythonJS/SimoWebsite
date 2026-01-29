import React, { useState, useEffect } from "react";
import { BotStructure } from "../../types";
import { Botloading } from "./Botloading";
import api from "../../utils/api";
import { BotCard } from "./BotCard";
import { Link } from "react-router-dom";
import * as iconHi from "react-icons/hi2";
const simoLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simo.png-wQfR3Tsf6ul3BMkEA9IXy4QBjoCqeZ.webp";

export const Bots: React.FC = () => {
    const [data, setData] = useState<BotStructure[]>([]);
    const [botsToShow, setBotsToShow] = useState<number>(6);
    const [prevBotsToShow, setPrevBotsToShow] = useState<number>(0);
    const [showLoadMore, setShowLoadMore] = useState<boolean>(true);
    const [botLoading, setBotLoading] = useState<boolean>(false);

    const fetchData = async (startAt: number, endAt: number) => {
        setBotLoading(true);
        const res = await api.getAllBots(startAt, endAt);
        setData((prevData) => [...prevData, ...res.data]);
        
        const { data: { bots } } = await api.getApiStatus();
        if (data.length >= bots) {
            setShowLoadMore(false);
        } else {
            setShowLoadMore(true);
        }
        setBotLoading(false);
    };

    useEffect(() => {
        fetchData(prevBotsToShow, botsToShow);
    }, [botsToShow]);

    const loadMoreBots = () => {
        setBotsToShow((prevBots) => {
            const newBotsToShow = prevBots + 6;
            setPrevBotsToShow(prevBots);
            return newBotsToShow;
        });
    };

    // Get top voted bots for featured section
    const topVotedBots = [...data]
        .sort((a, b) => {
            const votesA = a.votes.reduce((sum, v) => sum + v.votes, 0);
            const votesB = b.votes.reduce((sum, v) => sum + v.votes, 0);
            return votesB - votesA;
        })
        .slice(0, 4);

    return (
        <div className="max-w-[1200px] w-full px-4 xl:px-3">
            {/* Hero Section */}
            <section className="relative py-16 xl:py-10 text-center overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]"></div>
                </div>
                
                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent p-[2px] animate-pulse-glow">
                                <div className="w-full h-full rounded-3xl bg-dark-bg flex items-center justify-center">
                                    <img src={simoLogo} alt="Simo" className="w-16 h-16 object-contain" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                <iconHi.HiCheck className="text-white" size={16} />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl xl:text-3xl font-bold text-white mb-4 text-balance">
                        Descubra os melhores
                        <span className="gradient-text"> Bots para Discord</span>
                    </h1>
                    
                    <p className="text-text-secondary text-lg xl:text-base max-w-xl mx-auto mb-8 text-balance">
                        Explore nossa colecao de bots incriveis e adicione funcionalidades poderosas ao seu servidor
                    </p>
                    
                    {/* Search bar for mobile */}
                    <form action="/search" className="max-w-md mx-auto mb-8">
                        <div className="flex items-center gap-3 bg-dark-card rounded-xl px-4 py-3 border border-dark-border hover:border-primary/30 transition-all">
                            <iconHi.HiMagnifyingGlass className="text-text-muted" size={20} />
                            <input
                                className="bg-transparent outline-none w-full text-white placeholder:text-text-muted"
                                name="bot"
                                placeholder="Buscar bots..."
                            />
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium transition-all">
                                Buscar
                            </button>
                        </div>
                    </form>
                    
                    {/* Quick actions */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Link 
                            to="/addbot"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white font-medium transition-all"
                        >
                            <iconHi.HiPlus size={18} />
                            <span>Adicionar Bot</span>
                        </Link>
                        <a 
                            href="https://discord.gg/DGDEJtRsms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 text-white font-medium transition-all"
                        >
                            <iconHi.HiChatBubbleLeftRight size={18} />
                            <span>Discord</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Top Voted Section */}
            {topVotedBots.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/20">
                                <iconHi.HiArrowTrendingUp className="text-accent" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Mais Votados</h2>
                                <p className="text-text-muted text-sm">Bots com mais votos este mes</p>
                            </div>
                        </div>
                        <Link 
                            to="/search" 
                            className="flex items-center gap-1 text-primary-light hover:text-primary transition-colors text-sm font-medium"
                        >
                            <span>Ver mais</span>
                            <iconHi.HiArrowRight size={16} />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-4 xl:grid-cols-2 sm:grid-cols-1 gap-4">
                        {topVotedBots.map((bot, index) => (
                            <BotCard bot={bot} key={`top-${bot.id}-${index}`} />
                        ))}
                    </div>
                </section>
            )}

            {/* All Bots Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                            <iconHi.HiSquares2X2 className="text-primary-light" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Todos os Bots</h2>
                            <p className="text-text-muted text-sm">Explore nossa colecao completa</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                    {data.map((bot: BotStructure, index: number) => (
                        <BotCard bot={bot} key={`all-${bot.id}-${index}`} />
                    ))}
                </div>

                {botLoading && <Botloading fills={6} />}

                {!botLoading && showLoadMore && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={loadMoreBots}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 text-white font-medium transition-all"
                        >
                            <iconHi.HiArrowPath size={18} />
                            <span>Carregar Mais</span>
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};
