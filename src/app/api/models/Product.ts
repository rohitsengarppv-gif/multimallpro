import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  mainImage?: {
    public_id: string;
    url: string;
  };
  images: {
    public_id: string;
    url: string;
  }[];
  longDescription: Array<{
    id: string;
    type: "text" | "feature" | "image";
    content?: string;
    url?: string;
  }>;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  tags: string[];
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    requiresShipping: boolean;
  };
  seo: {
    title?: string;
    description?: string;
    slug?: string;
  };
  status: "draft" | "pending" | "published";
  visibility: "public" | "private" | "hidden";
  isApproved?: boolean;
  youtubeLink?: string;
  specifications: Array<{
    id: string;
    key: string;
    value: string;
  }>;
  variations: {
    attributes: ("Size" | "Color" | "Material")[];
    options: Record<string, string[]>;
    variants: Array<{
      id: string;
      combination: Record<string, string>;
      price?: number;
      stock?: number;
    }>;
  };
  vendor: mongoose.Types.ObjectId;
  stock: number;
  minStock: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  reviews: mongoose.Types.ObjectId[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please add a product slug"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
    },
    shortDescription: {
      type: String,
      maxlength: [300, "Short description can not be more than 300 characters"],
    },
    mainImage: {
      public_id: String,
      url: String,
    },
    images: [{
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }],
    longDescription: [{
      id: String,
      type: {
        type: String,
        enum: ["text", "feature", "image"],
        required: true,
      },
      content: String,
      url: String,
    }],
    sku: {
      type: String,
      required: [true, "Please add a product SKU"],
      unique: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: [0, "Price must be positive"],
    },
    comparePrice: {
      type: Number,
      min: [0, "Compare price must be positive"],
    },
    costPrice: {
      type: Number,
      min: [0, "Cost price must be positive"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please add a category"],
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: String,
      maxlength: [100, "Brand name can not be more than 100 characters"],
    },
    tags: [String],
    inventory: {
      quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity must be positive"],
        default: 0,
      },
      lowStockThreshold: {
        type: Number,
        required: true,
        min: [0, "Low stock threshold must be positive"],
        default: 5,
      },
      trackQuantity: {
        type: Boolean,
        default: true,
      },
    },
    shipping: {
      weight: {
        type: Number,
        min: [0, "Weight must be positive"],
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      requiresShipping: {
        type: Boolean,
        default: true,
      },
    },
    seo: {
      title: {
        type: String,
        maxlength: [60, "SEO title can not be more than 60 characters"],
      },
      description: {
        type: String,
        maxlength: [160, "SEO description can not be more than 160 characters"],
      },
      slug: {
        type: String,
        lowercase: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    youtubeLink: {
      type: String,
    },
    specifications: [{
      id: String,
      key: String,
      value: String,
    }],
    variations: {
      attributes: [{
        type: String,
        enum: ["Size", "Color", "Material"],
      }],
      options: {
        Size: [String],
        Color: [String],
        Material: [String],
      },
      variants: [{
        id: String,
        combination: Schema.Types.Mixed,
        price: Number,
        stock: Number,
      }],
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Please add a vendor"],
    },
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock must be positive"],
      default: 0,
    },
    minStock: {
      type: Number,
      default: 5,
      min: [0, "Minimum stock must be positive"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDigital: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      min: [0, "Weight must be positive"],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
    rating: {
      type: Number,
      min: [0, "Rating must be between 0 and 5"],
      max: [5, "Rating must be between 0 and 5"],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug from name
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
  }
  next();
});

// Create indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ vendor: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ visibility: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ salesCount: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
