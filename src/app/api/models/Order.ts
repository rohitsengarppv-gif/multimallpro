import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    variant?: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  vendor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
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
      variant: String,
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
      name: {
        type: String,
        required: [true, "Please add shipping name"],
      },
      email: {
        type: String,
        required: [true, "Please add shipping email"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      phone: {
        type: String,
        required: [true, "Please add shipping phone"],
      },
      street: {
        type: String,
        required: [true, "Please add shipping street"],
      },
      city: {
        type: String,
        required: [true, "Please add shipping city"],
      },
      state: {
        type: String,
        required: [true, "Please add shipping state"],
      },
      zipCode: {
        type: String,
        required: [true, "Please add shipping zip code"],
      },
      country: {
        type: String,
        required: [true, "Please add shipping country"],
      },
    },
    billingAddress: {
      name: {
        type: String,
        required: [true, "Please add billing name"],
      },
      email: {
        type: String,
        required: [true, "Please add billing email"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      phone: {
        type: String,
        required: [true, "Please add billing phone"],
      },
      street: {
        type: String,
        required: [true, "Please add billing street"],
      },
      city: {
        type: String,
        required: [true, "Please add billing city"],
      },
      state: {
        type: String,
        required: [true, "Please add billing state"],
      },
      zipCode: {
        type: String,
        required: [true, "Please add billing zip code"],
      },
      country: {
        type: String,
        required: [true, "Please add billing country"],
      },
    },
    trackingNumber: String,
    notes: {
      type: String,
      maxlength: [500, "Notes can not be more than 500 characters"],
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

// Pre-save middleware to generate order number
OrderSchema.pre("save", function (next) {
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
OrderSchema.index({ vendor: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
