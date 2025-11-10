import { NextRequest } from "next/server";
import { getAddressById, updateAddress, deleteAddress } from "@/app/api/controllers/addressController";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return getAddressById(req, id);
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return updateAddress(req, id);
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return deleteAddress(req, id);
};
