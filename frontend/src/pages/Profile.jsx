import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Appbar } from "../components/Appbar";
import { Button } from "../components/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Lock, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Profile = () => {
    const navigate = useNavigate();
    const { user, refreshData } = useAuth();
    const [formData, setFormData] = useState({ firstName: "", lastName: "" });
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) setFormData({ firstName: user.firstName, lastName: user.lastName });
    }, [user]);

    const hasChanges = formData.firstName !== user?.firstName || formData.lastName !== user?.lastName;

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.put("/user/", formData);
            toast.success("Profile updated");
            refreshData();
        } catch (e) { toast.error("Failed to update"); }
        finally { setLoading(false); }
    };

    const handlePasswordChange = async () => {
        if (passwords.newPassword.length < 6) return toast.error("New password too short");
        try {
            await api.put("/user/change-password", passwords);
            toast.success("Password secured");
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Appbar userName={user?.firstName} />
            <div className="max-w-3xl mx-auto py-12 px-6 space-y-12">
                <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to wallet
                </button>

                <div className="flex items-center gap-8">
                    <div className="relative group">
                        <Avatar className="h-28 w-28 border-4 border-white shadow-2xl">
                            <AvatarFallback className="bg-zinc-950 text-white text-3xl font-bold">{user?.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">{user?.firstName} {user?.lastName}</h1>
                        <p className="text-zinc-500 font-mono text-sm tracking-tight">{user?.username}</p>
                    </div>
                </div>

                <div className="grid gap-10">
                    {/* PERSONAL DETAILS */}
                    <Card className="rounded-[3rem] border-zinc-200/60 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="bg-zinc-50/50 p-10 border-b flex flex-row items-center gap-4">
                            <UserCircle className="h-6 w-6 text-zinc-400" />
                            <CardTitle className="text-xl font-bold">Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">First Name</label>
                                    <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-14 rounded-2xl bg-zinc-50 border-none text-lg font-bold px-6 focus-visible:ring-zinc-950" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Last Name</label>
                                    <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-14 rounded-2xl bg-zinc-50 border-none text-lg font-bold px-6 focus-visible:ring-zinc-950" />
                                </div>
                            </div>
                            <Button 
                                label={loading ? "Saving..." : "Save Changes"} 
                                disabled={!hasChanges || loading}
                                onClick={handleUpdate} 
                                className={`h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${hasChanges ? "bg-zinc-950 text-white shadow-xl" : "bg-zinc-100 text-zinc-400"}`}
                            />
                        </CardContent>
                    </Card>

                    {/* SECURITY / PASSWORD */}
                    <Card className="rounded-[3rem] border-zinc-200/60 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="bg-zinc-50/50 p-10 border-b flex flex-row items-center gap-4">
                            <Lock className="h-5 w-5 text-zinc-400" />
                            <CardTitle className="text-xl font-bold">Security</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Current Password</label>
                                    <Input type="password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} className="h-14 rounded-2xl bg-zinc-50 border-none px-6 focus-visible:ring-zinc-950" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">New Password</label>
                                    <Input type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="h-14 rounded-2xl bg-zinc-50 border-none px-6 focus-visible:ring-zinc-950" />
                                </div>
                            </div>
                            <Button 
                                label="Update Password" 
                                onClick={handlePasswordChange}
                                disabled={!passwords.oldPassword || !passwords.newPassword}
                                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs bg-zinc-950 text-white shadow-xl hover:bg-zinc-800"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};