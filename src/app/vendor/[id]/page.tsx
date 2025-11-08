"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductCard, { ProductCardData } from "../../../components/ProductCard";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Package,
  ShoppingBag,
  Loader2,
  Calendar,
  CheckCircle,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);

  // Fetch vendor data
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        // Use public vendor API endpoint
        const response = await fetch(`/api/vendors/${vendorId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setVendor(data.data);
          fetchVendorProducts();
        } else {
          setError("Vendor not found");
        }
      } catch (err) {
        console.error("Error fetching vendor:", err);
        setError("Failed to load vendor information");
      } finally {
        setLoading(false);
      }
    };

    const fetchVendorProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch(`/api/routes/products?vendor=${vendorId}&active=true&limit=12`);
        const data = await response.json();

        if (data.success && data.data.products) {
          const transformedProducts: ProductCardData[] = data.data.products.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.comparePrice || undefined,
            rating: product.rating || 4.0,
            reviews: product.reviewCount || 0,
            image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image",
            category: product.category?.name || "Uncategorized",
            brand: vendor?.businessName || "Store",
            inStock: product.stock > 0,
            discount: product.comparePrice
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : undefined,
          }));

          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Vendor not found"}</h1>
          <Link href="/shop" className="text-rose-600 hover:text-rose-700">
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Vendor Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Vendor Avatar */}
            <div className="flex-shrink-0">
              {vendor.avatar?.url ? (
                <img
                  src={vendor.avatar.url}
                  alt={vendor.businessName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-rose-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-rose-100 flex items-center justify-center border-4 border-rose-200">
                  <Store className="h-16 w-16 text-rose-600" />
                </div>
              )}
            </div>

            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.businessName}</h1>
                  <p className="text-gray-600 mb-2">{vendor.businessType || "Business"}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {vendor.status === "approved" && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Verified Seller
                      </span>
                    )}
                    {vendor.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member since{" "}
                        {new Date(vendor.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {(vendor.bio || vendor.businessDescription) && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {vendor.bio || vendor.businessDescription}
                </p>
              )}

              {/* Categories */}
              {vendor.productCategories && vendor.productCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {vendor.productCategories.map((category: string, index: number) => (
                    <span
                      key={index}
                      className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Package className="h-6 w-6 text-rose-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Star className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">4.5</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <ShoppingBag className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">-</p>
                  <p className="text-sm text-gray-600">Sales</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {vendor.status === "approved" ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {vendor.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-rose-600" />
                  <a href={`mailto:${vendor.email}`} className="text-gray-600 hover:text-rose-600">
                    {vendor.email}
                  </a>
                </div>
              )}

              {vendor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-rose-600" />
                  <a href={`tel:${vendor.phone}`} className="text-gray-600 hover:text-rose-600">
                    {vendor.phone}
                  </a>
                </div>
              )}

              {vendor.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-rose-600" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-rose-600"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>

            <div>
              {(vendor.businessAddress || vendor.city || vendor.state) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-600">
                    {vendor.businessAddress && <p>{vendor.businessAddress}</p>}
                    <p>
                      {vendor.city && `${vendor.city}, `}
                      {vendor.state && `${vendor.state} `}
                      {vendor.zipCode && vendor.zipCode}
                    </p>
                    {vendor.country && <p>{vendor.country}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products by {vendor.businessName}</h2>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products available at the moment</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
