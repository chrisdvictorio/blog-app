import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        enum: ["Education", "Entertainment", "Finance", "Food & Drink", "Health", "Lifestyle", "Technology", "Travel"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;