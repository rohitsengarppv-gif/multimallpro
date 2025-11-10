import { NextRequest } from "next/server";
import { approveAdmin } from "@/app/api/controllers/adminController";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return approveAdmin(req, { params });
}
