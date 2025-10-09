import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import * as icon from "react-icons/bs";
import { Button } from "../Mixed/Button";
import { NotificationButton } from "../Notification/Button";
import { UserContext } from "../../contexts/UserContext";
import { LoginMenu } from "../DropdownMenu/Menu";
import { InputSearch } from "../Search/InputSearch";
import "./index.css";

export const Header: React.FC = () => {
    const { user } = useContext(UserContext);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full md:w-[95%] max-w-6xl z-50 
                bg-[#0c0e12]/90 backdrop-blur-md border border-white/10 rounded-b-2xl 
                px-5 py-3 flex items-center justify-between shadow-lg transition-all duration-300">

                <Link to="/" className="flex items-center space-x-2 select-none">
                    <h1 className="font-boldonse text-gradient text-2xl tracking-wide leading-none">Simo</h1>
                    <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 transition flex items-center justify-center"
                    >
                        <icon.BsSearch size={20} className="text-white/70" />
                    </button>
                    
                    <NotificationButton />

                    {user ? (
                        <LoginMenu />
                    ) : (
                        <Link to={import.meta.env.VITE_AUTH_LINK}>
                            <Button clas="bg-[#00ffff]/20 hover:bg-[#00ffff]/30 px-4 py-1.5 rounded-lg text-white text-sm">
                                Entrar
                            </Button>
                        </Link>
                    )}
                </div>
            </header>
            
            {searchOpen && (
                <div className="fixed top-[70px] left-1/2 -translate-x-1/2 w-[95%] md:w-auto z-40 flex justify-center">
                    <div className="w-full md:w-[600px]">
                        <InputSearch show={true} />
                    </div>
                </div>
            )}
            
            <div className="h-[80px]" />
        </>
    );
};
