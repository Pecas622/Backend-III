import { Schema, Types, model } from "mongoose";

const collection = "santiagoPets";
const schema = new Schema(
    {
        name: { type: String, required: true },
        specie: { type: String, required: true },
        birthDate: { type: Date },
        adopted: { type: Boolean, default: false },
        owner: { type: Types.ObjectId, ref: "santiagoUsers" },
        image: { type: String },
    },
    { timestamps: true }
);

const SantiagoPet = model(collection, schema);
export default SantiagoPet;
