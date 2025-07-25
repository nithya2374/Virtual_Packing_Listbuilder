import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL ,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("MongoDB connected");
  } 
  catch (err) {
    console.error("MongoDB failed ", err.message);
    process.exit(1);
  }
};

export default connectDB;
