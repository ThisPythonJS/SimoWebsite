import { FC, ChangeEvent, useState, FormEvent } from "react";
import { BotStructure, FeedbackStructure, Theme, UserStructure } from "../../types";
import api from "../../utils/api";
import { borderColor } from "../../utils/theme/border";
import * as iconAI from "react-icons/ai";
import { FiEdit2, FiTrash2, FiSend, FiCornerDownRight } from "react-icons/fi";
import { buttonColor } from "../../utils/theme/button";
import simo from "../../assets/images/simo.png";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { Link } from "react-router-dom";

export const ReplyFeedbackCard: FC<{
    feedback: FeedbackStructure;
    updateFeedbacks: () => Promise<void>;
    bot: BotStructure;
    user: UserStructure | null;
    color: Theme;
    reply: boolean;
    developer?: { id: string, avatar: string, username: string };
}> = ({ feedback, updateFeedbacks, bot, user, color, reply, developer }): any => {
    const [isEditReply, setIsEditReply] = useState<boolean>();
    const [replyContent, setReplyContent] = useState<string>();
    const [editedReplyContent, setEditedReplyContent] = useState<string>();
    const [replySubmit, setReplySubmit] = useState<boolean>(false);
    const [submited, setSubmited] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const handleReplySend = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setReplyContent(event.target.value);
    };

    const handleEditReply = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setEditedReplyContent(event.target.value);
    };

    const handleEditReplyFeedback = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        setSubmited(true);

        if (replyContent === feedback.reply_message?.content) {
            setSubmited(false);
            setIsEditReply(false);
            return;
        }

        event.preventDefault();

        await api.editFeedback(bot.id, {
            reply_message: {
                content: editedReplyContent,
                edited: true
            }
        });
        await updateFeedbacks();

        setSubmited(false);
        setIsEditReply(false);
    };

    const handleReplyFeedback = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setReplySubmit(true);

        await api.editFeedback(bot.id, {
            reply_message: {
                content: replyContent,
                posted_at: new Date().toISOString()
            }
        });

        await updateFeedbacks();
        setReplySubmit(false);
    };

    return (
        feedback?.reply_message && user && (
            <div className="mt-4 pl-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00b4d8]/50 via-[#00b4d8]/30 to-transparent"></div>
                <FiCornerDownRight className="absolute -left-1 top-2 text-[#00b4d8]/50" size={20} />
                
                {isEditReply ? (
                    <form onSubmit={handleEditReplyFeedback} className="flex flex-col gap-4 bg-gradient-to-br from-[#00b4d8]/5 to-transparent p-5 rounded-2xl border border-[#00b4d8]/20">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img 
                                    onError={async ({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                    }} 
                                    className="w-10 h-10 rounded-full border-2 border-[#00b4d8]/40" 
                                    src={`https://cdn.discordapp.com/avatars/${developer?.id}/${developer?.avatar}.png?size=128`} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-full blur-lg opacity-50"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">{developer?.username}</span>
                                <span className="text-gray-400 text-xs">Editando resposta</span>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-2xl border border-white/10 focus-within:border-[#00b4d8]/50 transition-all">
                            <textarea 
                                defaultValue={feedback.reply_message.content} 
                                rows={4} 
                                onChange={handleEditReply} 
                                className="bg-transparent w-full focus:outline-none p-4 text-white placeholder:text-gray-500 resize-none" 
                                required 
                                placeholder="Edite sua resposta..." 
                                maxLength={500} 
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditReply(false)}
                                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold rounded-xl transition-all duration-300 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submited}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 border border-[#00ffff]/40 hover:border-[#00ffff]/60 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {submited ? (
                                    <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <FiSend size={14} />
                                        Salvar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gradient-to-br from-[#00b4d8]/5 to-transparent p-5 rounded-2xl border border-[#00b4d8]/20">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <Link to={`/user/${developer?.id}`} className="flex items-center gap-3 group mb-3">
                                    <div className="relative">
                                        <img
                                            src={`https://cdn.discordapp.com/avatars/${developer?.id}/${developer?.avatar}.png?size=128`}
                                            className="w-10 h-10 rounded-full border-2 border-[#00b4d8]/40 group-hover:border-[#00ffff]/60 transition-all"
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = simo;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold text-sm group-hover:text-[#00ffff] transition-colors">{developer?.username}</span>
                                            <span className="px-2 py-0.5 bg-[#00b4d8]/20 border border-[#00b4d8]/40 rounded-full text-[#00ffff] text-xs font-semibold">
                                                Desenvolvedor
                                            </span>
                                        </div>
                                        <span className="text-gray-400 text-xs">{moment(feedback.reply_message.posted_at).fromNow()}</span>
                                    </div>
                                </Link>

                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {feedback.reply_message.content}
                                    {feedback?.reply_message.edited && (
                                        <span className="text-gray-500 text-xs italic ml-2">(editado)</span>
                                    )}
                                </p>
                            </div>

                            {user?.id === bot.owner_id && (
                                <div className="flex gap-2 flex-shrink-0">
                                    <button 
                                        disabled={isDeleted}
                                        onClick={async () => {
                                            setIsDeleted(true);
                                            await api.editFeedback(bot.id, { reply_message: {} });
                                            await updateFeedbacks();
                                            setIsDeleted(false);
                                        }} 
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                    >
                                        {!isDeleted ? (
                                            <FiTrash2 size={16} className="text-red-400" />
                                        ) : (
                                            <iconAI.AiOutlineLoading3Quarters className="animate-spin text-red-400" size={16} />
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => setIsEditReply(!isEditReply)} 
                                        className="p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 hover:scale-110"
                                    >
                                        <FiEdit2 size={16} className="text-amber-400" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {reply && user && !("content" in feedback.reply_message) && (
                    <form onSubmit={handleReplyFeedback} className="mt-4 flex flex-col gap-4 bg-gradient-to-br from-[#00b4d8]/5 to-transparent p-5 rounded-2xl border border-[#00b4d8]/20">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img 
                                    onError={async ({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                    }} 
                                    className="w-10 h-10 rounded-full border-2 border-[#00b4d8]/40" 
                                    src={`https://cdn.discordapp.com/avatars/${developer?.id}/${developer?.avatar}.png?size=128`} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-full blur-lg opacity-50"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">{developer?.username}</span>
                                <span className="text-gray-400 text-xs">Respondendo feedback</span>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-2xl border border-white/10 focus-within:border-[#00b4d8]/50 transition-all">
                            <textarea 
                                rows={4} 
                                onChange={handleReplySend} 
                                className="bg-transparent w-full focus:outline-none p-4 text-white placeholder:text-gray-500 resize-none" 
                                required 
                                placeholder="Digite sua resposta..." 
                                maxLength={500} 
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={replySubmit}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 border border-[#00ffff]/40 hover:border-[#00ffff]/60 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {replySubmit ? (
                                    <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        <FiSend size={16} />
                                        Enviar Resposta
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )
    );
};
