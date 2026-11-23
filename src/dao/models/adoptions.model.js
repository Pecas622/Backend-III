import { Schema, Types, model } from "mongoose";

const collection = "santiagoAdoptions";
const schema = new Schema(
    {
        owner: { type: Types.ObjectId, ref: "santiagoUsers", required: true },
        pet: { type: Types.ObjectId, ref: "santiagoPets", required: true },
    },
    { timestamps: true }
);

const SantiagoAdoption = model(collection, schema);
export default SantiagoAdoption;
