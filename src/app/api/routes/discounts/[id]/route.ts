import { getDiscount, updateDiscount, deleteDiscount } from "@/app/api/controllers/discountController";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (req: Request, { params }: RouteParams) => {
  const { id } = await params;
  return getDiscount(req as any, id);
};

export const PUT = async (req: Request, { params }: RouteParams) => {
  const { id } = await params;
  return updateDiscount(req as any, id);
};

export const DELETE = async (req: Request, { params }: RouteParams) => {
  const { id } = await params;
  return deleteDiscount(req as any, id);
};
