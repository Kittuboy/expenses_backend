const express = require("express");
const router = express.Router();
const Budget = require("../models/budgetModel");


/// SAVE BUDGET
router.post("/save-budget", async (req, res) => {

  try {

    const { monthlyLimit } = req.body;

    /// old budget delete
    await Budget.deleteMany({});

    const newBudget = new Budget({
      monthlyLimit
    });

    await newBudget.save();

    res.json({
      success: true,
      data: newBudget
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});


/// GET BUDGET
router.get("/get-budget", async (req, res) => {

  try {

    const budget = await Budget.findOne().sort({createdAt:-1});

    res.json({
      success: true,
      data: budget
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });

  }

});

module.exports = router;