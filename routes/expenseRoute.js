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


/// ADD EXPENSE
router.post("/add-expense", async (req, res) => {

  try {

    const { container, title, amount } = req.body;

    if(!container || !title || !amount){

      return res.status(400).json({
        success: false,
        message: "Container, Title and Amount required"
      });

    }

    const expense = new Expense({

      container,
      title,
      amount

    });

    await expense.save();

    res.json({

      success: true,
      message: "Expense Added"

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/// DELETE EXPENSE
router.delete("/delete-expense/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const deleted = await Expense.findByIdAndDelete(id);

    if(!deleted){

      return res.status(404).json({
        success:false,
        message:"Expense not found"
      });

    }

    res.json({
      success:true,
      message:"Expense deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });

  }

});


/// GET CONTAINERS
router.get("/containers", async (req, res) => {

  try {

    const containers = await Expense.distinct("container");

    const formatted = containers.map(item => ({
      name: item
    }));

    res.json(formatted);

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});


/// CREATE CONTAINER
router.post("/create-container", async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Container name required"
      });
    }

    /// Check if container already exists
    const exist = await Expense.findOne({ container: name });

    if (exist) {
      return res.json({
        message: "Container already exists"
      });
    }

    /// Create container using dummy expense
    const container = new Expense({
      container: name,
      title: "Container",
      amount: 0
    });

    await container.save();

    res.json({
      success: true,
      message: "Container created"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

});

module.exports = router;