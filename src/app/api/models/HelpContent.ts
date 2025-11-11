import mongoose, { Document, Schema } from "mongoose";

export interface IHelpContent extends Document {
  type: "faq" | "quickLink" | "contact" | "category";
  
  // For FAQs
  question?: string;
  answer?: string;
  category?: string;
  
  // For Quick Links
  title?: string;
  description?: string;
  link?: string;
  icon?: string;
  
  // For Contact Options
  method?: string;
  contact?: string;
  available?: string;
  
  // For Categories
  categoryId?: string;
  categoryName?: string;
  
  // Common fields
  status: "active" | "inactive";
  sortOrder: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HelpContentSchema: Schema<IHelpContent> = new Schema(
  {
    type: {
      type: String,
      enum: ["faq", "quickLink", "contact", "category"],
      required: [true, "Please specify content type"],
    },
    
    // FAQ fields
    question: {
      type: String,
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    
    // Quick Link fields
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    
    // Contact fields
    method: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    available: {
      type: String,
      trim: true,
    },
    
    // Category fields
    categoryId: {
      type: String,
      trim: true,
    },
    categoryName: {
      type: String,
      trim: true,
    },
    
    // Common fields
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
HelpContentSchema.index({ type: 1, status: 1 });
HelpContentSchema.index({ category: 1 });
HelpContentSchema.index({ sortOrder: 1 });

export default mongoose.models.HelpContent || mongoose.model<IHelpContent>("HelpContent", HelpContentSchema);
