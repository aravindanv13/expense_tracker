const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} = require("../controllers/expenseController");

// Protected routes - all expense routes require authentication
router.get("/summary", protect, getSummary);
router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.get("/:id", protect, getExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;