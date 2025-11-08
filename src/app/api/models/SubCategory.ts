import mongoose, { Document, Schema } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: {
    public_id: string;
    url: string;
  };
  vendor?: mongoose.Types.ObjectId;
  vendorName?: string;
  role: "vendor" | "admin" | "master-admin";
  parentCategory: mongoose.Types.ObjectId;
  status: "active" | "inactive";
  level: number;
  sortOrder: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema: Schema<ISubCategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a subcategory name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
      minlength: [2, "Subcategory name must be at least 2 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please add a subcategory slug"],
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
      required: function (this: ISubCategory) {
        return !this.isDefault;
      },
    },
    vendorName: {
      type: String,
      required: function (this: ISubCategory) {
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
      required: [true, "Parent category is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    level: {
      type: Number,
      default: 2,
      min: 2,
      max: 3,
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

SubCategorySchema.index({ parentCategory: 1, status: 1 });
SubCategorySchema.index({ vendor: 1, status: 1 });
SubCategorySchema.index({ slug: 1 });
SubCategorySchema.index({ role: 1 });

SubCategorySchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    let slug = this.name
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (!this.isDefault && this.vendor) {
      slug = `${slug}-${this.vendor.toString().slice(-6)}`;
    }

    this.slug = slug;
  }

  next();
});

export default mongoose.models.SubCategory || mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
