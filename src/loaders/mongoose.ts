import mongoose from "mongoose";

async function mongooseLoader() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "FigDiff",
    });
    console.log("connected to database");
  } catch (error) {
    console.error(error);
  }
}

export default mongooseLoader;
