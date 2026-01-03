import PropTypes from "prop-types";
import { Button as ShadcnButton } from "@/components/ui/button";

export function Button({
    label,
    children,
    onClick,
    variant = "default",
    className = "",
    type = "button"
}) {
    return (
        <ShadcnButton
            type={type}
            onClick={onClick}
            variant={variant}
            className={`font-semibold transition-all active:scale-95 ${className}`}
        >
            {children ?? label}
        </ShadcnButton>
    );
}

Button.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string
};
