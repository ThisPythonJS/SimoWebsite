import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BotStructure } from "../../types";
import { UserContext } from "../../contexts/UserContext";
import api from '../../utils/api';
import { ThemeContext } from "../../contexts/ThemeContext";
import { VoteLoading } from "./Loading";
import { buttonColor } from "../../utils/theme/button";
import { borderColor } from "../../utils/theme/border";
import * as icon from "react-icons/ai";
import { TiArrowSortedUp } from "react-icons/ti";
import { FiCheckCircle, FiClock, FiLogIn } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { BotCard } from "../BotList/BotCard";
import { Botloading } from "../BotList/Botloading";

export const VoteComponent: React.FC = () => {
    const { user } = useContext(UserContext);
    const { botid } = useParams<string>();
    const { color } = useContext(ThemeContext);

    const [voteStatus, setVoteStatus] = useState<{ can_vote: boolean; rest_time: number; }>();
    const [botData, setBotData] = useState<BotStructure>();
    const [votes, setVotes] = useState<number>(0);
    const [voted, setVoted] = useState<boolean>();
    const [clicked, setClicked] = useState<boolean>(false);
    const [bots, setBots] = useState<BotStructure[]>([]);
    const [botLoading, setBotLoading] = useState<boolean>(false);
    const [restTime, setRestTime] = useState<number>();

    const getVoteStatus = async (): Promise<void> => {
        const { data: { rest_time }, data } = await api.voteStatus(botid as string);
        const timestamp = Math.floor((rest_time / 1000) / 3600);
        setRestTime(timestamp);
        return setVoteStatus(data);
    };

    const getVoteData = async () => {
        const { data: { votes }, data } = await api.getBotInfos(botid as string);
        setBotData(data);
        setVotes(votes.reduce((votesCount, vote) => votesCount + vote.votes, 0) as number);
    };

    const getRandomMinMax = (length: number): number[] => {
        const min = Math.floor(Math.random() * (length - 2));
        const max = min + 2;
        return [min, max];
    };

    const getSuggestedBots = async () => {
        setBotLoading(true);
        const botCount = await api.getApiStatus();
        const [min, max] = getRandomMinMax(botCount.data.bots);
        const allBots = await api.getAllBots(min, max);
        setBots(allBots.data);
        setBotLoading(false);
    };

    const handleVote = async () => {
        setClicked(true);
        await api.voteBot(user?.id as string, botid as string);
        getVoteData();
        getVoteStatus();
        setClicked(false);
        setVoted(true);
    };

    useEffect(() => {
        getVoteData();
        getSuggestedBots();
    }, []);

    useEffect(() => {
        if (user) {
            getVoteStatus();
        };
    }, [user]);

    return (
        <>
            {botData && voteStatus ? (
                <section className="text-white w-full max-w-[1500px] px-4 xl:px-3 flex flex-col items-center justify-center my-10 gap-8">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-[#00b4d8]/10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,255,0.08),transparent_70%)]"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#080c14]"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/5 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10 flex xl:flex-col items-center gap-6 p-8 xl:p-6">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffff] via-[#00d4ff] to-[#00b4d8] rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
                                <img
                                    onError={async ({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                    }}
                                    className="relative w-24 h-24 rounded-3xl border-3 border-[#00b4d8]/50 shadow-2xl"
                                    src={`https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png?size=256`}
                                    alt={botData.name}
                                />
                            </div>

                            <div className="flex flex-col gap-2 xl:text-center flex-grow">
                                <h1 className="text-3xl xl:text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00b4d8] bg-clip-text text-transparent">
                                    Votar em {botData.name}
                                </h1>
                                <div className="flex items-center gap-2 xl:justify-center">
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 px-4 py-2 rounded-full border border-[#00b4d8]/30">
                                        <TiArrowSortedUp className="text-[#00ffff]" size={20} />
                                        <span className="text-white font-bold">{votes}</span>
                                        <span className="text-gray-400 text-sm">votos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#080c14]"></div>
                        {voted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10"></div>
                        )}
                        
                        <div className="relative z-10 flex xl:flex-col items-center justify-between gap-6 p-8 xl:p-6">
                            <div className="flex items-center gap-4 flex-grow xl:flex-col xl:text-center">
                                {voted ? (
                                    <>
                                        <div className="relative">
                                            <FiCheckCircle className="text-emerald-400" size={48} />
                                            <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-2xl font-bold text-emerald-400">Voto confirmado!</h2>
                                            <p className="text-gray-300">
                                                {botData.vote_message || `Obrigado por votar em ${botData.name}! Seu apoio é muito importante.`}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {voteStatus?.can_vote ? (
                                            <>
                                                <div className="relative">
                                                    <TiArrowSortedUp className="text-[#00ffff]" size={48} />
                                                    <div className="absolute inset-0 bg-[#00ffff]/30 blur-xl rounded-full animate-pulse"></div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {user ? "Pronto para votar!" : "Login necessário"}
                                                    </h2>
                                                    <p className="text-gray-400">
                                                        {user 
                                                            ? "Seu voto ajuda a destacar este bot na comunidade" 
                                                            : "Você precisa estar logado para poder votar"}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <FiClock className="text-orange-400" size={48} />
                                                    <div className="absolute inset-0 bg-orange-400/30 blur-xl rounded-full animate-pulse"></div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {user ? "Aguarde um momento" : "Login necessário"}
                                                    </h2>
                                                    <p className="text-gray-400">
                                                        {user 
                                                            ? `Você já votou hoje! Volte em ${restTime} ${restTime === 1 ? "hora" : restTime as number < 0 ? "minutos" : (restTime as number > 0 && restTime === 1) ? "minuto" : "horas"}`
                                                            : "Você precisa estar logado para poder votar"}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex-shrink-0 xl:w-full">
                                {user ? (
                                    <button
                                        className="group relative overflow-hidden border-2 border-[#00ffff]/40 bg-gradient-to-br from-[#00ffff]/15 via-[#00d4ff]/10 to-[#00b4d8]/15 hover:from-[#00ffff]/25 hover:to-[#00b4d8]/25 text-white font-bold transition-all duration-300 px-8 py-4 rounded-xl min-w-[160px] text-center hover:scale-105 hover:shadow-lg hover:shadow-[#00ffff]/30 active:scale-95 hover:border-[#00ffff]/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 xl:w-full"
                                        disabled={!voteStatus?.can_vote || clicked}
                                        onClick={handleVote}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {clicked ? (
                                                <icon.AiOutlineLoading3Quarters className="animate-spin" size={24} />
                                            ) : (
                                                <>
                                                    <TiArrowSortedUp size={24} className="text-[#00ffff]" />
                                                    Votar
                                                </>
                                            )}
                                        </span>
                                    </button>
                                ) : (
                                    <a 
                                        href={import.meta.env.VITE_AUTH_LINK}
                                        className="group relative overflow-hidden border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white font-bold transition-all duration-300 px-8 py-4 rounded-xl min-w-[160px] text-center hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95 backdrop-blur-sm flex items-center justify-center gap-2 xl:w-full"
                                    >
                                        <FiLogIn size={20} />
                                        Login
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <VoteLoading />
            )}

            <section className="text-white w-full max-w-[1500px] px-4 xl:px-3 flex flex-col items-center justify-center gap-6 mb-10">
                <div className="flex items-center gap-3">
                    <BsRobot className="text-[#00ffff]" size={32} />
                    <h2 className="text-3xl xl:text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00b4d8] bg-clip-text text-transparent">
                        Bots Sugeridos
                    </h2>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-1 gap-4 w-full">
                    {botLoading ? (
                        <Botloading fills={2} grid />
                    ) : (
                        bots.map((bot, index) => (<BotCard key={index} bot={bot} />))
                    )}
                </div>
            </section>
        </>
    );
};
