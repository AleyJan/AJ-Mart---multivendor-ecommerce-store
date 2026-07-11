const mongoose = require("mongoose");

const connectDatabase = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err.message);
    });
};

module.exports = connectDatabase;
