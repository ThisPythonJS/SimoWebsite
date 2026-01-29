import React from "react";
import { Link } from "react-router-dom";
import * as iconBs from "react-icons/bs";
import * as iconHi from "react-icons/hi2";
import simoLogo from "../../assets/images/simo-logo.png";

export const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-dark-border bg-dark-card/50 mt-16">
            <div className="max-w-[1200px] mx-auto px-4 py-12 xl:py-8">
                <div className="grid grid-cols-4 gap-8 xl:grid-cols-2 sm:grid-cols-1">
                    {/* Brand */}
                    <div className="col-span-2 xl:col-span-2 sm:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <img src={simoLogo} alt="Simo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-xl font-bold text-white">Simo</span>
                        </Link>
                        <p className="text-text-secondary mb-6 max-w-sm">
                            A melhor plataforma para descobrir e compartilhar bots incriveis para o Discord.
                        </p>
                        <div className="flex items-center gap-3">
                            <a 
                                href="https://github.com/simoworkspace" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-dark-elevated border border-dark-border hover:border-primary/30 hover:bg-dark-card-hover transition-all group"
                            >
                                <iconBs.BsGithub className="text-text-secondary group-hover:text-white transition-colors" size={20} />
                            </a>
                            <a 
                                href="https://discord.gg/DGDEJtRsms" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-dark-elevated border border-dark-border hover:border-[#5165F5]/30 hover:bg-dark-card-hover transition-all group"
                            >
                                <iconBs.BsDiscord className="text-text-secondary group-hover:text-[#5165F5] transition-colors" size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Navegacao</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                                    Explorar Bots
                                </Link>
                            </li>
                            <li>
                                <Link to="/addbot" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                                    Adicionar Bot
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Suporte</h4>
                        <ul className="space-y-3">
                            <li>
                                <a 
                                    href="https://discord.gg/DGDEJtRsms" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-primary-light transition-colors text-sm flex items-center gap-2"
                                >
                                    <iconHi.HiChatBubbleLeftRight size={14} />
                                    Discord
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/simoworkspace" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-primary-light transition-colors text-sm flex items-center gap-2"
                                >
                                    <iconHi.HiCodeBracket size={14} />
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-dark-border flex items-center justify-between xl:flex-col xl:gap-4">
                    <p className="text-text-muted text-sm">
                        © 2024 Simo. Todos os direitos reservados.
                    </p>
                    <p className="text-text-muted text-sm flex items-center gap-1">
                        Feito com <iconHi.HiHeart className="text-red-400" size={14} /> pela comunidade
                    </p>
                </div>
            </div>

            {/* Mobile bottom spacer */}
            <div className="hidden xl:block h-20"></div>
        </footer>
    );
};
