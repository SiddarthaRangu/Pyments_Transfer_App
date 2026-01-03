import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory";
import { SendMoneyModal } from '../components/SendMoneyModal';
import { AddMoneyModal } from '../components/AddMoneyModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Dashboard = () => {
    const { user, balance, refreshData } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddMoney, setShowAddMoney] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await api.get("/account/history");
            setTransactions(res.data.history);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory, balance]);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen bg-[#fafafa] text-slate-950 font-sans"
        >
            <Appbar userName={user?.firstName} />
            
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Changed columns: sidebar gets 5 spans, content gets 7 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDEBAR - NOW WIDER */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                        <Balance value={balance} />
                        
                        <Card className="border-zinc-200/60 shadow-sm rounded-[2rem] overflow-hidden bg-white p-1">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Wallet Actions</h4>
                                </div>
                                <button 
                                    onClick={() => setShowAddMoney(true)}
                                    className="flex items-center justify-center gap-3 w-full h-14 bg-zinc-950 text-white rounded-[1.5rem] hover:bg-zinc-800 transition-all font-bold text-base shadow-lg shadow-zinc-200 active:scale-[0.98]"
                                >
                                    <Plus className="h-5 w-5" /> Add Money
                                </button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT CONTENT - NOW 7 SPANS */}
                    <div className="lg:col-span-7">
                        <Tabs defaultValue="users" className="w-full">
                            <TabsList className="bg-zinc-100 p-1.5 h-14 inline-flex rounded-[1.5rem] border border-zinc-200/50 mb-6">
                                <TabsTrigger value="users" className="rounded-[1rem] px-8 h-11 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm">Contacts</TabsTrigger>
                                <TabsTrigger value="history" className="rounded-[1rem] px-8 h-11 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm">History</TabsTrigger>
                            </TabsList>
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-zinc-200/60 rounded-[2.5rem] p-8 shadow-sm min-h-[550px]"
                                >
                                    <TabsContent value="users" className="mt-0 outline-none">
                                        <Users onSendMoney={(u) => setSelectedUser({ id: u._id, name: u.firstName })} />
                                    </TabsContent>
                                    <TabsContent value="history" className="mt-0 outline-none">
                                        <TransactionHistory transactions={transactions} />
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>
                </div>
            </main>

            <AddMoneyModal isOpen={showAddMoney} onClose={() => setShowAddMoney(false)} onSuccess={refreshData} />
            {selectedUser && <SendMoneyModal user={selectedUser} onClose={() => setSelectedUser(null)} onTransferSuccess={refreshData} />}
        </motion.div>
    );
};