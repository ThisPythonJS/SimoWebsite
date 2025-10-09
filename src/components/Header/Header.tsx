import React, { useState } from "react";
import { Button } from "../Mixed/Button";
import * as icon from "react-icons/bs";
import { InputSearch } from "../Search/InputSearch";
import { Link } from "react-router-dom";
import { NotificationButton } from "../Notification/Button";
import { LoginMenu } from "../DropdownMenu/Menu";
import "./index.css";

export const Header: React.FC = () => {
    const [inputSearch, setInputSearch] = useState<boolean>(false);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-[#0c0e12]/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg">
            <Link to="/" className="flex items-center space-x-2 select-none">
                <h1 className="font-boldonse text-gradient text-2xl tracking-wide">Simo</h1>
                <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
            </Link>
            <div className="flex-1 mx-8 hidden md:flex justify-center">
                <div className="relative w-full max-w-md transition-all duration-300 focus-within:max-w-2xl">
                    <input
                        type="text"
                        placeholder="Clique para Pesquisar"
                        className="w-full bg-[#1a1c22] text-white placeholder-white/40 text-sm py-2.5 pl-10 pr-4 rounded-lg border border-white/10 focus:border-[#00ffff]/40 focus:ring-2 focus:ring-[#00ffff]/30 outline-none transition-all duration-200"
                    />
                    <icon.BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button 
                    action={() => setInputSearch(!inputSearch)} 
                    clas="md:hidden hover:bg-transparent"
                >
                    <icon.BsSearch fill="#fff" />
                </Button>

                <NotificationButton />
                <LoginMenu />
            </div>
        </header>
    );
};
