import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
const app = express();

// ✅ Global middlewares
app.use(express.json());

// ✅ CORS setup — allow your Vercel frontend and localhost
const allowedOrigins = [
  process.env.CORS_ORIGIN, // your Vercel URL from Render env
  "http://localhost:5173", // local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err.message));

// ✅ Routes
app.use("/api/expenses", expenseRoutes);

// ✅ Root route (health check)
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running successfully 🚀",
    routes: ["/api/expenses"],
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
