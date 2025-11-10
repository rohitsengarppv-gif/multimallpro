import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    productName: string;
    productImage: string;
    brand: string;
    vendor: mongoose.Types.ObjectId;
    vendorName?: string;
    variant?: Record<string, string>;
    quantity: number;
    price: number;
    originalPrice?: number;
    discount?: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: function() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        return `ORD-${timestamp}-${random}`;
      },
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a customer"],
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productImage: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      vendor: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
      },
      vendorName: String,
      variant: Schema.Types.Mixed,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive"],
      },
      originalPrice: Number,
      discount: Number,
      total: {
        type: Number,
        required: true,
        min: [0, "Total must be positive"],
      },
    }],
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal must be positive"],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax must be positive"],
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, "Shipping must be positive"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be positive"],
    },
    discountCode: String,
    total: {
      type: Number,
      required: true,
      min: [0, "Total must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: [true, "Please add a payment method"],
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Please add full name"],
      },
      phone: {
        type: String,
        required: [true, "Please add phone number"],
      },
      addressLine1: {
        type: String,
        required: [true, "Please add address line 1"],
      },
      addressLine2: String,
      city: {
        type: String,
        required: [true, "Please add city"],
      },
      state: {
        type: String,
        required: [true, "Please add state"],
      },
      zipCode: {
        type: String,
        required: [true, "Please add zip code"],
      },
      country: {
        type: String,
        required: [true, "Please add country"],
        default: "India",
      },
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    notes: {
      type: String,
      maxlength: [500, "Notes can not be more than 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate middleware to generate order number before validation
OrderSchema.pre("validate", function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Create indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "items.vendor": 1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
