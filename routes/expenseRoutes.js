import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    return res.status(200).json(Array.isArray(expenses) ? expenses : []);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching expenses.",
    });
  }
});

router.post("/", async (req, res) => {
  console.log("BODY IN /api/expenses ===>", req.body);  // DEBUG LOG

  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const expense = new Expense({
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
    });

    const savedExpense = await expense.save();
    return res.status(201).json(savedExpense);
  } catch (err) {
    console.error("❌ Error adding expense:", err.message);
    return res.status(400).json({
      success: false,
      message: "Failed to add expense.",
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found." });
    }

    return res.status(200).json(updatedExpense);
  } catch (err) {
    console.error("❌ Error updating expense:", err.message);
    return res.status(400).json({
      success: false,
      message: "Failed to update expense.",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found." });
    }

    return res.status(200).json({ success: true, message: "Expense deleted." });
  } catch (err) {
    console.error("❌ Error deleting expense:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete expense.",
      error: err.message,
    });
  }
});

export default router;
