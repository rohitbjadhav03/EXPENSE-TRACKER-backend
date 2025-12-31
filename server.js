import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
const app = express();

// Body parsers FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all origins temporarily
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err.message));

app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running successfully 🚀",
    routes: ["/api/expenses"],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
