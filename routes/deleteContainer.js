const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

/// DELETE CONTAINER
router.delete("/delete-container/:container", async (req, res) => {

  try {

    const { container } = req.params;

    const result = await Expense.deleteMany({
      container: container
    });

    res.json({
      success: true,
      message: "Container deleted",
      deletedCount: result.deletedCount
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

module.exports = router;