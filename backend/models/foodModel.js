import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true }, // High precision
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true }
});

// Optional: Add a virtual to format price when retrieving
foodSchema.virtual('priceFormatted').get(function() {
    return this.price ? this.price.toString() : '0';
});

// Ensure virtuals are included when converting to JSON
foodSchema.set('toJSON', { virtuals: true });
foodSchema.set('toObject', { virtuals: true });

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;