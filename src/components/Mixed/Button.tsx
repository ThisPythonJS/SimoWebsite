import { Link } from "react-router-dom";

export const Button: React.FC<{
    action?: (() => void) | (() => Promise<void>); 
    clas?: string; 
    children: React.ReactNode;
    type?: "button" | "reset" | "submit"
    link?: boolean;
    to?: string
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline";
}> = ({ clas, action, children, type, link, to, disabled, variant = "primary" }) => {
    const baseStyles = "transition-all duration-300 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-default";
    
    const variantStyles = {
        primary: "bg-primary hover:bg-primary-light border border-primary-dark",
        secondary: "bg-dark-elevated hover:bg-dark-card-hover border border-dark-border hover:border-primary/30",
        outline: "bg-transparent hover:bg-primary/10 border border-dark-border hover:border-primary/30 text-text-secondary hover:text-white"
    };
    
    const styles = `${baseStyles} ${variantStyles[variant]} ${clas || ""}`;
    
    return link ? (
        <Link to={to || "/"} className={`${styles} w-full p-3 text-center block`}>
            {children}
        </Link>
    ) : (
        <button disabled={disabled} type={type} onClick={action} className={`${styles} p-3`}>
            {children}
        </button>
    );
};
