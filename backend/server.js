// backend/server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// For local testing: allow localhost dev origin + any deployed origins you use
const allowed = [
  "http://localhost:5173",
  "http://localhost:3000", // if CRA or other dev port
  "https://fast-food-backend-vugx.onrender.com", // your render backend (optional)
  "https://fastfoodss.netlify.app" // replace with your actual Netlify URL (no trailing slash)
];
// If you want the simplest local testing mode, enable the following:
// app.use(cors());
app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (like curl, mobile, or server-side)
    if (!origin) return cb(null, true);
    return cb(null, allowed.includes(origin));
  },
  credentials: true
}));

// DB
connectDB();

// endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => res.send("API Working"));
app.get("/health", (req, res) => res.status(200).send("OK"));

// temp test route (optional)
app.get("/api/food/test", (req, res) => res.json({ success: true, data: [] }));

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
