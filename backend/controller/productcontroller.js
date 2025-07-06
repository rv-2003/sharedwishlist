const { Product } = require("../model");

exports.addProduct = async (req, res) => {
  const { name, imageUrl, price, wishlistId } = req.body;
  try {
    const product = await Product.create({
      name,
      imageUrl,
      price,
      wishlistId,
      addedBy: req.user.id
    });
    res.json(product);
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ msg: "Failed to add product", error: err.message });
  }
};


exports.getProducts = async (req, res) => {
  const { wishlistId } = req.params;
  const products = await Product.findAll({ where: { wishlistId } });
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const { name, imageUrl, price } = req.body;
  await Product.update(
    { name, imageUrl, price },
    { where: { id: req.params.id } }
  );
  res.json({ message: "Updated" });
};

exports.deleteProduct = async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
