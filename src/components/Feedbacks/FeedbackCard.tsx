import React, { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import { BotStructure, FeedbackStructure } from "../../types";
import { ThemeContext } from "../../contexts/ThemeContext";
import { borderColor } from "../../utils/theme/border";
import * as icon from "react-icons/bs";
import * as iconAI from "react-icons/ai";
import { FiEdit2, FiTrash2, FiSend, FiMessageSquare } from "react-icons/fi";
import { UserContext } from "../../contexts/UserContext";
import api from "../../utils/api";
import { buttonColor } from "../../utils/theme/button";
import simo from "../../assets/images/simo.png";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/dist/locale/pt-br";

export const FeedbackCard: React.FC<{
    feedback: FeedbackStructure;
    bot: BotStructure;
    botid: string;
    isDeleted: boolean;
    setIsDeleted: (value: boolean) => void;
    updateFeedbacks: () => Promise<void>;
    developer: { id: string, avatar: string, username: string } | undefined;
}> = ({ feedback, botid, updateFeedbacks, setIsDeleted, isDeleted, bot, developer }): any => {
    const { color } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isEditReply, setIsEditReply] = useState<boolean>();
    const [editedContent, setEditedContent] = useState<string>(feedback?.content as string);
    const [rating, setRating] = useState<number>(feedback?.stars as number);
    const [submited, setSubmited] = useState<boolean>(false);
    const [reply, setReply] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>();
    const [replySubmit, setReplySubmit] = useState<boolean>(false);

    const handleChangeEdit = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setEditedContent(event.target.value);
    };

    const handleReplySend = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setReplyContent(event.target.value);
    };

    const handleEditReplyFeedback = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        setSubmited(true);

        if (editedContent === feedback.content && rating === feedback.stars) {
            setSubmited(false);
            setIsEditReply(false);
            return;
        }

        event.preventDefault();

        await api.editFeedback(bot.id, {
            reply_message: {
                content: editedContent,
                posted_at: new Date(Date.now()).toISOString(),
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

        await api.editFeedback(botid, {
            reply_message: {
                content: replyContent,
                posted_at: new Date(Date.now()).toISOString()
            }
        });

        await updateFeedbacks();
        setReplySubmit(false);
        setReply(false);
    };

    const handleSubmitEdit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        setSubmited(true);

        if (editedContent === feedback.content && rating === feedback.stars) {
            setSubmited(false);
            setIsEdit(false);
            return;
        }

        event.preventDefault();

        await api.editFeedback(botid, {
            content: editedContent,
            stars: rating,
            edited: true,
            reply_message: {}
        });
        await updateFeedbacks();

        setSubmited(false);
        setIsEdit(false);
    };

    return (
        <div className="relative bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#0a0e1a]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00b4d8]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col p-6 gap-4">
                <div className="flex items-center justify-between">
                    <Link className="flex items-center gap-3 group" to={`/user/${feedback.author?.id}`}>
                        <div className="relative">
                            <img
                                src={`https://cdn.discordapp.com/avatars/${feedback?.author?.id}/${feedback?.author?.avatar}.png?size=128`}
                                className="w-10 h-10 rounded-full border-2 border-[#00b4d8]/30 group-hover:border-[#00ffff]/50 transition-all"
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = simo;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-[#00b4d8]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold group-hover:text-[#00ffff] transition-colors">{feedback?.author?.username}</span>
                            <span className="text-gray-400 text-xs">{moment(feedback.posted_at).fromNow()}</span>
                        </div>
                    </Link>

                    {user?.id === feedback?.author?.id && (
                        <div className="flex gap-2">
                            <button 
                                disabled={isDeleted} 
                                onClick={async () => {
                                    setIsDeleted(true);
                                    await api.deleteFeedback(botid);
                                    await updateFeedbacks();
                                    setIsDeleted(false);
                                }} 
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                            >
                                {!isDeleted ? (
                                    <FiTrash2 size={18} className="text-red-400" />
                                ) : (
                                    <iconAI.AiOutlineLoading3Quarters className="animate-spin text-red-400" size={18} />
                                )}
                            </button>
                            <button 
                                onClick={() => setIsEdit(!isEdit)} 
                                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 hover:scale-110"
                            >
                                <FiEdit2 size={18} className="text-amber-400" />
                            </button>
                        </div>
                    )}
                </div>

                {isEdit ? (
                    <form onSubmit={handleSubmitEdit} className="flex flex-col gap-4">
                        <div className="bg-black/30 rounded-2xl border border-white/10 focus-within:border-[#00b4d8]/50 transition-all">
                            <textarea 
                                defaultValue={feedback.content} 
                                rows={4} 
                                onChange={handleChangeEdit} 
                                className="bg-transparent w-full focus:outline-none p-4 text-white placeholder:text-gray-500 resize-none" 
                                required 
                                placeholder="Digite seu feedback..." 
                                maxLength={500} 
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <button 
                                    type="button"
                                    key={index} 
                                    onClick={() => setRating(star)} 
                                    className="hover:scale-125 transition-transform"
                                >
                                    {star <= rating ? (
                                        <icon.BsStarFill size={24} className="text-yellow-400" />
                                    ) : (
                                        <icon.BsStar size={24} className="text-gray-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEdit(false)}
                                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submited}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 border border-[#00ffff]/40 hover:border-[#00ffff]/60 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {submited ? (
                                    <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <FiSend size={18} />
                                        Salvar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex flex-col gap-3">
                            <p className="text-gray-300 leading-relaxed">
                                {feedback.content}
                                {feedback?.edited && (
                                    <span className="text-gray-500 text-sm italic ml-2">(editado)</span>
                                )}
                            </p>

                            <div className="flex items-center gap-2">
                                {Array(feedback.stars).fill(0).map((_, index) => (
                                    <icon.BsStarFill key={index} className="text-yellow-400" size={18} />
                                ))}
                                {Array(5 - feedback.stars).fill(0).map((_, index) => (
                                    <icon.BsStar key={index} className="text-gray-600" size={18} />
                                ))}
                            </div>
                        </div>

                        {bot && bot.owner_id === user?.id && !reply && !("content" in feedback.reply_message) && (
                            <button 
                                onClick={() => setReply(true)} 
                                className="flex items-center gap-2 text-[#00b4d8] hover:text-[#00ffff] font-semibold text-sm transition-colors w-fit"
                            >
                                <FiMessageSquare size={16} />
                                Responder
                            </button>
                        )}
                    </>
                )}

                {"content" in feedback.reply_message && user && (
                    <div className="mt-4 pl-4 border-l-2 border-[#00b4d8]/30">
                        {isEditReply ? (
                            <form onSubmit={handleEditReplyFeedback} className="flex flex-col gap-4">
                                <div className="bg-black/30 rounded-2xl border border-white/10 focus-within:border-[#00b4d8]/50 transition-all">
                                    <textarea 
                                        defaultValue={feedback.reply_message.content} 
                                        rows={3} 
                                        onChange={handleChangeEdit} 
                                        className="bg-transparent w-full focus:outline-none p-4 text-white placeholder:text-gray-500 resize-none" 
                                        required 
                                        placeholder="Digite sua resposta..." 
                                        maxLength={500} 
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditReply(false)}
                                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold rounded-xl transition-all duration-300 text-sm"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submited}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 border border-[#00ffff]/40 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 text-sm"
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
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <Link to={`/user/${developer?.id}`} className="flex items-center gap-2 group">
                                        <img
                                            src={`https://cdn.discordapp.com/avatars/${developer?.id}/${developer?.avatar}.png?size=128`}
                                            className="w-8 h-8 rounded-full border-2 border-[#00b4d8]/30 group-hover:border-[#00ffff]/50 transition-all"
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = simo;
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-bold group-hover:text-[#00ffff] transition-colors">{developer?.username}</span>
                                            <span className="text-gray-400 text-xs">{moment(feedback.reply_message.posted_at).fromNow()}</span>
                                        </div>
                                    </Link>

                                    {user?.id === bot.owner_id && (
                                        <div className="flex gap-2">
                                            <button 
                                                disabled={isDeleted} 
                                                onClick={async () => {
                                                    setIsDeleted(true);
                                                    await api.editFeedback(bot.id, { reply_message: {} });
                                                    await updateFeedbacks();
                                                    setIsDeleted(false);
                                                }} 
                                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all"
                                            >
                                                {!isDeleted ? (
                                                    <FiTrash2 size={14} className="text-red-400" />
                                                ) : (
                                                    <iconAI.AiOutlineLoading3Quarters className="animate-spin text-red-400" size={14} />
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => setIsEditReply(!isEditReply)} 
                                                className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all"
                                            >
                                                <FiEdit2 size={14} className="text-amber-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {feedback.reply_message.content}
                                    {feedback?.reply_message.edited && (
                                        <span className="text-gray-500 text-xs italic ml-2">(editado)</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                )}

        {reply && user && (
                    <form onSubmit={handleReplyFeedback} className="mt-4 pl-4 border-l-2 border-[#00b4d8]/30 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img 
                                onError={async ({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = (await import("../../assets/images/simo.png")).default;
                                }} 
                                className="w-8 h-8 rounded-full border-2 border-[#00b4d8]/30" 
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`} 
                            />
                            <span className="text-white text-sm font-bold">{user.username}</span>
                        </div>

                        <div className="bg-black/30 rounded-2xl border border-white/10 focus-within:border-[#00b4d8]/50 transition-all">
                            <textarea 
                                rows={3} 
                                onChange={handleReplySend} 
                                className="bg-transparent w-full focus:outline-none p-4 text-white placeholder:text-gray-500 resize-none" 
                                required 
                                placeholder="Digite sua resposta..." 
                                maxLength={500} 
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setReply(false)}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold rounded-xl transition-all duration-300 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={replySubmit}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ffff]/20 to-[#00b4d8]/20 hover:from-[#00ffff]/30 hover:to-[#00b4d8]/30 border border-[#00ffff]/40 hover:border-[#00ffff]/60 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 text-sm"
                            >
                                {replySubmit ? (
                                    <iconAI.AiOutlineLoading3Quarters className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <FiSend size={14} />
                                        Enviar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
