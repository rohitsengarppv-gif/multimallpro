import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

export interface IVendor extends Document {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  // Business Information
  businessName: string;
  businessType: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  website?: string;
  businessDescription: string;

  // Product Information
  productCategories: string[];
  productTypes?: string;
  averageOrderValue?: string;
  monthlyVolume?: string;

  // Documents
  businessLicense?: {
    public_id: string;
    url: string;
  };
  taxId: string;
  bankAccount: string;

  // Status and Verification
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  emailVerificationToken?: string;

  // Agreement
  termsAccepted: boolean;
  marketingConsent: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const VendorSchema: Schema<IVendor> = new Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
      trim: true,
      maxlength: [50, "First name can not be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
      trim: true,
      maxlength: [50, "Last name can not be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },

    // Business Information
    businessName: {
      type: String,
      required: [true, "Please add a business name"],
      trim: true,
      maxlength: [100, "Business name can not be more than 100 characters"],
    },
    businessType: {
      type: String,
      required: [true, "Please select a business type"],
      enum: ["Sole Proprietorship", "Partnership", "Corporation", "LLC", "Non-profit", "Other"],
    },
    businessAddress: {
      type: String,
      required: [true, "Please add a business address"],
      maxlength: [200, "Business address can not be more than 200 characters"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
      maxlength: [50, "City can not be more than 50 characters"],
    },
    state: {
      type: String,
      required: [true, "Please add a state/province"],
      maxlength: [50, "State can not be more than 50 characters"],
    },
    zipCode: {
      type: String,
      maxlength: [10, "Zip code can not be more than 10 characters"],
    },
    country: {
      type: String,
      required: [true, "Please add a country"],
      default: "United States",
    },
    website: {
      type: String,
      validate: {
        validator: function(v: string) {
          // Only validate if a non-empty value is provided
          if (!v || v.trim() === '') return true;
          // Simple URL validation - just check for http/https and basic structure
          return /^https?:\/\/.+/.test(v);
        },
        message: "Please add a valid website URL starting with http:// or https://",
      },
    },
    businessDescription: {
      type: String,
      required: [true, "Please add a business description"],
      maxlength: [1000, "Business description can not be more than 1000 characters"],
    },

    // Product Information
    productCategories: {
      type: [String],
      required: [true, "Please select at least one product category"],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: "Please select at least one product category"
      }
    },
    productTypes: {
      type: String,
      maxlength: [500, "Product types description can not be more than 500 characters"],
    },
    averageOrderValue: {
      type: String,
      enum: ["under-50", "50-100", "100-250", "250-500", "over-500"],
    },
    monthlyVolume: {
      type: String,
      enum: ["1-10", "11-50", "51-100", "101-500", "over-500"],
    },

    // Documents
    businessLicense: {
      public_id: String,
      url: String,
    },
    taxId: {
      type: String,
      required: [true, "Please add a tax ID"],
      maxlength: [20, "Tax ID can not be more than 20 characters"],
    },
    bankAccount: {
      type: String,
      required: [true, "Please add bank account information"],
      maxlength: [4, "Bank account should be last 4 digits only"],
      minlength: [4, "Bank account should be last 4 digits only"],
    },

    // Status and Verification
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,

    // Agreement
    termsAccepted: {
      type: Boolean,
      required: [true, "Please accept the terms and conditions"],
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
VendorSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    next();
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
VendorSchema.methods.getSignedJwtToken = function (): string {
  const secret: string = config.JWT_SECRET || "fallback-secret-change-in-production";
  const expiresIn = config.JWT_EXPIRE || "7d";

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign({ id: this._id.toString(), role: "vendor" }, secret, options);
};

// Match user entered password to hashed password in database
VendorSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
VendorSchema.index({ email: 1 });
VendorSchema.index({ status: 1 });
VendorSchema.index({ businessName: 1 });

export default mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema);
