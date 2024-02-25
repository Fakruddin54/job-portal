import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.LOCAL_URL);
  } catch (error) {
    error;
  }
};

export default connectDB;
