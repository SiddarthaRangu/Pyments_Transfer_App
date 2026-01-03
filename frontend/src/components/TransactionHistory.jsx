import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Inbox } from "lucide-react";

export const TransactionHistory = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                    <Inbox className="h-10 w-10 text-zinc-200" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No transactions yet</h3>
                <p className="text-sm text-zinc-500 max-w-[200px]">Send or receive money to see your history here.</p>
            </div>
        );
    }

    const groups = transactions.reduce((acc, tx) => {
        const date = new Date(tx.timestamp);
        const label = date.toDateString() === new Date().toDateString() ? "Today" : 
                    date.toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" :
                    date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        if (!acc[label]) acc[label] = [];
        acc[label].push(tx);
        return acc;
    }, {});

    return (
        <div className="space-y-12">
            {Object.entries(groups).map(([date, items]) => (
                <div key={date} className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">{date}</h4>
                    <div className="space-y-1">
                        {items.map(tx => (
                            <div key={tx._id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-zinc-50 transition-all group cursor-pointer active:scale-[0.99]">
                                <div className="flex items-center gap-5">
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12", 
                                        tx.type === 'sent' ? "bg-zinc-100 text-zinc-900" : "bg-emerald-50 text-emerald-600")}>
                                        {tx.type === 'sent' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900 capitalize">{tx.otherParty.firstName} {tx.otherParty.lastName}</p>
                                        <p className="text-[11px] text-zinc-500 font-medium">{new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Wallet Transfer</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn("font-mono font-bold text-base", tx.type === 'sent' ? "text-zinc-900" : "text-emerald-600")}>
                                        {tx.type === 'sent' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                                    </p>
                                    <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter h-5 px-2 bg-zinc-100 text-zinc-500 border-none">Completed</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
TransactionHistory.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        timestamp: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        otherParty: PropTypes.shape({
            firstName: PropTypes.string.isRequired
        }).isRequired
    })).isRequired
};