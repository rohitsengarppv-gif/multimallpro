import mongoose, { Document, Schema } from "mongoose";

export interface IDiscount extends Document {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "draft" | "paused" | "pending";
  isActive: boolean;
  applicableProducts: mongoose.Types.ObjectId[];
  applicableCategories: mongoose.Types.ObjectId[];
  applicableVendors: mongoose.Types.ObjectId[];
  firstTimeCustomersOnly: boolean;
  image?: {
    public_id: string;
    url: string;
  };
  vendor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema: Schema<IDiscount> = new Schema(
  {
    code: {
      type: String,
      required: [true, "Please add a discount code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please add a discount name"],
      trim: true,
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "shipping"],
      required: [true, "Please add a discount type"],
    },
    value: {
      type: Number,
      required: [true, "Please add a discount value"],
      min: [0, "Value must be positive"],
    },
    minOrderAmount: {
      type: Number,
      min: [0, "Minimum order amount must be positive"],
    },
    maxDiscount: {
      type: Number,
      min: [0, "Maximum discount must be positive"],
    },
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, "Usage count must be positive"],
    },
    startDate: {
      type: Date,
      required: [true, "Please add a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please add an end date"],
    },
    status: {
      type: String,
      enum: ["active", "expired", "draft", "paused", "pending"],
      default: "draft",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableProducts: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }],
    applicableCategories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    applicableVendors: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    firstTimeCustomersOnly: {
      type: Boolean,
      default: false,
    },
    image: {
      public_id: String,
      url: String,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a vendor"],
    },
  },
  {
    timestamps: true,
  }
);

// Validation to ensure endDate is after startDate
DiscountSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

// Create indexes
DiscountSchema.index({ code: 1 });
DiscountSchema.index({ vendor: 1 });
DiscountSchema.index({ isActive: 1 });
DiscountSchema.index({ startDate: 1, endDate: 1 });
DiscountSchema.index({ type: 1 });

export default mongoose.models.Discount || mongoose.model<IDiscount>("Discount", DiscountSchema);
