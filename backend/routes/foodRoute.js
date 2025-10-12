import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// POST /api/food/add  (supports multiple files in 'images' field or single 'image')
foodRouter.post("/add", upload.array("images"), addFood);

// GET /api/food and GET /api/food/list  (both return listFood)
foodRouter.get("/", listFood);
foodRouter.get("/list", listFood);

// POST /api/food/remove
foodRouter.post("/remove", removeFood);

// POST /api/food/edit  (supports multiple files in 'images')
foodRouter.post("/edit", upload.array("images"), editFood);

export default foodRouter;
