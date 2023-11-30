import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { Link, Params, useParams } from "react-router-dom";
import { BotStructure, DBUser, Team } from "../../types";
import { AxiosResponse } from "axios";
import { ThemeContext } from "../../contexts/ThemeContext";
import { borderColor } from "../../utils/theme/border";
import { BotCard } from "../BotList/BotCard";
import { UserLoading } from "./UserLoading";
import simo from "../../assets/images/simo.png";

export const User: React.FC = () => {
    const params: Params = useParams<string>();
    const userid: string = params.userid as string;
    const [user, setUser] = useState<DBUser>();
    const [userBots, setUserBots] = useState<BotStructure[]>([]);
    const { color } = useContext(ThemeContext);

    const getUserData: () => Promise<void> = async (): Promise<void> => {
        const req: AxiosResponse<DBUser> = await api.getUserFromDB(userid);
        return setUser(req.data);
    };

    const getUserBots: () => Promise<void> = async (): Promise<void> => {
        const req: AxiosResponse<BotStructure[]> = await api.getAllBots();
        const userBots = req.data.filter((bot: BotStructure) => bot.owner_id === userid);
        return setUserBots(userBots);
    };

    useEffect(() => {
        getUserData();
        getUserBots();
    }, []);

    return (
        <main className="max-w-[1500px] flex justify-center">
            {!user || !userBots ? (
                <UserLoading />
            ) : (
                <section className="w-screen flex flex-row p-5 text-white items-start xl:items-center justify-center gap-10 xl:flex-col">
                    <div className={`${borderColor[color]} border-2 min-h-[300px] w-[300px] xl:w-[90vw] rounded-lg bg-neutral-900 flex justify-start flex-col gap-4 relative`}>
                        {user.banner_url && (
                            <img className="w-full h-36 object-cover rounded-md z-0 mb-14" src={user.banner_url} alt="Possible banner" />
                        )}
                        <div className="w-full items-center flex justify-center z-1 absolute top-[50%] left-0 transform -translate-y-1/2">
                            <img
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = simo;
                                }}
                                className="rounded-full w-32" src={`https://cdn.discordapp.com/avatars/${user._id}/${user.avatar}.png`}
                                alt={`${user.username}'s Avatar`}
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-1 z-2 relative px-3 pb-4">
                            <strong>{user.username}</strong>
                            <span className="text-[#797979] items-center flex text-[13px]">
                                ( {user._id} )
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start w-full flex-col gap-2">
                        <h1 className="text-[33px]">Perfil de <strong>{user.username}</strong></h1>
                        {user?.bio && <span>{user.bio}</span>}
                        <hr className="w-full my-3" />
                        <section className="w-full flex xl:items-center xl:justify-center">
                            {userBots.length === 0 ? (
                                <div className="text-center text-[22px]">{user.username} não tem bots para serem listados.</div>
                            ) : (
                                <div className="grid-cols-2 grid gap-8 text-white m-2 xl:grid-cols-1 xl:place-items-center xl:w-[95vw]">
                                    {userBots.map((bot: BotStructure) => (<BotCard bot={bot} />))}
                                </div>
                            )}
                        </section>
                    </div>
                </section>
            )}
        </main>
    )
};