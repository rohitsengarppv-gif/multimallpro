import mongoose, { Document, Schema } from "mongoose";

export interface IHomeSetting extends Document {
  name: string;
  tagline: string;
  logo?: {
    public_id: string;
    url: string;
  };
  favicon?: {
    public_id: string;
    url: string;
  };
  supportEmail: string;
  supportPhone: string;
  footerMessage: string;
  announcement: {
    enabled: boolean;
    message: string;
    link?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HomeSettingSchema: Schema<IHomeSetting> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Marketplace name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      trim: true,
      maxlength: [200, "Tagline cannot be more than 200 characters"],
    },
    logo: {
      public_id: String,
      url: String,
    },
    favicon: {
      public_id: String,
      url: String,
    },
    supportEmail: {
      type: String,
      required: [true, "Support email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    supportPhone: {
      type: String,
      required: [true, "Support phone is required"],
      trim: true,
    },
    footerMessage: {
      type: String,
      required: [true, "Footer message is required"],
      trim: true,
      maxlength: [500, "Footer message cannot be more than 500 characters"],
    },
    announcement: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        trim: true,
        maxlength: [300, "Announcement message cannot be more than 300 characters"],
      },
      link: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one document exists in the collection
HomeSettingSchema.index({}, { unique: true });

export default mongoose.models.HomeSetting || mongoose.model<IHomeSetting>("HomeSetting", HomeSettingSchema);
