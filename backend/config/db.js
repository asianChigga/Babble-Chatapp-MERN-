const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONO_URI, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    console.log(connect.connection.host);
  } catch (error) {
    console.error(error.message);
    process.exit();
  }
};
module.exports = connectDb;
