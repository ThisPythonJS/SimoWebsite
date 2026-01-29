import React from "react";
import { Link } from "react-router-dom";
import { BotStructure } from "../../types";
import simoLogo from "../../assets/images/simo-logo.png";
import * as iconHi from "react-icons/hi2";
import * as iconBs from "react-icons/bs";

export const BotCard: React.FC<{ bot: BotStructure }> = ({ bot }) => {
    const totalVotes = bot.votes.reduce((votesCount, vote) => votesCount + vote.votes, 0);
    
    // Generate a gradient based on bot id for variety
    const gradients = [
        "from-primary via-primary-dark to-primary/50",
        "from-accent via-primary to-primary-dark",
        "from-primary-light via-primary to-accent/30",
        "from-accent-secondary via-primary to-primary-dark",
        "from-primary via-accent-secondary/50 to-primary-dark",
    ];
    
    const gradientIndex = parseInt(bot.id.slice(-2), 16) % gradients.length;
    const gradient = gradients[gradientIndex];

    return (
        <div 
            className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
            key={bot.id}
        >
            {/* Banner with Gradient */}
            <div className={`relative h-28 bg-gradient-to-br ${gradient} overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
                </div>
                
                {/* Avatar positioned at bottom of banner */}
                <div className="absolute -bottom-8 left-4">
                    <div className="relative">
                        <img 
                            className="w-16 h-16 rounded-2xl border-4 border-dark-card object-cover bg-dark-card shadow-lg"
                            src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png`} 
                            onError={async ({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = simoLogo;
                            }}
                            alt={bot.name}
                        />
                        {bot.verified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-dark-card">
                                <iconHi.HiCheck className="text-white" size={10} />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Vote badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-bg/60 backdrop-blur-sm border border-white/10">
                        <iconHi.HiArrowTrendingUp className="text-accent" size={14} />
                        <span className="text-xs font-semibold text-white">{totalVotes}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 pt-12">
                <Link to={`/bot/${bot.id}`} className="flex flex-col gap-3 flex-1">
                    {/* Bot Name */}
                    <h3 className="font-bold text-lg text-white group-hover:text-primary-light transition-colors">
                        {bot.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 flex-1">
                        {bot.short_description.length > 90
                            ? bot.short_description.slice(0, 90) + "..."
                            : bot.short_description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {bot.tags.slice(0, 3).map((tag, index) => (
                            <span 
                                key={index} 
                                className="px-2 py-1 text-xs rounded-md bg-dark-elevated text-text-muted border border-dark-border"
                            >
                                # {tag}
                            </span>
                        ))}
                        {bot.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-md bg-dark-elevated text-text-muted border border-dark-border">
                                +{bot.tags.length - 3}
                            </span>
                        )}
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                    <Link 
                        to={`/bot/${bot.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-light font-medium text-sm transition-all"
                    >
                        <iconBs.BiShow size={16} />
                        <span>Visualizar</span>
                    </Link>
                    <Link 
                        to={bot.invite_url} 
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white font-medium text-sm transition-all"
                    >
                        <iconHi.HiPlus size={16} />
                        <span>Adicionar</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
