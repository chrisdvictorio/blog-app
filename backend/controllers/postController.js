import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
  try {
    const { category, title, body } = req.body;
    let { image } = req.body;
    const user = await User.findById(req.user._id);

    if (!category || !title || !body) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "blog-app/posts",
    });

    const post = await Post.create({
      author: user,
      category,
      title,
      body,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

    res.status(201).json({ message: "Post Created Successfully.", post });
  } catch (error) {
    console.error("Error in createPost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post Not Found." });
    }

    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      //unlike the post
      await Post.findByIdAndUpdate(id, { $pull: { likedBy: userId } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { likedPosts: id } });
      res.status(200).json({ message: "Post unliked successfully." });
    } else {
      //like the post
      await Post.findByIdAndUpdate(id, { $push: { likedBy: userId } });
      await User.findByIdAndUpdate(req.user._id, { $push: { likedPosts: id } });
      res.status(200).json({ message: "Post liked successfully." });
    }
  } catch (error) {
    console.error("Error in likePost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const savePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post Not Found." });
    }

    const isSaved = post.savedBy.includes(userId);
    if (isSaved) {
      //delete the post from save
      await Post.findByIdAndUpdate(id, { $pull: { savedBy: userId } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: id } });
      res.status(200).json({ message: "Post removed in saved posts." });
    } else {
      //save the post
      await Post.findByIdAndUpdate(id, { $push: { savedBy: userId } });
      await User.findByIdAndUpdate(req.user._id, { $push: { savedPosts: id } });
      res.status(200).json({ message: "Post saved successfully." });
    }
  } catch (error) {
    console.error("Error in savePost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    if (!posts) {
      return res.status(200).json({ message: "There are currently no posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!post) {
      return res.status(404).json({ error: "Post Not Found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getSinglePost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ category });

    if (!posts) {
      return res
        .status(200)
        .json({ message: `There are currently no ${category} posts.` });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostByCategory controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id);

    const { category, title, body } = req.body;
    let { image } = req.body;

    if (!post) {
      return res.status(404).json({ error: "Post Not Found." });
    }

    if (user._id.toString() !== post.author._id.toString()) {
      return res.status(400).json({ error: "You can't edit other user post." });
    }

    if (image) {
      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`blog-app/posts/${publicId}`);
          console.log("Image deleted from cloudinary");
        } catch (error) {
          console.log("Error deleting image from cloudinary:", error.message);
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "blog-app/posts",
      });
      image = cloudinaryResponse.secure_url;
    }

    post.category = category || post.category;
    post.title = title || post.title;
    post.body = body || post.body;
    post.image = image || post.image;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully.",
      category: post.category,
      title: post.title,
      body: post.body,
      image: post.image,
    });
  } catch (error) {
    console.error("Error in editPost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post Not Found." });
    }

    if (user._id.toString() !== post.author._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't delete other user post." });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`posts/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary:", error.message);
      }
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error in deletePost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export default {
  createPost,
  likePost,
  savePost,
  getAllPosts,
  getSinglePost,
  getPostsByCategory,
  editPost,
  deletePost,
};
