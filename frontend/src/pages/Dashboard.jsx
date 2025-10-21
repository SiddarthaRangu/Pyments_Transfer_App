import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory";
import { SendMoneyModal } from '../components/SendMoneyModal';

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('users'); 
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [balanceRes, historyRes, userRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/balance`, { headers }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/history`, { headers }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, { headers })
            ]);

            setBalance(balanceRes.data.balance);
            setTransactions(historyRes.data.history);
            setUser(userRes.data.user);

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("⚠️ Failed to fetch data");
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSendMoney = (user) => {
        setSelectedUser({ id: user._id, name: user.firstName });
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleTransferSuccess = () => {
        // Refetch data to update balance and transaction history
        fetchData();
    };

    return (
        <div>
            <Appbar userName={user ? user.firstName : ''} />
            <div className="m-8">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Balance value={balance !== null ? balance : "Loading..."} />
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mt-8">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'users'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'history'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Transaction History
                        </button>
                    </nav>
                </div>

                {/* Conditional Rendering based on activeTab */}
                <div className="mt-6">
                    {activeTab === 'users' && <Users onSendMoney={handleSendMoney} />}
                    {activeTab === 'history' && <TransactionHistory transactions={transactions} />}
                </div>
            </div>
            {selectedUser && (
                <SendMoneyModal 
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onTransferSuccess={handleTransferSuccess}
                />
            )}
        </div>
        
    );
};