const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/db"); // ✅ Destructure correctly

require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/product", require("./routes/product"));

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
// ✅ CORS Configuration (Multiple Allowed Origins)

