import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = async (
  file: Buffer | string,
  folder: string = "ecommerce"
): Promise<UploadApiResponse> => {
  try {
    console.log('Cloudinary config check:');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'NOT SET');
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'NOT SET');
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'NOT SET');

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.log('Missing Cloudinary credentials');
      throw new Error('Cloudinary credentials not configured');
    }

    console.log('Attempting Cloudinary upload...');
    console.log('File type:', file instanceof Buffer ? 'Buffer' : 'string');
    console.log('File size:', file instanceof Buffer ? file.length : 'string');
    console.log('Folder:', folder);

    let result: UploadApiResponse;

    if (file instanceof Buffer) {
      // For Buffer uploads, use upload_stream
      console.log('Using upload_stream for Buffer upload...');
      result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
          folder,
          resource_type: "auto",
          quality: "auto",
          fetch_format: "auto",
          // Try to use preset if available, otherwise omit it
          ...(process.env.CLOUDINARY_UPLOAD_PRESET && { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }),
        }, (error, result) => {
          if (error) {
            console.error('Upload stream error:', error);
            reject(error);
          } else {
            console.log('Upload stream successful');
            resolve(result as UploadApiResponse);
          }
        });

        // Write buffer to stream
        uploadStream.end(file);
        console.log('Buffer written to upload stream');
      });
    } else {
      // For string paths or URLs - file should be a string here
      result = await cloudinary.uploader.upload(file as string, {
        folder,
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
        // Try to use preset if available, otherwise omit it
        ...(process.env.CLOUDINARY_UPLOAD_PRESET && { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }),
      });
    }

    console.log('Cloudinary upload successful');
    return result;
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    console.error("Error details:", {
      message: error.message,
      http_code: error.http_code,
      name: error.name
    });
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error("Cloudinary delete failed");
  }
};

export const uploadMultipleImages = async (
  files: (Buffer | string)[],
  folder: string = "ecommerce"
): Promise<UploadApiResponse[]> => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error("Multiple image upload failed");
  }
};
