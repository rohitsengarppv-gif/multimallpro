import { NextRequest } from "next/server";
import { setDefaultAddress } from "@/app/api/controllers/addressController";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return setDefaultAddress(req, id);
};
