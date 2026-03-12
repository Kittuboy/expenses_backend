const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

  container: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Expense", expenseSchema);