import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory"; 

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]); 
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch balance
                const balanceResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/balance`, { headers });
                setBalance(balanceResponse.data.balance);

                // Fetch transaction history
                const historyResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/history`, { headers });
                setTransactions(historyResponse.data.history);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("⚠️ Failed to fetch data");
            }
        };

        fetchData();
    }, []); // Runs only once when component mounts

    return (
        <div>
            <Appbar />
            <div className="m-8">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Balance value={balance !== null ? balance.toFixed(2) : "Loading..."} />
                )}
                <Users />
                <TransactionHistory transactions={transactions} />
            </div>
        </div>
    );
};