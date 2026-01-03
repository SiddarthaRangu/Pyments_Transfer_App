import PropTypes from 'prop-types';
import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./Button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SendMoneyModal = ({ user, onClose, onTransferSuccess }) => {
    const [step, setStep] = useState(1); // 1: Input, 2: Confirm, 3: Success
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { balance } = useAuth();

    const handleTransfer = async () => {
        setLoading(true);
        try {
            await api.post(`/account/transfer`, { to: user.id, amount: Number(amount) });
            setStep(3);
            onTransferSuccess();
            setTimeout(onClose, 2000);
        } catch (e) {
            toast.error(e.response?.data?.message || "Error");
            setStep(1);
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={!!user} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-8 space-y-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center">Enter Amount</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center text-3xl font-bold text-zinc-900">{user?.name[0]}</div>
                                <p className="font-bold text-lg">{user?.name}</p>
                            </div>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-mono text-zinc-300">₹</span>
                                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-24 pl-14 text-5xl font-mono border-none bg-zinc-50 rounded-3xl text-center focus-visible:ring-zinc-950" placeholder="0" />
                            </div>
                            <Button label="Continue" disabled={!amount || Number(amount) > balance} onClick={() => setStep(2)} className="w-full h-16 bg-zinc-950 text-white rounded-[1.5rem] text-lg" />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8 space-y-8">
                            <DialogHeader><DialogTitle className="text-center">Confirm Transfer</DialogTitle></DialogHeader>
                            <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 text-center space-y-2">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total to Send</p>
                                <p className="text-5xl font-mono font-bold text-zinc-950">₹{amount}</p>
                                <p className="text-sm text-zinc-500 pt-4">Recipient: <span className="text-zinc-900 font-bold">{user?.name}</span></p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" label="Back" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl" />
                                <Button label={loading ? <Loader2 className="animate-spin" /> : "Confirm & Send"} onClick={handleTransfer} className="flex-[2] h-14 bg-zinc-950 text-white rounded-2xl font-bold" />
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 text-center space-y-6">
                            <div className="flex justify-center"><CheckCircle2 className="h-24 w-24 text-emerald-500" strokeWidth={1} /></div>
                            <h2 className="text-2xl font-bold">Transfer Successful!</h2>
                            <p className="text-zinc-500">₹{amount} has been sent to {user?.name}.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};

SendMoneyModal.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    onClose: PropTypes.func.isRequired,
    onTransferSuccess: PropTypes.func.isRequired
};