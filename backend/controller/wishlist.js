const { Wishlist, WishlistUser, users: User, Product } = require("../model"); // ✅ Make sure to import Product too

// ✅ Create Wishlist
exports.createWishlist = async (req, res) => {
  try {
    const { name } = req.body;

    const wishlist = await Wishlist.create({
      name,
      createdBy: req.user.id, // ✅ req.user.id should come from your auth middleware
    });

    res.status(201).json(wishlist);
  } catch (err) {
    console.error("❌ Create wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get All Wishlists (owned + shared)
exports.getWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.findAll({
      include: [
        {
          model: User,
          as: "sharedWith", // ✅ Matches alias in Wishlist.associate
          through: { attributes: [] }, // Exclude pivot table fields
        },
        {
          model: Product,
          as: "products", // ✅ Matches alias in Wishlist.associate
        },
        {
          model: User,
          foreignKey: "createdBy", // ✅ Use createdBy instead of created_by
          attributes: ["id", "fullname", "email"], // Only select useful fields
        },
      ],
    });

    res.json(wishlists);
  } catch (err) {
    console.error("❌ Get wishlists error:", err);
    res.status(500).json({
      error: "Failed to fetch wishlists",
      details: err.message,
    });
  }
};

// ✅ Invite a user to wishlist
exports.inviteUserToWishlist = async (req, res) => {
  const { email } = req.body;
  const { wishlistId } = req.params;

  try {
    // Find the user to invite
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Add user to wishlist (or check if already exists)
    const [entry, created] = await WishlistUser.findOrCreate({
      where: {
        userId: user.id,
        wishlistId,
      },
    });

    if (created) {
      return res.status(201).json({ msg: "User invited to wishlist" });
    } else {
      return res.status(200).json({ msg: "User already has access" });
    }
  } catch (err) {
    console.error("❌ Invite error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Delete Wishlist (only owner can delete)
exports.deleteWishlist = async (req, res) => {
  try {
    const wishlistId = req.params.id;
    const userId = req.user.id;

    const wishlist = await Wishlist.findByPk(wishlistId);

    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    if (wishlist.createdBy !== userId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this wishlist" });
    }

    await wishlist.destroy();
    res.json({ msg: "Wishlist deleted successfully" });
  } catch (err) {
    console.error("❌ Delete wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
