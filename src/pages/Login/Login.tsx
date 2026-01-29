import { FC, useState } from "react";
import { SIMO_LOGO } from "../../utils/constants";
import { FaDiscord } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Login: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <main className="w-screen max-w-[800px] h-full justify-center items-center flex p-6">
            <section className="flex bg-dark-card rounded-2xl w-full p-6 text-white border border-dark-border">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={SIMO_LOGO} alt="Simo" className="w-12 h-12 object-contain" />
                        <h1 className="text-2xl font-bold">Fazer login na Simo</h1>
                    </div>
                    <span className="break-words text-text-secondary">Ao fazer login no Simo, voce tem acesso a uma variedade de recursos e funcionalidades adicionais. Agora, voce pode realizar diversas acoes, como adicionar um bot, criar um time, personalizar seu perfil, votar em um bot, fornecer feedback sobre um bot e muito mais!</span>
                    <div className="flex xl:w-full">
                        <button onClick={() => {
                            setLoading(true);
                            window.location.href = import.meta.env.VITE_AUTH_LINK;
                        }} disabled={loading} className="flex gap-3 disabled items-center justify-center bg-[#5165F5] hover:bg-[#4355E5] rounded-xl p-3 w-60 transition-all">
                            {loading ? (
                                <AiOutlineLoading3Quarters fill="#fff" size={28} className="animate-spin" />
                            ) : (
                                <>
                                    <FaDiscord />
                                    <span>Fazer login com Discord</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
};
