import mongoose from "mongoose";

async function mongooseLoader() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "FigDiff",
    });
  } catch (error) {
    console.error(error);
  }
}

export default mongooseLoader;
