import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const SendMoneyModal = ({ user, onClose, onTransferSuccess }) => {
    const [amount, setAmount] = useState('');

    if (!user) return null;

    const handleTransfer = async () => {
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const loadingToastId = toast.loading('Initiating transfer...');
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/transfer`, 
            {
                to: user.id,
                amount: Number(amount)
            }, 
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            
            toast.dismiss(loadingToastId);
            toast.success("Transfer successful!");
            onTransferSuccess(); // This will trigger a data refresh on the dashboard
            onClose(); // Close the modal

        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(error.response?.data?.message || "Transfer failed.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-center mb-4">Send Money</h2>
                
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-2xl text-white">{user.name[0].toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium leading-none">Amount (in Rs)</label>
                    <input
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        id="amount"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Enter amount"
                        value={amount}
                    />
                </div>
                
                <button onClick={handleTransfer} className="mt-4 w-full justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
                    Initiate Transfer
                </button>
            </div>
        </div>
    );
};