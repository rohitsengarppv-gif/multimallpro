import { NextRequest } from "next/server";
import { updateOrderStatus } from "@/app/api/controllers/orderController";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return updateOrderStatus(req, id);
};
