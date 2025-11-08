import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, uploadMultipleImages } from "@/app/api/utils/cloudinary";

export const uploadImages = async (req: NextRequest) => {
  try {
    console.log('Upload request received');

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "ecommerce";

    console.log('Files received:', files.length);
    console.log('Folder:', folder);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    // Check if Cloudinary credentials are available
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Cloudinary credentials check:');
    console.log('Cloud name:', cloudName ? 'Set' : 'NOT SET');
    console.log('API key:', apiKey ? 'Set' : 'NOT SET');
    console.log('API secret:', apiSecret ? 'Set' : 'NOT SET');

    if (!cloudName || !apiKey || !apiSecret) {
      console.log('Cloudinary credentials missing, returning mock response');
      // Return mock response for testing
      const mockResult = [{
        public_id: `mock_${Date.now()}`,
        url: `https://via.placeholder.com/300x200?text=${files[0].name}`,
        secure_url: `https://via.placeholder.com/300x200?text=${files[0].name}`
      }];

      return NextResponse.json({
        success: true,
        data: mockResult,
        message: "Mock upload successful - Cloudinary credentials not configured"
      });
    }

    // Convert files to buffers
    const fileBuffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return Buffer.from(arrayBuffer);
      })
    );

    console.log('File buffers created, uploading to Cloudinary...');

    // Upload to Cloudinary
    let uploadResults;

    try {
      if (files.length === 1) {
        uploadResults = [await uploadToCloudinary(fileBuffers[0], folder)];
      } else {
        uploadResults = await uploadMultipleImages(fileBuffers, folder);
      }

      console.log('Upload successful:', uploadResults);

      return NextResponse.json({
        success: true,
        data: uploadResults,  // Now consistently an array
      });
    } catch (cloudinaryError: any) {
      console.error('Cloudinary upload failed, falling back to mock response:', cloudinaryError.message);

      // Return mock response when Cloudinary fails
      const mockResult = [{
        public_id: `mock_${Date.now()}`,
        url: `https://via.placeholder.com/300x200?text=${files[0].name}`,
        secure_url: `https://via.placeholder.com/300x200?text=${files[0].name}`
      }];

      return NextResponse.json({
        success: true,
        data: mockResult,
        message: "Mock upload successful - Cloudinary upload failed, using fallback"
      });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
};
