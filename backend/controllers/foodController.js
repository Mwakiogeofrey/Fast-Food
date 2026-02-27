import foodModel from "../models/foodModel.js";
import fs from 'fs'    //file system

//add food item (supports single file via req.file or multiple via req.files)
const addFood = async(req,res)=>{
    try{
        let filenames = [];
        if (req.files && req.files.length) {
            filenames = req.files.map(f=>f.filename);
        } else if (req.file) {
            filenames = [req.file.filename];
        }

        const food = new foodModel({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            image: filenames[0] || '',
            images: filenames
        })

        await food.save();
        res.json({success:true,message:"Food Added"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// helper to convert mongoose Decimal128 to number/string
function normalizeFood(f) {
    const obj = f.toObject ? f.toObject() : {...f};
    if (obj.price && obj.price.$numberDecimal) {
        // transform to a normal JS number for easier rendering
        obj.price = parseFloat(obj.price.$numberDecimal);
    }
    return obj;
}

// food list
const listFood =async(req,res)=>{
    try {
        const foods=await foodModel.find({});
        const clean = foods.map(normalizeFood);
        res.json({success:true,data:clean})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//remove food item
const removeFood = async (req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            // delete all files if they exist
            const all = new Set([...(food.images||[]), food.image].filter(Boolean));
            all.forEach(f => {
                fs.unlink(`uploads/${f}`, ()=>{})
            })
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// edit food item (fields + optional new files)
const editFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.json({success:false,message:'Not found'});

        // update fields
        food.name = req.body.name ?? food.name;
        food.description = req.body.description ?? food.description;
        food.price = req.body.price ?? food.price;
        food.category = req.body.category ?? food.category;

        // handle newly uploaded files
        if (req.files && req.files.length) {
            const newFiles = req.files.map(f=>f.filename);
            food.images = (food.images || []).concat(newFiles);
            if (!food.image && newFiles.length) food.image = newFiles[0];
        }

        await food.save();
        // convert Decimal128 to primitive on response
        const out = food.toObject ? food.toObject() : {...food};
        if (out.price && out.price.$numberDecimal) out.price = parseFloat(out.price.$numberDecimal);
        res.json({success:true,message:'Food updated',data:out});
    } catch (error) {
        console.error('editFood error', error);
        res.json({success:false,message:'Error'})
    }
}

export {addFood,listFood,removeFood, editFood}