import { useState } from "react";
import PropTypes from "prop-types";
import api from "../lib/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./Button";
import { Input } from "@/components/ui/input";

export const AddMoneyModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const quickAmounts = [100, 500, 1000, 5000];

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      await api.post(`/account/add-money`, { amount: Number(amount) });
      toast.success("Wallet recharged");
      setAmount("");
      onSuccess();
      onClose();
    } catch {
      toast.error("Recharge failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Top Up Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* QUICK AMOUNTS */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-zinc-500">
              Select Amount
            </label>

            <div className="flex gap-2 flex-wrap">
              {quickAmounts.map((amt) => {
                const isSelected = amount === amt.toString();

                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`
                      px-4 py-2 rounded-lg border
                      text-sm font-mono
                      transition-all duration-200
                      ${
                        isSelected
                          ? "bg-zinc-950 text-white border-zinc-950"
                          : "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100 hover:border-zinc-950"
                      }
                      active:scale-95
                    `}
                  >
                    +₹{amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUSTOM AMOUNT */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">
              Custom Amount
            </label>

            <Input
              type="number"
              placeholder="₹ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-xl font-mono focus-visible:ring-zinc-950"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            label="Complete Deposit"
            onClick={handleAdd}
            className="w-full h-12 bg-zinc-950 text-white hover:bg-zinc-900"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

AddMoneyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
