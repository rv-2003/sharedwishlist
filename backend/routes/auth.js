const express =require("express");

const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require("../controller/authcontroller");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail); // ✅ this is the verification route




module.exports = router;
