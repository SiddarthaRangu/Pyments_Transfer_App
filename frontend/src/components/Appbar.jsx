import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const Appbar = ({ userName }) => {
    const navigate = useNavigate();
    const userInitial = userName ? userName[0].toUpperCase() : 'U';

    return (
        <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <div className="flex h-16 items-center px-8 max-w-7xl mx-auto justify-between">
                <div onClick={() => navigate("/dashboard")} className="text-2xl font-bold tracking-tight text-slate-950 cursor-pointer">
                    Swift<span className="text-slate-500">Pay</span>
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100">
                                {userInitial}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Welcome, {userName}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate("/profile")}>Settings</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/signin");
                            }}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

Appbar.propTypes = {
    userName: PropTypes.string.isRequired,
};