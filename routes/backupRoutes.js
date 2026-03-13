const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");


/// GET ALL EXPENSES (FOR BACKUP)

router.get("/get-all-expenses", async (req, res) => {

    try {

        const expenses = await Expense.find()
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: expenses.length,
            data: expenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }

});

module.exports = router;