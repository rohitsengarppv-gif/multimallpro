import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

export interface IAdmin extends Document {
  // Personal Information
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  
  // Admin Information
  name?: string;
  department?: string;
  role: "admin" | "master_admin" | "master";
  permissions?: {
    canManageAdmins?: boolean;
    canManageVendors?: boolean;
    canManageProducts?: boolean;
    canManageOrders?: boolean;
    canManageUsers?: boolean;
    canManageSettings?: boolean;
    canViewAnalytics?: boolean;
    canManagePayments?: boolean;
  };
  
  // Status and Verification
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  emailVerificationToken?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, "First name can not be more than 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name can not be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    
    // Admin Information
    name: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      enum: [
        "Operations",
        "Customer Support",
        "Sales",
        "Marketing",
        "IT",
        "Finance",
        "HR",
        "Other"
      ],
    },
    role: {
      type: String,
      enum: ["admin", "master_admin", "master"],
      default: "admin",
    },
    permissions: {
      canManageAdmins: { type: Boolean, default: false },
      canManageVendors: { type: Boolean, default: false },
      canManageProducts: { type: Boolean, default: false },
      canManageOrders: { type: Boolean, default: false },
      canManageUsers: { type: Boolean, default: false },
      canManageSettings: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: false },
      canManagePayments: { type: Boolean, default: false },
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
    emailVerificationToken: {
      type: String,
    },
    
    // Timestamps
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
AdminSchema.methods.getSignedJwtToken = function (): string {
  const secret: string = config.JWT_SECRET || "fallback-secret-change-in-production";
  const expiresIn = config.JWT_EXPIRE || "30d";

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign({ id: this._id.toString(), role: this.role }, secret, options);
};

// Match admin entered password to hashed password in database
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> { 
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
