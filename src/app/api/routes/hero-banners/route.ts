import { NextRequest } from "next/server";
import {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getHeroBanner
} from "../../controllers/heroBannerController";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (id) {
    return getHeroBanner(request);
  }
  
  return getHeroBanners(request);
}

export async function POST(request: NextRequest) {
  return createHeroBanner(request);
}

export async function PUT(request: NextRequest) {
  return updateHeroBanner(request);
}

export async function DELETE(request: NextRequest) {
  return deleteHeroBanner(request);
}
