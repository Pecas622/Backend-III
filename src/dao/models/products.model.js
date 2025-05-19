import { Schema, Types, model } from "mongoose";

const collection = "products";
const schema = new Schema(
    {
        name: { type: String, required: true, index: true },
        description: { type: String },
        category: { type: String, default: "Sanitizers", enum: ["Sanitizers", "Disinfectants", "Pest Control", "Protective Gear", "Cleaning Equipment", "Deodorizers", "Insecticides", "Rodenticides", "Fumigation Kits", "Surface Cleaners"], index: true },
        image: { type: String, default: "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg" },
        price: { type: Number, default: 500 },
        stock: { type: Number, default: 20 },
        isFeatured: { type: Boolean, default: false },
        owner_id: { type: Types.ObjectId, ref: "users", index: true },
    },
    { timestamps: true }
);

schema.pre(/^find/, function () {
    this.populate("owner_id", "email avatar");
});

const Product = model(collection, schema);
export default Product;
