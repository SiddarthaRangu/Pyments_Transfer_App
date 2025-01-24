import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}` // Send token for authentication
                    }
                });

                setBalance(response.data.balance); // Set balance from API response
            } catch (err) {
                console.error("Error fetching balance:", err);
                setError("⚠️ Failed to fetch balance");
            }
        };

        fetchBalance();
    }, []); // Runs only once when component mounts

    return (
        <div>
            <Appbar />
            <div className="m-8">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Balance value={balance !== null ? balance : "Loading..."} />
                )}
                <Users />
            </div>
        </div>
    );
};
