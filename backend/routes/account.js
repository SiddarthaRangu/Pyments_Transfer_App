// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account,Transaction } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    
    // Create a transaction record
    await Transaction.create([{
        fromUserId: req.userId,
        toUserId: to,
        amount: amount
    }], { session: session });

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

router.get("/history", authMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const transactions = await Transaction.find({
            $or: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        })
        .sort({ timestamp: -1 }) // Show the newest transactions first
        .populate('fromUserId', 'firstName lastName') // Get sender's name
        .populate('toUserId', 'firstName lastName');  // Get receiver's name

        // We need to know who the current user is to format the frontend correctly
        const formattedTransactions = transactions.map(tx => ({
            _id: tx._id,
            amount: tx.amount,
            timestamp: tx.timestamp,
            // Check if the current user sent or received the money
            type: tx.fromUserId._id.toString() === userId ? 'sent' : 'received',
            // Get the other party's information
            otherParty: tx.fromUserId._id.toString() === userId 
                ? tx.toUserId 
                : tx.fromUserId
        }));

        res.json({ history: formattedTransactions });

    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history" });
    }
});

module.exports = router;