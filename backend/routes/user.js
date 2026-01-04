const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const bcrypt = require('bcryptjs');

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword
    });
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({
        userId
    }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
        message: "User created successfully",
        token: token
    });
});

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        // Use 400 for bad/invalid input format
        return res.status(400).json({
            message: "Incorrect inputs"
        });
    }

    // STEP 1: Find the user by their username ONLY.
    const user = await User.findOne({
        username: req.body.username
    });

    // STEP 2: Check if a user was found.
    if (user) {
        // STEP 3: If a user was found, NOW compare the provided password
        // with the hashed password stored in the database.
        const isMatch = await bcrypt.compare(req.body.password, user.password);
                 if (isMatch) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET, { expiresIn: "7d" });
      
            // Send the success response
            return res.json({
                token: token
            });
        }
    }
    
    // If the user was not found OR the password comparison failed,
    // send a generic "unauthorized" error.
    // Use 401 for authentication failure.
    res.status(401).json({
        message: "Error while logging in / Invalid Credentials"
    });
});

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    });
});

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $and: [
            {
                _id: { $ne: req.userId }
            },
            {
                $or: [{
                    firstName: { "$regex": filter, "$options": "i" }
                }, {
                    lastName: { "$regex": filter, "$options": "i" }
                }]
            }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findOne({ _id: req.userId }).select("-password");

    if (!user) {
        return res.status(401).json({ message: "`Unauthorized" });
    }

    res.json({
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            _id: user._id
        }
    });
});

const passwordUpdateBody = zod.object({
    oldPassword: zod.string(),
    newPassword: zod.string().min(6)
});

router.put("/change-password", authMiddleware, async (req, res) => {
    const { success, data } = passwordUpdateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid inputs" });
    }

    const user = await User.findById(req.userId);
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Current password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    await User.updateOne({ _id: req.userId }, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
});

module.exports = router;