import tokenAndCookie from "../lib/tokenAndCookie.js";
import User from "../models/userModel.js";

const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be atleast 6 characters long." });
    }

    const user = await User.create({ fullName, username, email, password });

    tokenAndCookie(user._id, res);

    res.status(201).json({
      message: "User created successfully.",
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      tokenAndCookie(user._id, res);

      res.status(200).json({ message: "Logged in successfully." });
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully." });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "posts",
        select: "_id author title body image createdAt",
      })
      .populate({
        path: "likedPosts",
        select: "_id author title body image createdAt",
      })
      .populate({
        path: "savedPosts",
        select: "_id author title body image createdAt",
      })
      .populate({
        path: "following",
        select:
          "_id fullName username profilePicture following followers posts likedPosts",
      })
      .populate({
        path: "followers",
        select:
          "_id fullName username profilePicture following followers posts likedPosts",
      });

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export default { signup, login, logout, getUser };
