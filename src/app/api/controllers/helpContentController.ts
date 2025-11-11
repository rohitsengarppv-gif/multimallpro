import { NextRequest, NextResponse } from "next/server";
import HelpContent from "@/app/api/models/HelpContent";
import connectDB from "@/app/api/config/mongoose";

// Get all help content
export const getHelpContent = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const helpContent = await HelpContent.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return NextResponse.json({
      success: true,
      data: helpContent,
    });
  } catch (error: any) {
    console.error("Get help content error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Create help content
export const createHelpContent = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    
    // Validate required fields based on type
    if (body.type === "faq" && (!body.question || !body.answer)) {
      return NextResponse.json(
        { success: false, message: "Question and answer are required for FAQ" },
        { status: 400 }
      );
    }

    if (body.type === "quickLink" && (!body.title || !body.description)) {
      return NextResponse.json(
        { success: false, message: "Title and description are required for Quick Link" },
        { status: 400 }
      );
    }

    if (body.type === "contact" && (!body.method || !body.contact)) {
      return NextResponse.json(
        { success: false, message: "Method and contact are required for Contact" },
        { status: 400 }
      );
    }

    if (body.type === "category" && (!body.categoryId || !body.categoryName)) {
      return NextResponse.json(
        { success: false, message: "Category ID and name are required for Category" },
        { status: 400 }
      );
    }

    const helpContent = await HelpContent.create(body);

    return NextResponse.json({
      success: true,
      data: helpContent,
      message: "Help content created successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create help content error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Update help content
export const updateHelpContent = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const helpContent = await HelpContent.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!helpContent) {
      return NextResponse.json(
        { success: false, message: "Help content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: helpContent,
      message: "Help content updated successfully",
    });
  } catch (error: any) {
    console.error("Update help content error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Delete help content
export const deleteHelpContent = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();

    const { id } = await params;

    const helpContent = await HelpContent.findByIdAndDelete(id);

    if (!helpContent) {
      return NextResponse.json(
        { success: false, message: "Help content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Help content deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete help content error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Get single help content by ID
export const getHelpContentById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();

    const { id } = await params;

    const helpContent = await HelpContent.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!helpContent) {
      return NextResponse.json(
        { success: false, message: "Help content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: helpContent,
    });
  } catch (error: any) {
    console.error("Get help content by ID error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
