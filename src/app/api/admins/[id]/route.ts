import { NextRequest } from "next/server";
import { getAdminById, updateAdmin, deleteAdmin } from "@/app/api/controllers/adminController";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return getAdminById(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return updateAdmin(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return deleteAdmin(req, { params });
}
