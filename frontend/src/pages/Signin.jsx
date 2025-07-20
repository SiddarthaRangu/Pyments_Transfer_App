import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();

    const handleSignin = async () => {
        try {
            const response = await axios.post("https://pyments-transfer-app.onrender.com/api/v1/user/signin", {
                username,
                password
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard"); // Redirect to dashboard on success
            }
        } catch (err) {
            setError("❌ Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    
                    <InputBox onChange={e => setUsername(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
                    <InputBox onChange={e => setPassword(e.target.value)} placeholder="123456" label={"Password"} type="password" />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="pt-4">
                        <Button onClick={handleSignin} label={"Sign in"} />
                    </div>

                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
};
