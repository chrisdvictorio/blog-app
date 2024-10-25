import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select("-password")
      .populate({
        path: "following",
        select:
          "_id fullName username profilePicture following followers posts likedPosts",
      })
      .populate({
        path: "followers",
        select:
          "_id fullName username profilePicture following followers posts likedPosts",
      })
      .populate({
        path: "posts",
        select: "_id author title body image createdAt",
      })
      .populate({
        path: "likedPosts",
        select: "_id author title body image createdAt",
      });

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
      following: user.following,
      followers: user.followers,
      posts: user.posts,
      likedPosts: user.likedPosts,
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const userToFollow = await User.findById(id);

    if (!user || !userToFollow) {
      return res.status(404).json({ error: "User Not Found." });
    }

    if (user._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({ error: "You can't follow yourself." });
    }

    const isFollowing = user.following.includes(id);
    if (isFollowing) {
      //Unfollow the user
      await User.findByIdAndUpdate(userId, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
      res
        .status(200)
        .json({
          message: `You unfollowed ${userToFollow.username}  successfully.`,
        });
    } else {
      //Follow the user
      await User.findByIdAndUpdate(userId, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: userId } });
      res
        .status(200)
        .json({
          message: `You followed ${userToFollow.username} successfully.`,
        });
    }
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const removeFollower = async (req, res) => {
  try {
    const { username, id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const follower = await User.findById(id);

    if (!user || !follower) {
      return res.status(404).json({ error: "User Not Found." });
    }

    if (username !== user.username) {
      return res
        .status(400)
        .json({ error: "You can't delete other user's followers" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { followers: id } });
    await User.findByIdAndUpdate(id, { $pull: { following: userId } });

    res.status(200).json({ message: "Follower removed successfully." });
  } catch (error) {
    console.error("Error in removeFollower controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, username, email, currentPassword, newPassword } =
      req.body;
    let { profilePicture } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken." });
      }
    }

    if (email) {
      const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    if (currentPassword) {
      if (!newPassword) {
        return res
          .status(400)
          .json({ error: "Please provide a new password." });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid current password." });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be atleast 6 characters long." });
      }
    }

    if (!currentPassword && newPassword) {
      return res
        .status(400)
        .json({ error: "Please provide your current password first." });
    }

    if (profilePicture) {
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`blog-app/users/${publicId}`);
          console.log("Image deleted from cloudinary");
        } catch (error) {
          console.log("Error deleting image from cloudinary:", error.message);
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        profilePicture,
        { folder: "blog-app/users" }
      );
      profilePicture = cloudinaryResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = newPassword || user.password;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export default { getUserProfile, followUser, updateProfile, removeFollower };
