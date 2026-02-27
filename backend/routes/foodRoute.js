// backend/routes/foodRoute.js
import express from "express";
import { addFood, listFood, removeFood, editFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/food/add
foodRouter.post("/add", upload.single("image"), addFood);

// GET /api/food and GET /api/food/list
foodRouter.get("/", listFood);
foodRouter.get("/list", listFood);

// POST /api/food/remove
foodRouter.post("/remove", removeFood);

// edit food item (fields + optional new images)
foodRouter.post("/edit", upload.array("images"), editFood);

export default foodRouter;

