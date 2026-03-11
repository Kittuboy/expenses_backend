const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/expenses", async (req, res) => {

  try {

    // Latest expenses
    const expenses = await Expense.find().sort({ createdAt: -1 });

    const now = new Date();

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const yearStart = new Date(
      now.getFullYear(),
      0,
      1
    );

    // Monthly total
    const monthlyTotal = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Yearly total
    const yearlyTotal = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: yearStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json({

      success: true,

      count: expenses.length,

      monthlyTotal: monthlyTotal.length > 0
        ? monthlyTotal[0].total
        : 0,

      yearlyTotal: yearlyTotal.length > 0
        ? yearlyTotal[0].total
        : 0,

      data: expenses

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});


/// HISTORY API
router.get("/history", async (req, res) => {

  try {

    const history = await Expense.aggregate([

      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },

      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }

    ]);

    const formatted = history.map(item => ({

      period: `${item._id.month}-${item._id.year}`,
      type: "monthly",
      total: item.total

    }));


     console.log(formatted);

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});

module.exports = router;