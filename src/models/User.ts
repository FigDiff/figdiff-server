import { Document, Schema, Model, model } from "mongoose";

interface History {
  imageId: string;
  imageUrl: string;
  date: Date;
}

interface TabUrl {
  url: string;
  history: History[];
}

interface User extends Document {
  userId: string;
  tabUrl: TabUrl[];
}

const historySchema: Schema<History> = new Schema({
  imageId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now(), required: true },
});

const tabUrlSchema: Schema<TabUrl> = new Schema({
  url: { type: String, required: true },
  history: { type: [historySchema], default: [], required: true },
});

const userSchema: Schema<User> = new Schema({
  userId: { type: String, required: true },
  tabUrl: { type: [tabUrlSchema], default: [], required: true },
});

const User: Model<User> = model<User>("User", userSchema);

export default User;
