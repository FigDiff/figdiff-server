import { Document, Schema, Model, model } from "mongoose";

interface History {
  historyName: string;
  imageUrls: string[];
  date: string;
}

interface TabUrl {
  tabUrlName: string;
  history: History[];
}

interface PageName {
  pageName: string;
  tabUrls: TabUrl[];
}

interface User extends Document {
  userId: string;
  pageNames: PageName[];
}

const historySchema: Schema<History> = new Schema({
  historyName: {
    type: String,
    default: new Date().toLocaleString("ko-KR"),
    required: true,
  },
  imageUrls: { type: [String, String], default: [], required: true },
  date: {
    type: String,
    default: new Date().toLocaleString("ko-KR"),
    required: true,
  },
});

const tabUrlSchema: Schema<TabUrl> = new Schema({
  tabUrlName: { type: String, required: true },
  history: { type: [historySchema], default: [], required: true },
});

const pageNameSchema: Schema<PageName> = new Schema({
  pageName: { type: String, required: true },
  tabUrls: { type: [tabUrlSchema], default: [], required: true },
});

const userSchema: Schema<User> = new Schema({
  userId: { type: String, required: true },
  pageNames: { type: [pageNameSchema], default: [], required: true },
});

const User: Model<User> = model<User>("User", userSchema);

export default User;
