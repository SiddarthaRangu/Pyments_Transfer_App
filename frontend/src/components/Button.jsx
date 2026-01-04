import PropTypes from "prop-types";
import { Button as ShadcnButton } from "@/components/ui/button";
export function Button({ label, onClick, variant = "default", className, type = "button", disabled = false }) {
    return (
        <ShadcnButton 
            disabled={disabled}
            type={type}
            onClick={onClick} 
            variant={variant} 
            className={`font-bold transition-all active:scale-[0.98] text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl ${className}`}
        >
            {label}
        </ShadcnButton>
    );
}

Button.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool
};
