import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/api/models/Product";
import Category from "@/app/api/models/Category";
import SubCategory from "@/app/api/models/SubCategory";
import Vendor from "@/app/api/models/Vendor";
import connectDB from "@/app/api/config/mongoose";

export const getProducts = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const vendor = searchParams.get("vendor");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";
    const featured = searchParams.get("featured") === "true";
    const active = searchParams.get("active");

    // Build query
    let query: any = {};
    
    // Only filter by isActive if explicitly set to true or false
    if (active === "true") {
      query.isActive = true;
    } else if (active !== "false") {
      // Default behavior: show only active products for public
      query.isActive = true;
    }
    // If active === "false", don't filter by isActive (show all)

    if (category) {
      query.category = category;
    }

    if (vendor) {
      query.vendor = vendor;
    }

    if (featured) {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Execute query
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate({ path: "category", select: "name slug", model: Category })
      .populate({ path: "vendor", select: "businessName", model: Vendor })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const createProduct = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      category,
      subcategory,
      brand,
      tags,
      mainImage,
      images,
      longDescription,
      specifications,
      variations,
      attributes,
      variants,
      youtubeLink,
      seo,
      inventory,
      shipping,
      status,
      visibility,
      vendor,
      stock,
      minStock,
      isFeatured,
      isDigital,
      weight,
      dimensions,
      seoTitle,
      seoDescription,
    } = body;

    // Basic validation
    if (!name || !description || !sku || !price || !category || !vendor) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      category,
      subcategory,
      brand,
      tags: tags || [],
      mainImage: mainImage ? { public_id: mainImage, url: mainImage } : undefined,
      images: (images || []).map((img: string) => ({ public_id: img, url: img })),
      longDescription: longDescription || [],
      specifications: specifications || [],
      variations: variations || { 
        attributes: attributes || [], 
        options: {}, 
        variants: variants || [] 
      },
      youtubeLink,
      seo: seo || { title: seoTitle, description: seoDescription, slug },
      inventory: inventory || { quantity: stock || 0, lowStockThreshold: minStock || 5, trackQuantity: true },
      shipping: shipping || { requiresShipping: true },
      status: status || 'draft',
      visibility: visibility || 'public',
      isApproved: true, // Vendors can publish directly without admin approval
      vendor,
      stock: stock || 0,
      minStock: minStock || 5,
      isFeatured: isFeatured || false,
      isDigital: isDigital || false,
      weight,
      dimensions,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const getProduct = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const product = await Product.findById(id)
      .populate({ path: "category", select: "name slug", model: Category })
      .populate({ path: "subcategory", select: "name slug", model: SubCategory })
      .populate({ 
        path: "vendor", 
        select: "-password", // Exclude only password, include all other fields
        model: Vendor 
      });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const updateProduct = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      category,
      subcategory,
      brand,
      tags,
      mainImage,
      images,
      longDescription,
      specifications,
      variations,
      attributes,
      variants,
      youtubeLink,
      seo,
      inventory,
      shipping,
      status,
      visibility,
      stock,
      minStock,
      isActive,
      isFeatured,
      isDigital,
      weight,
      dimensions,
      seoTitle,
      seoDescription,
    } = body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if SKU is being changed and if it conflicts
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ sku, _id: { $ne: id } });
      if (skuExists) {
        return NextResponse.json(
          { success: false, message: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Build update object with all fields
    const updateData: any = {
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      category,
      subcategory,
      brand,
      tags: tags || [],
      mainImage: mainImage ? { public_id: mainImage, url: mainImage } : undefined,
      images: (images || []).map((img: string) => ({ public_id: img, url: img })),
      longDescription: longDescription || [],
      specifications: specifications || [],
      variations: variations || { 
        attributes: attributes || [], 
        options: {}, 
        variants: variants || [] 
      },
      youtubeLink,
      seo: seo || { title: seoTitle, description: seoDescription, slug },
      inventory: inventory || { quantity: stock || 0, lowStockThreshold: minStock || 5, trackQuantity: true },
      shipping: shipping || { requiresShipping: true },
      status: status || 'draft',
      visibility: visibility || 'public',
      stock: stock || 0,
      minStock: minStock || 5,
      isFeatured: isFeatured || false,
      isDigital: isDigital || false,
      weight,
      dimensions,
    };

    // Only update isActive if it's explicitly provided
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const deleteProduct = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
