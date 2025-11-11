import mongoose from "mongoose";

const promoBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    trim: true,
  },
  badge: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // emoji or icon name
      default: "✨",
    },
    color: {
      type: String,
      default: "rose", // tailwind color name
    },
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  buttonText: {
    type: String,
    default: "Shop now",
  },
  buttonLink: {
    type: String,
    default: "/shop",
  },
  position: {
    type: String,
    enum: ["top", "bottom"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
promoBannerSchema.index({ isActive: 1, position: 1, order: 1 });
promoBannerSchema.index({ startDate: 1, endDate: 1 });

const PromoBanner = mongoose.models.PromoBanner || mongoose.model("PromoBanner", promoBannerSchema);

export default PromoBanner;
