import { getProduct, updateProduct, deleteProduct } from "@/app/api/controllers/productController";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (req: Request, { params }: RouteParams) => {
  const { id } = await params;
  return getProduct(req as any, id);
};

export const PUT = async (req: Request, { params }: RouteParams) => {
  const { id } = await params;
  return updateProduct(req as any, id);
};

export const DELETE = async (req: Request, { params }: RouteParams) => {
  const { id } = await params;
  return deleteProduct(req as any, id);
};
