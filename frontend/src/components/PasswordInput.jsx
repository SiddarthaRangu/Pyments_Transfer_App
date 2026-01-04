import { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ label, onChange, placeholder, value }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2 text-left">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                {label}
            </label>
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-950 rounded-xl pr-12"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    );
}

PasswordInput.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
};