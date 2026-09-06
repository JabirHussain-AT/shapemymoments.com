import mongoose, { Schema, models, model } from "mongoose";

export interface INotification {
  _id: mongoose.Types.ObjectId;
  type:
    | "EVENT_REQUEST"
    | "PHOTOGRAPHER_REGISTRATION"
    | "PHOTOGRAPHER_LEAD"
    | "REVIEW_SUBMITTED"
    | "SUBSCRIPTION_CHANGE"
    | "CONTACT_MESSAGE"
    | "GENERAL";
  title: string;
  message: string;
  link?: string;
  userId?: mongoose.Types.ObjectId;
  role?: string;
  read: boolean;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: [
        "EVENT_REQUEST",
        "PHOTOGRAPHER_REGISTRATION",
        "PHOTOGRAPHER_LEAD",
        "REVIEW_SUBMITTED",
        "SUBSCRIPTION_CHANGE",
        "CONTACT_MESSAGE",
        "GENERAL",
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    role: { type: String, index: true },
    read: { type: Boolean, default: false, index: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification =
  models.Notification || model<INotification>("Notification", NotificationSchema);
