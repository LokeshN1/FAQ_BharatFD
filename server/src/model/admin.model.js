import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {timestamps: true}, // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model("Admin", adminSchema);
