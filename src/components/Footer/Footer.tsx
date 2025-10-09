import react from "react";
import * as icon from "react-icons/bs";

export const Footer: React.FC = () => {
    return (
        <>
            <footer className="w-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] border-t border-white/5 backdrop-blur-sm">
                <div className="max-w-[1500px] mx-auto px-6 py-12 xl:py-20">
                    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-12 mb-12">
                        <div className="flex flex-col items-center xl:items-start text-center xl:text-left max-w-md">
                            <h2 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00b4d8] bg-clip-text text-transparent mb-4">
                                Simo
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Uma botlist para desenvolvedores que querem divulgar seu projeto.
                            </p>
                        </div>
                        <div className="flex flex-col xl:flex-row gap-12 xl:gap-20">
                            <div className="text-center xl:text-left">
                                <h3 className="text-white font-semibold text-lg mb-4">Comunidade</h3>
                                <div className="flex gap-4 justify-center xl:justify-start">
                                    <a 
                                        href="https://github.com/ThisPythonJS/SimoWebsite" 
                                        target="_blank"
                                        className="group relative p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                    >
                                        <icon.BsGithub className="text-gray-400 group-hover:text-white transition-colors duration-300" size={28} />
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                                    </a>
                                    <a 
                                        href="https://discord.gg/39gpCkE5Nk" 
                                        target="_blank"
                                        className="group relative p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                    >
                                        <icon.BsDiscord className="text-gray-400 group-hover:text-[#5165F5] transition-colors duration-300" size={28} />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#5165F5]/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
                            <p>© 2025 Simo Botlist. Todos os direitos reservados.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
};
