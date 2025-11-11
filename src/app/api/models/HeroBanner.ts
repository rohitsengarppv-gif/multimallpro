import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  badge: {
    type: String,
    required: true,
    trim: true,
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
    default: "Shop Now",
  },
  buttonLink: {
    type: String,
    default: "/shop",
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
heroBannerSchema.index({ isActive: 1, order: 1 });
heroBannerSchema.index({ startDate: 1, endDate: 1 });

const HeroBanner = mongoose.models.HeroBanner || mongoose.model("HeroBanner", heroBannerSchema);

export default HeroBanner;
