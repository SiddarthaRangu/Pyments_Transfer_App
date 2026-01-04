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

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { refreshData } = useAuth();

    const handleSignin = async () => {
        const loadingToastId = toast.loading('Authenticating...');
        try {
            const response = await api.post("/user/signin", { username, password });
            toast.dismiss(loadingToastId);
            toast.success("Welcome back!");
            localStorage.setItem("token", response.data.token);
            await refreshData();
            navigate("/dashboard");
        } catch (err) {
            toast.dismiss(loadingToastId);
            toast.error(err.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 overflow-y-auto no-scrollbar py-10">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] w-full max-w-[380px] p-8 shadow-2xl space-y-6"
            >
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-950">SwiftPay</h1>
                    <SubHeading label={"Log in to your account"} />
                </div>
                
                <div className="space-y-4">
                    <InputBox 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="john@example.com" 
                        label={"Email"} 
                    />
                    <PasswordInput 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        label={"Password"} 
                    />
                    
                    <div className="pt-2">
                        <Button 
                            onClick={handleSignin} 
                            label="Sign In" 
                            className="w-full h-12 shadow-lg shadow-zinc-200" 
                        />
                    </div>
                </div>

                <BottomWarning label={"New here?"} buttonText={"Create Account"} to={"/signup"} />
            </motion.div>
        </div>
    );
};