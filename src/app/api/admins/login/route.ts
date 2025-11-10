import { NextRequest } from "next/server";
import { loginAdmin } from "@/app/api/controllers/adminController";

export async function POST(req: NextRequest) {
  return loginAdmin(req);
}
