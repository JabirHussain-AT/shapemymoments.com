import mongoose, { Schema, models, model } from "mongoose";
import type { Role } from "@/types";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: Role;
  avatar?: string;
  shortlist: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: [
        "CUSTOMER",
        "PHOTOGRAPHER",
        "ADMIN",
        "EVENT_MANAGER",
        "STAFF",
        "SUPER_ADMIN",
      ],
      default: "CUSTOMER",
      index: true,
    },
    avatar: String,
    shortlist: [{ type: Schema.Types.ObjectId, ref: "Photographer" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
