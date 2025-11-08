import { NextRequest } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/app/api/controllers/userController";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return getUserById(req, id);
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return updateUser(req, id);
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return deleteUser(req, id);
};
