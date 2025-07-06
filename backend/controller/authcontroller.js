const { sequelize, pool } = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../util/verifymail.js");
const users = require("../model/user.js");
const tempusers = require("../model/tempuser.js");

// User Signup(Register)
const registerUser = async (req, res) => {
  const { fullname, email, password, phone} = req.body;
 
  if (!fullname || !email || !password||!phone ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if user already exists (in Users or TempUsers)
    const userExists = await users.findOne({ where: { email } });
    const tempUserExists = await tempusers.findOne({ where: { email } });

    if (userExists || tempUserExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Save user data to TempUsers table
    await tempusers.create({
      fullname,
      email,
      password: hashedPassword,
      token,
      phone,
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    res.json({ msg: "Registration successful! Please check your email to verify your account." });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tempUser = await tempusers.findOne({ where: { token } });
    if (!tempUser) {
      return res.status(404).json({ msg: "Invalid or expired token" });
    }

    const userExists = await users.findOne({ where: { email: tempUser.email } });
    if (userExists) {
      return res.status(400).json({ msg: "User already registered" });
    }

    // ✅ Create new user
    const newUser = await users.create({
      fullname: tempUser.fullname,
      email: tempUser.email,
      password: tempUser.password,
      verified: true,
      phone: tempUser.phone,

    }); 


    await tempusers.destroy({ where: { id: tempUser.id } });

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const user = await users.findOne({ 
      where: { email },
      attributes: [
        "id", 
        "fullname", 
        "email", 
        "password", 
        "phone", 
      ]
    });

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const expiresIn = 3600; // 1 hour
    const token = jwt.sign(
      { id: user.id, email: user.email,  },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      msg: "Login successful",
      token,
      expiresIn,
      user: { 
        id: user.id, 
        email: user.email,  
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = { registerUser, loginUser, verifyEmail};