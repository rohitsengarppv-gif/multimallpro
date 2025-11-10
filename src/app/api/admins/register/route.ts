import { NextRequest } from "next/server";
import { registerAdmin } from "@/app/api/controllers/adminController";

export async function POST(req: NextRequest) {
  return registerAdmin(req);
}
