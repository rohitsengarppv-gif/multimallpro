import { getMe, updateMe } from "@/app/api/controllers/userController";
import { NextRequest } from "next/server";

export const GET = (req: NextRequest) => getMe(req);
export const PATCH = (req: NextRequest) => updateMe(req);
