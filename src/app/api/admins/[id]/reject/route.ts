import { NextRequest } from "next/server";
import { rejectAdmin } from "@/app/api/controllers/adminController";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return rejectAdmin(req, { params });
}
