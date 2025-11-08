import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: {
    public_id: string;
    url: string;
  };
  vendor?: mongoose.Types.ObjectId; // Reference to vendor who created it (optional for system categories)
  vendorName?: string; // Vendor's business name for display
  role: "vendor" | "admin" | "master-admin";
  parentCategory?: mongoose.Types.ObjectId;
  subcategories: mongoose.Types.ObjectId[];
  status: "active" | "inactive"; // Changed from isActive to status
  level: number;
  sortOrder: number;
  isDefault: boolean; // System default categories vs vendor created
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
      minlength: [2, "Category name must be at least 2 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please add a category slug"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    image: {
      public_id: String,
      url: String,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: function(this: ICategory) {
        // Only required for vendor-created categories, not system defaults
        return !this.isDefault;
      },
    },
    vendorName: {
      type: String,
      required: function(this: ICategory) {
        // Only required for vendor-created categories
        return !this.isDefault;
      },
      maxlength: [100, "Vendor name can not be more than 100 characters"],
    },
    role: {
      type: String,
      enum: ["vendor", "admin", "master-admin"],
      required: true,
      default: "vendor",
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategories: [{
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    }],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 3, // Maximum 3 levels deep
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better performance
CategorySchema.index({ vendor: 1, status: 1 });
CategorySchema.index({ role: 1, status: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ level: 1 });
CategorySchema.index({ slug: 1 });

// Pre-save middleware to generate slug
CategorySchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    // Create slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Add vendor identifier to slug for vendor-specific categories
    if (!this.isDefault && this.vendor) {
      this.slug = `${this.slug}-${this.vendor.toString().slice(-6)}`;
    }
  }
  next();
});

// Static method to get categories by vendor
CategorySchema.statics.getByVendor = function (vendorId: string, role: string = "vendor") {
  return this.find({
    $or: [
      { vendor: vendorId },
      { role: { $in: ["admin", "master-admin"] } },
      { isDefault: true }
    ],
    status: "active"
  }).sort({ sortOrder: 1, createdAt: -1 });
};

// Static method to get subcategories
CategorySchema.statics.getSubcategories = function (parentId: string) {
  return this.find({
    parentCategory: parentId,
    status: "active"
  }).sort({ sortOrder: 1, name: 1 });
};

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
