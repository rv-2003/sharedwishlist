const express = require("express");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controller/productcontroller");
const authenticate = require("../middleware/auth");
const router = express.Router();
// Get all products in a wishlist
router.get("/:wishlistId", authenticate,getProducts);
router.post("/", authenticate, addProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
