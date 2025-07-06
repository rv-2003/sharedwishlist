const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Load model definitions
const users = require("./user");

const Wishlist = require("./Wishlist");
const Product = require("./Product");
const WishlistUser = require("./WishlistUser");

// ✅ Put all models in one object
const models = {
  users,
  Wishlist,
  Product,
  WishlistUser,
};

// ✅ Call associate() for each model (if defined)
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// ✅ Define additional associations
users.hasMany(Wishlist, { foreignKey: "createdBy" });
Wishlist.belongsTo(users, { foreignKey: "createdBy" });

Wishlist.hasMany(Product, { foreignKey: "wishlistId" });
Product.belongsTo(Wishlist, { foreignKey: "wishlistId" });

users.hasMany(Product, { foreignKey: "addedBy" });
Product.belongsTo(users, { foreignKey: "addedBy" });

// ✅ Many-to-Many for shared wishlists
users.belongsToMany(Wishlist, {
  through: WishlistUser,
  foreignKey: "userId",
});
Wishlist.belongsToMany(users, {
  through: WishlistUser,
  foreignKey: "wishlistId",
});

// ✅ Export sequelize and models
module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
