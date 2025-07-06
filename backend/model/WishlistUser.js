// models/WishlistUser.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const WishlistUser = sequelize.define("WishlistUser", {
  userId: {
    type: DataTypes.UUID, // Must match User.id type
    allowNull: false,
    references: {
      model: 'users', // Match your actual table name
      key: 'id'
    }
  },
  wishlistId: {
    type: DataTypes.UUID, // Must match Wishlist.id type
    allowNull: false,
    references: {
      model: 'wishlists', // Match your actual table name
      key: 'id'
    }
  },
  // Additional attributes
  permissionLevel: {
    type: DataTypes.STRING,
    defaultValue: 'viewer'
  }
}, {
  tableName: 'wishlist_users', // Consistent naming
  timestamps: true,
  underscored: true
});

module.exports = WishlistUser;