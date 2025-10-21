// frontend/src/components/TransactionHistory.jsx

export const TransactionHistory = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <div className="mt-6">
                <h3 className="text-lg font-bold">Transaction History</h3>
                <p className="mt-2 text-gray-500">You have no transactions yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold">Transaction History</h3>
            <div className="mt-4 space-y-4">
                {transactions.map(tx => (
                    <div key={tx._id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                        <div>
                            <p className="font-semibold">
                                {tx.type === 'sent' ? `Sent to ${tx.otherParty.firstName}` : `Received from ${tx.otherParty.firstName}`}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(tx.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <div className={`font-bold ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                            {tx.type === 'sent' ? '-' : '+'} Rs {tx.amount.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};