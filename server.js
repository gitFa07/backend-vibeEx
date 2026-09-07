require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

connectDB(); // Connect to the database

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
