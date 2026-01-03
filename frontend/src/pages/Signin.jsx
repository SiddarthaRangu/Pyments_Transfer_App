import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignin = async () => {
        let loadingToastId; // Declare toast ID variable
        try {
            // 1. Show a loading toast
            loadingToastId = toast.loading('Signing in...');

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`, {
                username,
                password
            });
            
            // 2. Dismiss the loading toast on success
            toast.dismiss(loadingToastId);

            if (response.status === 200) {
                // 3. Show a success toast
                toast.success("Signed in successfully!");

                localStorage.setItem("token", response.data.token);
                navigate("/dashboard"); // Redirect to dashboard on success
            }
        } catch (err) {
            // 4. Dismiss loading toast and show an error toast on failure
            toast.dismiss(loadingToastId);
            toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    
                    <InputBox onChange={e => setUsername(e.target.value)} placeholder="john.doe@example.com" label={"Email"} />
                    <InputBox onChange={e => setPassword(e.target.value)} placeholder="123456" label={"Password"} type="password" />
                    <div className="pt-4">
                        <Button 
                            onClick={handleSignin} 
                            label={"Sign in"} 
                            className="bg-slate-950 hover:bg-slate-800 h-11 text-white shadow-lg shadow-slate-200" 
                        />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
};