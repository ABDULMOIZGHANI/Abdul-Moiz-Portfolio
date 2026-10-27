import { Schema, model, models, type Model } from "mongoose";

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    filters: { type: [String], default: [] },
    image: { type: String, default: "" },
    url: { type: String, default: "" },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const VideoSchema = new Schema(
  {
    group: { type: String, enum: ["AI video", "Ad films", "Reels"], required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    driveId: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MessageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 200 },
    budget: { type: String, default: "", maxlength: 60 },
    message: { type: String, required: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

// `models.X ||` keeps hot reload from redefining the models.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProjectModel: Model<any> = models.Project || model("Project", ProjectSchema);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VideoModel: Model<any> = models.Video || model("Video", VideoSchema);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MessageModel: Model<any> = models.Message || model("Message", MessageSchema);
