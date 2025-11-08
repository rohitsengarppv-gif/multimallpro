import mongoose, { Document, Schema } from "mongoose";

export interface IReview2 extends Document {
  product: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  user: {
    name: string;
    email: string;
    userId?: string;
  };
  rating: number;
  title: string;
  comment: string;
  images?: {
    public_id: string;
    url: string;
  }[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  helpfulBy: string[];
  status: "pending" | "approved" | "rejected";
  vendorReply?: {
    message: string;
    repliedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const Review2Schema: Schema<IReview2> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor is required"],
    },
    user: {
      name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "User email is required"],
        trim: true,
        lowercase: true,
      },
      userId: {
        type: String,
      },
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    vendorReply: {
      message: String,
      repliedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
Review2Schema.index({ product: 1, status: 1 });
Review2Schema.index({ vendor: 1, status: 1 });
Review2Schema.index({ "user.email": 1 });
Review2Schema.index({ createdAt: -1 });

export default mongoose.models.Review2 || mongoose.model<IReview2>("Review2", Review2Schema);
