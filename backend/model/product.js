const { Sequelize, DataTypes } = require("sequelize");
const {sequelize }= require("../config/db");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  wishlistId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  addedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

module.exports = Product;

