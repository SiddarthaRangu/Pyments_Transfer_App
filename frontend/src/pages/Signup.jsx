import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  // State to store error messages
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username,
                firstName,
                lastName,
                password
            });

            if (response.status === 200) {
                navigate("/signin");  // Redirect to Sign-in page after successful signup
            }
        } catch (err) {
            setError("❌ Signup failed! Please try again.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />

                    {/* Controlled Inputs */}
                    <InputBox onChange={e => setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
                    <InputBox onChange={e => setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
                    <InputBox onChange={e => setUsername(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
                    <InputBox onChange={e => setPassword(e.target.value)} placeholder="123456" label={"Password"} type="password" />

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="pt-4">
                        <Button onClick={handleSignup} label={"Sign up"} />
                    </div>

                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    );
};
