const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const users = sequelize.define("users", { // ✅ Model name: 'users'
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: "created_at",
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,           // ✅ Add this
  underscored: false,          // ✅ if your DB uses snake_case
  tableName: "users",         // ✅ ensure correct table name
});

// ✅ Define associations
users.associate = (models) => {
  users.belongsToMany(models.Wishlist, { // ✅ Link to Wishlist model
    through: models.WishlistUser,        // ✅ Join table
    foreignKey: 'userId',                // ✅ Column in join table
    otherKey: 'wishlistId',              // ✅ Column in join table
    as: 'sharedWishlists',               // ✅ Alias
  });

  users.hasMany(models.Product, {
    foreignKey: 'addedBy',
    as: 'products',
  });

  users.hasMany(models.Wishlist, {
    foreignKey: 'createdBy',
    as: 'createdWishlists',
  });
};

module.exports = users;

