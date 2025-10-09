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
                <h1 className="font-boldonse text-gradient text-3xl tracking-wide">Simo</h1>
                <span className="hidden sm:inline text-white/60 text-sm font-light mt-[2px]">botlist</span>
            </Link>
            <div className="flex-1 mx-6 hidden md:flex justify-center">
                <InputSearch show={true} />
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
