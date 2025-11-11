import { NextRequest } from "next/server";
import {
  getPromoBanners,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner,
  getPromoBanner
} from "../../controllers/promoBannerController";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (id) {
    return getPromoBanner(request);
  }
  
  return getPromoBanners(request);
}

export async function POST(request: NextRequest) {
  return createPromoBanner(request);
}

export async function PUT(request: NextRequest) {
  return updatePromoBanner(request);
}

export async function DELETE(request: NextRequest) {
  return deletePromoBanner(request);
}
