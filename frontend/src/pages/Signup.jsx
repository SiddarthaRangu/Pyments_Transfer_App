import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { refreshData } = useAuth();

    const handleSignup = async () => {
        const loadingToastId = toast.loading('Creating account...');
        try {
            const response = await api.post("/user/signup", { username, firstName, lastName, password });
            toast.dismiss(loadingToastId);
            toast.success("Account Ready!");
            localStorage.setItem("token", response.data.token);
            await refreshData();
            navigate("/dashboard");
        } catch (err) {
            toast.dismiss(loadingToastId);
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-10 overflow-y-auto no-scrollbar">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] w-full max-w-[380px] p-8 shadow-2xl space-y-6"
            >
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-950">SwiftPay</h1>
                    <SubHeading label={"Join SwiftPay today"} />
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <InputBox onChange={e => setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
                        <InputBox onChange={e => setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
                    </div>
                    <InputBox onChange={e => setUsername(e.target.value)} placeholder="john@example.com" label={"Email"} />
                    <PasswordInput onChange={e => setPassword(e.target.value)} placeholder="Min. 6 chars" label={"Password"} />

                    <div className="pt-2">
                        <Button 
                            onClick={handleSignup} 
                            label="Create Account" 
                            className="w-full h-12 shadow-lg shadow-zinc-200" 
                        />
                    </div>
                </div>

                <BottomWarning label={"Have an account?"} buttonText={"Sign in"} to={"/signin"} />
            </motion.div>
        </div>
    );
};