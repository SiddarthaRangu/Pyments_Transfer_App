import { motion, useSpring, useTransform } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const Balance = ({ value = 0 }) => {
    const springValue = useSpring(0, { stiffness: 60, damping: 20 });
    const displayValue = useTransform(springValue, (v) => 
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v)
    );

    useEffect(() => {
        springValue.set(value || 0);
    }, [value, springValue]);

    return (
        <Card className="bg-zinc-950 text-white border-none shadow-2xl relative overflow-hidden rounded-[2rem]">
            {/* Reduced padding from py-10 to py-8 */}
            <CardContent className="px-8 py-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">Personal Account</p>
                        <p className="text-[11px] font-medium text-zinc-400">SwiftPay Platinum • 7829</p>
                    </div>
                    <div className="h-8 w-12 bg-white/10 rounded-lg border border-white/5 flex items-center justify-center italic font-black text-white/20 text-xs tracking-tighter">VISA</div>
                </div>

                <div className="space-y-0">
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Available Balance</p>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+₹245</span>
                    </div>
                    {/* Adjusted text size to 5xl for better fit */}
                    <motion.div className="text-5xl font-mono tracking-tighter font-bold py-1">
                        {displayValue}
                    </motion.div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Updated: Just now</p>
                    <div className="h-5 w-8 rounded-full bg-zinc-800 border border-white/5 flex items-center px-1">
                         <div className="h-3 w-3 rounded-full bg-zinc-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
Balance.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};