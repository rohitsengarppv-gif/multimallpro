import { NextRequest } from "next/server";
import { getOrderById, updateOrder, deleteOrder } from "@/app/api/controllers/orderController";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return getOrderById(req, id);
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return updateOrder(req, id);
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return deleteOrder(req, id);
};
