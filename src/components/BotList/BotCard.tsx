import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BotStructure } from "../../types";
import { ThemeContext } from "../../contexts/ThemeContext";
import simo from "../../assets/images/simo.png";
import { TiArrowSortedUp } from "react-icons/ti";
import { borderAndBg } from "../../utils/theme/border&bg";
import { buttonColor } from "../../utils/theme/button";

export const BotCard: React.FC<{ bot: BotStructure }> = ({ bot }) => {
    const { color } = useContext(ThemeContext);

    return (
        <div className={`group relative bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] w-full rounded-2xl p-5 transition-all duration-300 ${color === "black" && "border-[#1a1f2e]"} border border-white/5 hover:border-[#00b4d8]/40 hover:shadow-lg hover:shadow-[#00b4d8]/10 flex flex-col gap-4 xl:w-[95vw] overflow-hidden`} key={bot.id}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/5 via-transparent to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <Link to={`/bot/${bot.id}`} className="flex flex-col gap-4 h-full relative z-10">
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <img 
                            className="rounded-2xl w-16 h-16 border-2 border-white/10 group-hover:border-[#00b4d8]/50 transition-all duration-300 group-hover:scale-105" 
                            src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png`} 
                            onError={async ({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = (await import("../../assets/images/simo.png")).default;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                    
                    <div className="flex gap-2 flex-col flex-grow">
                        <span className="font-bold text-xl text-white group-hover:text-[#00ffff] transition-colors duration-300">{bot.name}</span>
                        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full w-fit border border-white/10">
                            <TiArrowSortedUp className="text-[#00ffff]" size={18} />
                            <span className="text-sm text-gray-300 font-semibold">{bot.votes.reduce((votesCount, vote) => votesCount + vote.votes, 0)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 flex-col flex-grow">
                    <div className="min-h-[48px]">
                        <span className="text-gray-400 leading-relaxed">
                            {bot.short_description.length > 80
                                ? bot.short_description.slice(0, 80) + "..."
                                : bot.short_description}
                        </span>
                    </div>
                    <div className="flex flex-row gap-2 flex-wrap">
                        {bot.tags.map((tag, index) => (
                            <div 
                                key={index} 
                                className="bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#00b4d8]/30 text-[#00ffff] text-sm font-medium hover:border-[#00ffff]/50 hover:bg-[#00ffff]/20 transition-all duration-300"
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </Link>
            <div className="flex gap-3 w-full relative z-10 mt-auto">
                <Link 
                    to={bot.invite_url} 
                    className="flex-grow text-center border-2 border-white/10 hover:border-[#00b4d8]/50 transition-all duration-300 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-default bg-white/5 hover:bg-[#00b4d8]/10 font-semibold hover:scale-[1.02] active:scale-95"
                >
                    Adicionar
                </Link>
                
                <Link 
                    to={`/vote/${bot.id}`} 
                    className="text-center border-2 border-[#00ffff]/30 bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 hover:from-[#00ffff]/20 hover:to-[#00b4d8]/20 hover:border-[#00ffff]/50 transition-all duration-300 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-default px-5 flex gap-2 items-center justify-center font-semibold hover:scale-[1.02] active:scale-95"
                >
                    <span>Votar</span>
                    <TiArrowSortedUp size={22} className="text-[#00ffff]" />
                </Link>
            </div>
        </div>
    );
                }
