// models/Wishlist.js
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users", // ✅ Matches DB table name
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
}, {
  tableName: "wishlists", // ✅ Matches DB table name
  timestamps: true,
  underscored: true,
});

// ✅ Add associations in a separate method
Wishlist.associate = (models) => {
  // Many-to-Many: Wishlist <-> users
  Wishlist.belongsToMany(models.users, { // 👈 use models.users
    through: models.WishlistUser,
    foreignKey: 'wishlistId',
    otherKey: 'userId',
    as: 'sharedWith',
  });

  // One-to-Many: Wishlist -> Products
  Wishlist.hasMany(models.Product, {
    foreignKey: 'wishlistId',
    as: 'products',
  });

  // One-to-Many: Wishlist -> WishlistUser
  Wishlist.hasMany(models.WishlistUser, {
    foreignKey: 'wishlistId',
    as: 'wishlistUsers',
  });
};

module.exports = Wishlist;


