const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./db");
const expenseRoute = require("./routes/expenseRoute");

dotenv.config();

const Expense = require("./models/Expense");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/// MongoDB Connect
connectDB();


/// ADD EXPENSE API
app.post("/add-expense", async (req,res) => {

    try{

        const {title, amount} = req.body;

        if(!title || !amount){

            return res.status(400).json({
                message:"Title and amount required"
            });

        }

        const expense = new Expense({
            title,
            amount
        });

        await expense.save();

        res.json({
            message:"Expense saved",
            data: expense
        });

    }catch(error){

        res.status(500).json({
            message:"Server error"
        });

    }

});




app.use("/api", expenseRoute);


app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});