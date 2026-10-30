import mongoose from "mongoose";


const authorSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        biography: {
            type: String,
            default: ""
        },
        nationality: {
            type: String,
            required: true,
            trim: true
        },
        avatarUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Author", authorSchema);