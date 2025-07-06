const express = require("express");
const { createWishlist, getWishlists, inviteUserToWishlist,deleteWishlist } = require("../controller/wishlist");
const authenticate = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, createWishlist);
router.get("/", authenticate, getWishlists);
router.post("/invite/:wishlistId", authenticate,inviteUserToWishlist);
router.delete("/:id", authenticate, deleteWishlist);
module.exports = router;
// routes/wishlist.js

