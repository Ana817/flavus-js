const mongoose = require("mongoose");

module.exports = (client) => {
  mongoose
    .connect(process.env.MONGODB_SRV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    })
    .then(() => {
      client.logger("Connected to MongoDB!".log);
    })
    .catch((err) => {
      client.logger("Error connecting to MongoDB: ".error + String(err.message).error);
    });
};
