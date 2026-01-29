import * as iconHi from "react-icons/hi2";
import React, { useState } from "react";

export const InputSearch: React.FC<{ show: boolean }> = ({ show }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`flex w-full items-center justify-center transition-all duration-300 ${!show && "xl:invisible xl:opacity-0 xl:h-0"}`}>
            <form 
                action="/search" 
                className="flex items-center w-full max-w-[600px] px-4 py-3"
            >
                <div className={`flex items-center gap-3 w-full bg-dark-elevated rounded-xl px-4 py-3 border transition-all duration-300 ${
                    isFocused 
                        ? 'border-primary/50 ring-2 ring-primary/20' 
                        : 'border-dark-border hover:border-dark-border/80'
                }`}>
                    <iconHi.HiMagnifyingGlass className="text-text-muted flex-shrink-0" size={20} />
                    <input
                        className="bg-transparent outline-none w-full text-white placeholder:text-text-muted"
                        name="bot"
                        placeholder="Buscar bots..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <button type="submit" className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                        <iconHi.HiArrowRight className="text-primary-light" size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};
