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

// optional URLs configured via .env
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const ADMIN_URL = process.env.ADMIN_URL || "http://localhost:5174";

app.use(express.json());

// For local testing: allow localhost dev origins + any deployed origins you use.
// Instead of hardcoding the frontend URLs we can read them from environment variables
// so that changing ports or deploying to a different host doesn't require editing
// source code.  Add FRONTEND_URL and ADMIN_URL to your backend/.env.
const allowed = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173", // fallback if env variables not set
  "http://localhost:5174",
  "http://localhost:3000", // if CRA or other dev port
  "https://fast-food-backend-vugx.onrender.com", // your render backend (optional)
  "https://fastfoodss.netlify.app" // replace with your actual Netlify URL (no trailing slash)
].filter(Boolean);
// If you want the simplest local testing mode, enable the following:
// app.use(cors());
// During development it can be easier to allow any localhost port
// so you don't need to keep updating the list.  The regex below matches
// http://localhost:XXXX where XXXX is 3000, 5173, 5174, etc.
// For production you'll probably switch back to strict origin checking
// using FRONTEND_URL / ADMIN_URL environment vars.

console.log("CORS allowed origins:", allowed);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server or curl

    // quick regex to allow localhost with any port in the 5000+ range
    if (/^http:\/\/localhost:\d+$/.test(origin)) {
      return cb(null, true);
    }

    if (allowed.includes(origin)) {
      return cb(null, true);
    }

    // otherwise block
    cb(null, false);
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
