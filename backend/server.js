import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

//App config
const app = express()
const port = process.env.PORT || 4000

//middleware
app.use(express.json())
const allowed = ['https://your-frontend-site.netlify.app','https://your-admin-site.netlify.app'];
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.indexOf(origin) !== -1) }));


//db connection
connectDB();

//api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})
app.get("/health", (req, res) => res.status(200).send("OK"));

// quick test route (temporary)
app.get("/api/food", (req, res) => {
  return res.json({
    success: true,
    message: "Test food endpoint working",
    data: []
  });
});


app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})

//
//mongodb+srv://donak:<db_password>@cluster0.4wnbt.mongodb.net/?