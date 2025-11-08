import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: {
    public_id: string;
    url: string;
  }[];
  isVerified: boolean;
  isApproved: boolean;
  helpful: number;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please add a product"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a user"],
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    title: {
      type: String,
      required: [true, "Please add a review title"],
      trim: true,
      maxlength: [100, "Title can not be more than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please add a review comment"],
      maxlength: [1000, "Comment can not be more than 1000 characters"],
    },
    images: [{
      public_id: String,
      url: String,
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    reported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from same user on same product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Create indexes
ReviewSchema.index({ product: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
