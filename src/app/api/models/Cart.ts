import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  brand: string;
  discount?: number;
  vendor?: mongoose.Types.ObjectId;
  variant?: {
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | undefined;
  };
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
  },
  variant: {
    type: Schema.Types.Mixed, // Allows any key-value pairs for flexible variant attributes
  },
});

const CartSchema: Schema<ICart> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
    },
    items: [CartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
CartSchema.index({ user: 1 });
CartSchema.index({ updatedAt: -1 });

// Pre-save middleware to calculate totals
CartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
