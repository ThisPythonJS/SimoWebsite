import React, { useEffect, useState, useContext } from "react";
import { BotStructure, FeedbackStructure } from "../../types";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { FeedbackCard } from "./FeedbackCard";
import * as icon from "react-icons/bs";
import * as iconAI from "react-icons/ai";
import { FiSend, FiMessageSquare, FiAlertCircle, FiChevronLeft, FiChevronRight, FiLogIn } from "react-icons/fi";
import { borderColor } from "../../utils/theme/border";
import { ThemeContext } from "../../contexts/ThemeContext";
import { UserContext } from "../../contexts/UserContext";
import { buttonColor } from "../../utils/theme/button";

export const Feedbacks: React.FC<{ botid: string, bot: BotStructure, dev: { id: string, avatar: string, username: string } | undefined }> = ({ botid, bot, dev }) => {
    const { color } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(1);
    const [feedback, setFeedback] = useState<string>("");
    const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
    const [submited, setSubmited] = useState<boolean>(false);
    const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
    };

    const [feedbacks, setFeedbacks] = useState<FeedbackStructure[]>();
    const params = useParams();

    const [currentPage, setCurrentPage] = useState(1);

    const getBotFeedbacks = async (): Promise<void> => {
        setFeedbackLoading(true);
        const res = await api.getBotFeedbacks(params.botid as string);
        setFeedbacks(res.data);
        setFeedbackLoading(false);
    };

    useEffect(() => {
        getBotFeedbacks();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setSubmited(true);

        await api.postFeedback(rating, new Date().toISOString(), feedback, botid, user?.id as string).catch(() => {
            setFeedbackSent(true)
            setSubmited(false);
        });

        await getBotFeedbacks();
        setFeedback("");
        setSubmited(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        event.preventDefault();
        setFeedback(event.target.value);
    };

    const indexLastItem: number = currentPage * 5;
    const indexFirstItem: number = indexLastItem - 5;
    const currentFeedbacks: FeedbackStructure[] | undefined = feedbacks?.slice(indexFirstItem, indexLastItem);

    return (
        <div className="w-full max-w-[1500px] px-4 xl:px-3 flex flex-col items-center gap-10 mb-12">
            <div className="w-full max-w-3xl">
                <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8]/5 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 p-8 xl:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl shadow-lg">
                                <FiMessageSquare className="text-[#00ffff]" size={24} />
                            </div>
                            <h2 className="text-3xl xl:text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00b4d8] bg-clip-text text-transparent">
                                Envie seu Feedback
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="bg-black/30 rounded-2xl border border-white/10 focus-within:border-[#00b4d8]/50 transition-all">
                                <textarea 
                                    value={feedback}
                                    rows={5} 
                                    onChange={handleChange} 
                                    className="bg-transparent w-full focus:outline-none p-5 text-white placeholder:text-gray-500 resize-none" 
                                    required 
                                    placeholder="Compartilhe sua experiência com este bot..." 
                                    maxLength={500} 
                                />
                                <div className="px-5 pb-3 flex justify-end">
                                    <span className="text-xs text-gray-500">{feedback.length}/500</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <span className="text-white font-semibold">Avaliação</span>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((star, index) => (
                                        <button 
                                            key={index} 
                                            type="button" 
                                            onClick={() => handleStarClick(star)} 
                                            className="hover:scale-125 transition-all duration-300"
                                        >
                                            {star <= rating ? (
                                                <icon.BsStarFill size={32} className="text-yellow-400 drop-shadow-lg" />
                                            ) : (
                                                <icon.BsStar size={32} className="text-gray-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {feedbackSent && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <FiAlertCircle className="text-red-400 flex-shrink-0" size={20} />
                                    <span className="text-red-400 text-sm font-semibold">Você já enviou um feedback para este bot.</span>
                                </div>
                            )}

                            {user ? (
                                <button
                                    type="submit"
                                    disabled={submited}
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 border-2 border-[#00ffff]/40 hover:border-[#00ffff]/60 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-[#00ffff]/10"
                                >
                                    {submited ? (
                                        <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <FiSend size={20} />
                                            Enviar Feedback
                                        </>
                                    )}
                                </button>
                            ) : (
                                <a 
                                    href={import.meta.env.VITE_AUTH_LINK}
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                                >
                                    <FiLogIn size={20} />
                                    Fazer Login para Avaliar
                                </a>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-xl">
                        <icon.BsChatDots className="text-[#00ffff]" size={20} />
                    </div>
                    <h3 className="text-2xl xl:text-xl font-bold text-white">
                        Feedbacks da Comunidade
                    </h3>
                    {feedbacks && feedbacks.length > 0 && (
                        <span className="ml-auto px-4 py-1.5 bg-[#00b4d8]/20 border border-[#00b4d8]/40 rounded-full text-[#00ffff] text-sm font-bold">
                            {feedbacks.length} {feedbacks.length === 1 ? 'avaliação' : 'avaliações'}
                        </span>
                    )}
                </div>

                {feedbackLoading ? (
                    <div className="flex flex-col gap-4">
                        {Array(3).fill(0).map((_, index) => (
                            <div key={index} className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 border border-white/10 rounded-3xl p-6 animate-pulse">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="h-4 bg-white/10 rounded-full w-32"></div>
                                        <div className="h-3 bg-white/10 rounded-full w-24"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-white/10 rounded-full w-full"></div>
                                    <div className="h-4 bg-white/10 rounded-full w-4/5"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : currentFeedbacks && currentFeedbacks.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {currentFeedbacks.sort((a, b) => new Date(b.posted_at as string).getTime() - new Date(a.posted_at as string).getTime()).map((feedback: FeedbackStructure, index: number) => (
                            <FeedbackCard 
                                key={index}
                                developer={dev} 
                                bot={bot} 
                                feedback={feedback} 
                                botid={botid} 
                                updateFeedbacks={getBotFeedbacks} 
                                isDeleted={isDeleted} 
                                setIsDeleted={setIsDeleted} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 border border-white/10 rounded-3xl p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl">
                                <icon.BsChatDots className="text-gray-500" size={48} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-white font-bold text-lg">Nenhum feedback ainda</h4>
                                <p className="text-gray-400">Seja o primeiro a avaliar este bot!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {feedbacks && feedbacks.length > 5 && (
                <div className="flex gap-4 w-full max-w-3xl">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <FiChevronLeft size={20} />
                        Anterior
                    </button>
                    
                    <div className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00ffff]/10 to-[#00b4d8]/10 border border-[#00b4d8]/30 rounded-xl">
                        <span className="text-white font-bold">
                            Página {currentPage}
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!currentFeedbacks || currentFeedbacks.length < 5}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Próxima
                        <FiChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};
