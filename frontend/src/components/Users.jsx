import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../lib/api";
import { Button } from "./Button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export const Users = ({ onSendMoney }) => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timerId = setTimeout(() => {
            api.get(`/user/bulk?filter=${filter}`)
                .then(res => {
                    setUsers(res.data.users);
                    setLoading(false);
                });
        }, 400); // 400ms Debounce
        return () => clearTimeout(timerId);
    }, [filter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold tracking-tight">Contacts</h3>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        onChange={(e) => setFilter(e.target.value)} 
                        placeholder="Search name..." 
                        className="pl-10 h-10 border-slate-200"
                    />
                </div>
            </div>

            <div className="grid gap-3">
                {loading ? (
                    [1, 2, 3, 4].map(i => <UserSkeleton key={i} />)
                ) : (
                    users.map(u => (
                        <div key={u._id} className="flex items-center justify-between p-4 rounded-xl border bg-white hover:border-slate-400 transition-all group">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-slate-100 font-bold">{u.firstName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-slate-900 capitalize">{u.firstName} {u.lastName}</span>
                            </div>
                            <Button label="Send" onClick={() => onSendMoney(u)} className="h-9 px-6 bg-slate-950 text-white" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const UserSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-xl">
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-20 rounded-md" />
    </div>
);

Users.propTypes = {
    onSendMoney: PropTypes.func.isRequired
};