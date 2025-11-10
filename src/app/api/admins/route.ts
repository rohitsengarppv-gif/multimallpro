import { NextRequest } from "next/server";
import { getAdmins } from "@/app/api/controllers/adminController";

export async function GET(req: NextRequest) {
  return getAdmins(req);
}
