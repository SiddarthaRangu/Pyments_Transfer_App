const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account, Transaction, User } = require('../db');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({ userId: req.userId });
    res.json({ balance: account.balance });
});

router.post("/add-money", authMiddleware, async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Min. deposit is ₹1" });

    try {
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: amount } });
        res.json({ message: "Funds added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Transaction failed" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Recipient not found" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        
        await Transaction.create([{
            fromUserId: req.userId,
            toUserId: to,
            amount: amount
        }], { session });

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (e) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transfer failed" });
    } finally {
        session.endSession();
    }
});

router.get("/history", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ fromUserId: req.userId }, { toUserId: req.userId }]
        })
        .sort({ timestamp: -1 })
        .populate('fromUserId', 'firstName lastName')
        .populate('toUserId', 'firstName lastName');

        const history = transactions.map(tx => {
            const isSent = tx.fromUserId._id.toString() === req.userId;
            return {
                _id: tx._id,
                amount: tx.amount,
                timestamp: tx.timestamp,
                type: isSent ? 'sent' : 'received',
                otherParty: isSent ? tx.toUserId : tx.fromUserId
            };
        });

        res.json({ history });
    } catch (e) {
        res.status(500).json({ message: "Could not fetch history" });
    }
});

module.exports = router;