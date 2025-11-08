import { useState, useEffect } from "react";
import type React from "react";
import { ArrowLeft, Upload, X, Plus, Trash2, Save, MoveUp, MoveDown, Image as ImageIcon, Type } from "lucide-react";

// Interfaces
interface ProductFormPageProps {
  productId?: string;
  onBack?: () => void;
}

interface ProductImage {
  id: number;
  url: string;
  file: File;
}

type LongDescBlock =
  | { id: number; type: "text"; content: string }
  | { id: number; type: "feature"; content: string }
  | { id: number; type: "image"; url: string; file?: File };

interface Specification {
  id: number;
  key: string;
  value: string;
}

type AttributeKey = "Size" | "Color" | "Material";

interface VariationsState {
  attributes: AttributeKey[];
  options: Record<AttributeKey, string[]>;
  variants: Array<{
    id: number;
    combination: Record<AttributeKey, string>;
    price?: string;
    stock?: string;
  }>;
}

interface FormData {
  name: string;
  shortDescription: string;
  longDescription: LongDescBlock[];
  price: string;
  comparePrice: string;
  sku: string;
  categories: string[];
  subCategory: string;
  brand: string;
  tags: string[];
  inventory: {
    quantity: string;
    lowStockThreshold: string;
    trackQuantity: boolean;
  };
  shipping: {
    weight: string;
    dimensions: { length: string; width: string; height: string };
    requiresShipping: boolean;
  };
  seo: {
    title: string;
    description: string;
    slug: string;
  };
  status: string;
  visibility: string;
  youtubeLink?: string;
  specifications: Specification[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    public_id: string;
    url: string;
  };
  parentCategory?: string;
  level: number;
  status: "active" | "inactive";
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory: string;
  level: number;
  status: "active" | "inactive";
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductFormPage({ productId, onBack }: ProductFormPageProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    shortDescription: "",
    longDescription: [],
    price: "",
    comparePrice: "",
    sku: "",
    categories: [],
    subCategory: "",
    brand: "",
    tags: [],
    inventory: {
      quantity: "",
      lowStockThreshold: "",
      trackQuantity: true,
    },
    shipping: {
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      requiresShipping: true,
    },
    seo: {
      title: "",
      description: "",
      slug: "",
    },
    status: "draft",
    visibility: "public",
    youtubeLink: "",
    specifications: [],
  });

  // Media state
  const [mainImage, setMainImage] = useState<ProductImage | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [longBlocks, setLongBlocks] = useState<LongDescBlock[]>([]);
  const [specs, setSpecs] = useState<Specification[]>([]);
  const [variations, setVariations] = useState<VariationsState>({
    attributes: [],
    options: { Size: [], Color: [], Material: [] },
    variants: [],
  });
  const [variationInputs, setVariationInputs] = useState<Record<AttributeKey, string>>({
    Size: '',
    Color: '',
    Material: ''
  });
  const [newTag, setNewTag] = useState("");

  const [aiOpen, setAiOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [aiDesc, setAiDesc] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Categories and subcategories
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  // Get vendor data from localStorage
  const vendorData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vendorData') || '{}') : {};

  // Load existing product data when editing
  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        try {
          console.log('Loading product with ID:', productId);
          setLoadingProduct(true);
          setSubmitError(null);
          
          const response = await fetch(`/api/routes/products/${productId}`);
          console.log('Response status:', response.status);
          
          const result = await response.json();
          console.log('API Result:', result);

          if (result.success && result.data) {
            const product = result.data;
            console.log('Product data loaded:', product);
            
            // Update form data
            setFormData({
              name: product.name || '',
              shortDescription: product.shortDescription || '',
              brand: product.brand || '',
              categories: product.category ? [product.category._id || product.category] : [],
              subCategory: product.subcategory?._id || product.subcategory || '',
              sku: product.sku || '',
              price: product.price?.toString() || '',
              comparePrice: product.comparePrice?.toString() || '',
              tags: product.tags || [],
              seo: {
                title: product.seo?.title || '',
                description: product.seo?.description || '',
                slug: product.seo?.slug || product.slug || '',
              },
              inventory: {
                quantity: product.inventory?.quantity?.toString() || product.stock?.toString() || '0',
                lowStockThreshold: product.inventory?.lowStockThreshold?.toString() || product.minStock?.toString() || '5',
                trackQuantity: product.inventory?.trackQuantity ?? true,
              },
              shipping: {
                weight: product.shipping?.weight?.toString() || product.weight?.toString() || '',
                dimensions: product.shipping?.dimensions || product.dimensions || { length: '', width: '', height: '' },
                requiresShipping: product.shipping?.requiresShipping ?? true,
              },
              status: product.status || 'draft',
              visibility: product.visibility || 'public',
              youtubeLink: product.youtubeLink || '',
              longDescription: [],
              specifications: [],
            });

            // Load main image
            if (product.mainImage?.url) {
              setMainImage({ id: Date.now(), url: product.mainImage.url, file: null as any });
            }

            // Load gallery images
            if (product.images && Array.isArray(product.images)) {
              setImages(product.images.map((img: any, idx: number) => ({
                id: Date.now() + idx,
                url: img.url || img,
                file: null as any
              })));
            }

            // Load long description
            if (product.longDescription && Array.isArray(product.longDescription)) {
              setLongBlocks(product.longDescription);
            }

            // Load specifications
            if (product.specifications && Array.isArray(product.specifications)) {
              setSpecs(product.specifications);
            }

            // Load variations
            if (product.variations) {
              setVariations(product.variations);
              // Update variation inputs
              if (product.variations.options) {
                const inputs: Record<AttributeKey, string> = {
                  Size: product.variations.options.Size?.join(', ') || '',
                  Color: product.variations.options.Color?.join(', ') || '',
                  Material: product.variations.options.Material?.join(', ') || '',
                };
                setVariationInputs(inputs);
              }
            }
            console.log('Form data updated successfully');
          } else {
            console.error('Failed to load product:', result.message);
            setSubmitError(result.message || 'Failed to load product data');
          }
        } catch (error) {
          console.error('Error loading product:', error);
          setSubmitError('Failed to load product data. Please try again.');
        } finally {
          setLoadingProduct(false);
        }
      };

      loadProduct();
    }
  }, [productId]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const params = new URLSearchParams({
          vendorId: vendorData._id || '',
          role: vendorData.role || 'vendor',
          status: 'active',
        });

        const response = await fetch(`/api/categories?${params}`);
        const data = await response.json();

        // Controller returns { success, data: Category[] }
        const rawCategories = Array.isArray(data?.data) ? data.data : [];

        // Consider parent categories as level===1 OR no parentCategory field
        const parentCategories = (rawCategories as Category[]).filter(
          (cat: Category) => (cat && (cat.level === 1 || !cat.parentCategory))
        );
        setCategories(parentCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [vendorData._id, vendorData.role]);

  // Fetch subcategories when parent category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!formData.categories.length) {
        setSubCategories([]);
        return;
      }

      try {
        setSubCategoriesLoading(true);
        // Get subcategories for all selected parent categories
        const promises = formData.categories.map(async (parentId) => {
          const params = new URLSearchParams({
            parentId,
            vendorId: vendorData._id || '',
            role: vendorData.role || 'vendor',
            status: 'active',
          });

          const response = await fetch(`/api/subcategories?${params}`);
          const data = await response.json();
          // Controller returns { success, data: SubCategory[] }
          const arr = Array.isArray(data?.data) ? data.data : [];
          return arr;
        });

        const results = await Promise.all(promises);
        const allSubCategories = results.flat();
        setSubCategories(allSubCategories);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubCategories([]);
      } finally {
        setSubCategoriesLoading(false);
      }
    };

    fetchSubCategories();
  }, [formData.categories, vendorData._id, vendorData.role]);

  // Handlers
  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, ...rest] = field.split('.');
      setFormData(prev => {
        const next: any = { ...prev };
        const parts = [parent, ...rest];
        let cursor = next;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = parts[i];
          cursor[key] = { ...(cursor[key] || {}) };
          cursor = cursor[key];
        }
        cursor[parts[parts.length - 1]] = value;
        return next as FormData;
      });
    } else {
      setFormData(prev => {
        const updated = { ...prev, [field]: value } as FormData;
        if (field === 'name' && value) {
          const slug = String(value)
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
          updated.seo.slug = slug;
        }
        return updated;
      });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(categoryId);
      const categories = exists
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId];
      // reset subCategory if it no longer belongs to selected parents
      const validSub = categories.length
        ? subCategories.find(sc => sc.parentCategory === categories[0])
        : undefined;
      return { ...prev, categories, subCategory: validSub ? prev.subCategory : "" };
    });
  };

  const addTag = () => {
    const tag = String(newTag || '').trim();
    if (!tag) return;
    setFormData(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag] }));
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setImages(prev => ([...prev, { id: Date.now() + Math.random(), url: result, file }]));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setMainImage({ id: Date.now() + Math.random(), url: result, file });
      }
    };
    reader.readAsDataURL(file);
  };

  const addSpec = () => setSpecs(prev => [...prev, { id: Date.now(), key: "", value: "" }]);
  const updateSpec = (id: number, field: 'key' | 'value', value: string) => {
    setSpecs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const removeSpec = (id: number) => setSpecs(prev => prev.filter(s => s.id !== id));

  const addLongBlock = (type: 'text' | 'feature' | 'image') => {
    if (type === 'image') {
      setLongBlocks(prev => [...prev, { id: Date.now(), type: 'image', url: '' }]);
    } else {
      setLongBlocks(prev => [...prev, { id: Date.now(), type, content: '' } as any]);
    }
  };
  const updateLongBlock = (id: number, payload: Partial<LongDescBlock>) => {
    setLongBlocks(prev => prev.map(b => b.id === id ? { ...(b as any), ...(payload as any) } : b));
  };
  const removeLongBlock = (id: number) => setLongBlocks(prev => prev.filter(b => b.id !== id));
  const moveLongBlock = (id: number, direction: 'up' | 'down') => {
    setLongBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const arr = [...prev];
      const [item] = arr.splice(idx, 1);
      arr.splice(target, 0, item);
      return arr;
    });
  };
  const handleLongImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        updateLongBlock(id, { type: 'image', url: result } as any);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateVariants = () => {
    const attrs = variations.attributes;
    const pools = attrs.map(a => variations.options[a] || []);
    if (pools.length === 0 || pools.some(p => p.length === 0)) {
      setVariations(prev => ({ ...prev, variants: [] }));
      return;
    }
    const cartesian = (sets: string[][]): string[][] => sets.reduce<string[][]>((acc, curr) => {
      if (acc.length === 0) return curr.map(v => [v]);
      const out: string[][] = [];
      acc.forEach(a => curr.forEach(v => out.push([...a, v])));
      return out;
    }, []);
    const combos = cartesian(pools);
    const variants = combos.map((combo, idx) => {
      const combination = {} as Record<AttributeKey, string>;
      attrs.forEach((attr, i) => { (combination as any)[attr] = combo[i]; });
      return { id: Date.now() + idx, combination };
    });
    setVariations(prev => ({ ...prev, variants }));
  };

  const removeImage = (imageId: number) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const uploadToCloudinary = async (file: File): Promise<{ public_id: string; url: string }> => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('folder', 'products');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to upload image');
    }

    return result.data[0]; // Return first uploaded image
  };

  const handleSubmit = async (status: 'draft' | 'pending' | 'published') => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      if (!formData.name || !formData.shortDescription || !formData.sku || !formData.price || !formData.categories.length) {
        setSubmitError('Please fill in all required fields: Name, Description, SKU, Price, and Category');
        setSubmitting(false);
        return;
      }

      if (!vendorData._id) {
        setSubmitError('Vendor information is missing. Please log in again.');
        setSubmitting(false);
        return;
      }

      const generateSlug = (text: string) => {
        return text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      };

      const slug = formData.seo.slug || generateSlug(formData.name);

      // Upload images to Cloudinary
      let mainImageUrl = mainImage?.url;
      let mainImagePublicId = '';
      
      if (mainImage?.file) {
        try {
          const uploaded = await uploadToCloudinary(mainImage.file);
          mainImageUrl = uploaded.url;
          mainImagePublicId = uploaded.public_id;
        } catch (error) {
          console.error('Failed to upload main image:', error);
          // Continue with base64 if upload fails
        }
      }

      const galleryImageUrls: string[] = [];
      const galleryImagePublicIds: string[] = [];

      for (const img of images) {
        if (img.file) {
          try {
            const uploaded = await uploadToCloudinary(img.file);
            galleryImageUrls.push(uploaded.url);
            galleryImagePublicIds.push(uploaded.public_id);
          } catch (error) {
            console.error('Failed to upload gallery image:', error);
            // Use base64 as fallback
            galleryImageUrls.push(img.url);
            galleryImagePublicIds.push('');
          }
        } else {
          galleryImageUrls.push(img.url);
          galleryImagePublicIds.push('');
        }
      }

      const productData = {
        name: formData.name,
        slug: slug,
        description: formData.shortDescription,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        price: formData.price,
        comparePrice: formData.comparePrice,
        category: formData.categories[0] || '',
        subcategory: formData.subCategory,
        brand: formData.brand,
        tags: formData.tags,
        mainImage: mainImageUrl,
        mainImagePublicId: mainImagePublicId,
        images: galleryImageUrls,
        imagePublicIds: galleryImagePublicIds,
        longDescription: longBlocks,
        specifications: specs,
        variations: variations,
        attributes: variations.attributes,
        variants: variations.variants,
        youtubeLink: formData.youtubeLink,
        seo: {
          title: formData.seo.title?.substring(0, 60) || '',
          description: formData.seo.description?.substring(0, 160) || '',
          slug: slug,
        },
        inventory: {
          quantity: parseInt(formData.inventory.quantity) || 0,
          lowStockThreshold: parseInt(formData.inventory.lowStockThreshold) || 5,
          trackQuantity: formData.inventory.trackQuantity,
        },
        shipping: {
          weight: parseFloat(formData.shipping.weight) || undefined,
          dimensions: formData.shipping.dimensions,
          requiresShipping: formData.shipping.requiresShipping,
        },
        status,
        visibility: formData.visibility,
        vendor: vendorData._id,
        stock: parseInt(formData.inventory.quantity) || 0,
        minStock: parseInt(formData.inventory.lowStockThreshold) || 5,
      };

      const url = productId ? `/api/routes/products/${productId}` : '/api/routes/products';
      const response = await fetch(url, {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save product');
      }

      const action = productId ? 'updated' : (status === 'draft' ? 'saved as draft' : 'published');
      alert(`Product ${action} successfully!`);
      onBack?.();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to save product');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while product is being loaded
  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading product data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {productId ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">Create or update product information</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setAiOpen(true)} 
            className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50"
            disabled={submitting}
          >
            Generate with AI
          </button>
          <button 
            onClick={() => handleSubmit(formData.status as 'draft' | 'pending' | 'published')} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
            disabled={submitting}
          >
            <Save className="h-4 w-4" />
            {submitting ? 'Saving...' : productId ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter product name"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brief summary of the product"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Categories <span className="text-red-500">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="text-sm text-gray-500">Loading categories...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(cat._id)}
                          onChange={() => toggleCategory(cat._id)}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                {subCategoriesLoading ? (
                  <div className="text-sm text-gray-500">Loading subcategories...</div>
                ) : (
                  <select
                    value={formData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={!formData.categories.length}
                  >
                    <option value="">Select sub category</option>
                    {subCategories.map((sc) => (
                      <option key={sc._id} value={sc._id}>{sc.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brand name"
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price</label>
                <input
                  type="number"
                  value={formData.comparePrice}
                  onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Media</h3>
            <div className="space-y-4">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                <div className="flex items-center gap-4">
                  {mainImage ? (
                    <div className="relative">
                      <img 
                        src={mainImage.url} 
                        alt="Main product" 
                        className="w-28 h-28 object-cover rounded-lg border" 
                      />
                      <button 
                        onClick={() => setMainImage(null)} 
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg grid place-items-center cursor-pointer hover:border-orange-500">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMainImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt="Product"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.youtubeLink || ''}
                  onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>

          {/* Long Description Builder */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Long Description</h3>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => addLongBlock('text')} 
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Type className="h-4 w-4"/>Text
              </button>
              <button 
                onClick={() => addLongBlock('feature')} 
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                + Feature
              </button>
              <button 
                onClick={() => addLongBlock('image')} 
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4"/>Image
              </button>
            </div>
            <div className="space-y-4">
              {longBlocks.map((block) => (
                <div key={block.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {block.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => moveLongBlock(block.id, 'up')} 
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoveUp className="h-4 w-4"/>
                      </button>
                      <button 
                        onClick={() => moveLongBlock(block.id, 'down')} 
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoveDown className="h-4 w-4"/>
                      </button>
                      <button 
                        onClick={() => removeLongBlock(block.id)} 
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 className="h-4 w-4"/>
                      </button>
                    </div>
                  </div>
                  {block.type === 'image' ? (
                    <div>
                      {block.url ? (
                        <img 
                          src={block.url} 
                          alt="Description" 
                          className="max-h-48 rounded border" 
                        />
                      ) : (
                        <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg grid place-items-center cursor-pointer hover:border-orange-500">
                          <Upload className="h-6 w-6 text-gray-400" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleLongImageUpload(block.id, e)} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateLongBlock(block.id, { content: e.target.value })}
                      rows={block.type === 'text' ? 4 : 2}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder={block.type === 'feature' ? 'Feature bullet...' : 'Paragraph...'}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status & Visibility</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Status
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    formData.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.status === 'published' ? '● Published' : '● Draft'}
                  </span>
                </label>
                <select
                  value={formData.status === 'pending' ? 'published' : formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="draft">Draft - Save for later</option>
                  <option value="published">Published - Live on store</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.status === 'draft' && '💡 Product is saved but not visible to customers'}
                  {formData.status === 'published' && '✅ Product is live and visible to customers'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    formData.visibility === 'public' ? 'bg-blue-100 text-blue-800' :
                    formData.visibility === 'private' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.visibility === 'public' ? '👁️ Public' : 
                     formData.visibility === 'private' ? '🔒 Private' : '🙈 Hidden'}
                  </span>
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="private">Private - Only visible to you</option>
                  <option value="hidden">Hidden - Not searchable</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.visibility === 'public' && '🌐 Product can be found in search and catalog'}
                  {formData.visibility === 'private' && '🔐 Only you can see this product'}
                  {formData.visibility === 'hidden' && '🚫 Product is hidden from search results'}
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Product SKU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.inventory.quantity}
                  onChange={(e) => handleInputChange('inventory.quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                <input
                  type="number"
                  value={formData.inventory.lowStockThreshold}
                  onChange={(e) => handleInputChange('inventory.lowStockThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="5"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="trackQuantity"
                  checked={formData.inventory.trackQuantity}
                  onChange={(e) => handleInputChange('inventory.trackQuantity', e.target.checked)}
                  className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="trackQuantity" className="ml-2 block text-sm text-gray-700">
                  Track quantity
                </label>
              </div>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.shipping.weight}
                  onChange={(e) => handleInputChange('shipping.weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={formData.shipping.dimensions.length}
                    onChange={(e) => handleInputChange('shipping.dimensions.length', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Length"
                  />
                  <input
                    type="number"
                    value={formData.shipping.dimensions.width}
                    onChange={(e) => handleInputChange('shipping.dimensions.width', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    value={formData.shipping.dimensions.height}
                    onChange={(e) => handleInputChange('shipping.dimensions.height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Height"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresShipping"
                  checked={formData.shipping.requiresShipping}
                  onChange={(e) => handleInputChange('shipping.requiresShipping', e.target.checked)}
                  className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="requiresShipping" className="ml-2 block text-sm text-gray-700">
                  This product requires shipping
                </label>
              </div>
            </div>
          </div>

          {/* SEO Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.seo.title.length}/60 characters)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.seo.title}
                  onChange={(e) => handleInputChange('seo.title', e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Product title for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.seo.description.length}/160 characters)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={formData.seo.description}
                  onChange={(e) => handleInputChange('seo.description', e.target.value)}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Product description for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    yourstore.com/products/
                  </span>
                  <input
                    type="text"
                    value={formData.seo.slug}
                    onChange={(e) => handleInputChange('seo.slug', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="product-name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Specifications</h3>
              <button 
                onClick={addSpec}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Plus className="h-4 w-4"/> Add
              </button>
            </div>
            
            <div className="space-y-3">
              {specs.map((spec) => (
                <div key={spec.id} className="grid grid-cols-5 gap-2">
                  <input 
                    value={spec.key} 
                    onChange={(e) => updateSpec(spec.id, 'key', e.target.value)} 
                    placeholder="Key" 
                    className="col-span-2 px-3 py-2 border rounded-lg"
                  />
                  <input 
                    value={spec.value} 
                    onChange={(e) => updateSpec(spec.id, 'value', e.target.value)} 
                    placeholder="Value" 
                    className="col-span-2 px-3 py-2 border rounded-lg"
                  />
                  <button 
                    onClick={() => removeSpec(spec.id)} 
                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {specs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No specifications added yet.
                </p>
              )}
            </div>
          </div>

          {/* Variations Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product Variations</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attributes</label>
                <div className="flex flex-wrap gap-3">
                  {(['Size', 'Color', 'Material'] as AttributeKey[]).map((attr) => (
                    <label key={attr} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={variations.attributes.includes(attr)}
                        onChange={() => {
                          const newAttributes = variations.attributes.includes(attr)
                            ? variations.attributes.filter(a => a !== attr)
                            : [...variations.attributes, attr];
                          setVariations(prev => ({
                            ...prev,
                            attributes: newAttributes,
                            variants: []
                          }));
                        }}
                        className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                      />
                      {attr}
                    </label>
                  ))}
                </div>
              </div>

              {variations.attributes.length > 0 && (
                <div className="space-y-3">
                  {variations.attributes.map((attr) => (
                    <div key={attr}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {attr} Options
                      </label>
                      <input
                        type="text"
                        value={variationInputs[attr]}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          setVariationInputs(prev => ({
                            ...prev,
                            [attr]: rawValue
                          }));
                          
                          const options = rawValue
                            .split(',')
                            .map(opt => opt.trim())
                            .filter(opt => opt.length > 0);
                          
                          setVariations(prev => ({
                            ...prev,
                            options: {
                              ...prev.options,
                              [attr]: options
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder={`e.g., ${attr === 'Size' ? 'S, M, L, XL, XXL' : attr === 'Color' ? 'Red, Blue, Green, Black, White' : 'Cotton, Polyester, Leather'}`}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        💡 Enter multiple options separated by commas (e.g., S, M, L, XL)
                      </p>
                    </div>
                  ))}

                  <button
                    onClick={generateVariants}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                  >
                    Generate Variations
                  </button>
                </div>
              )}

              {variations.variants.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {variations.variants.length} Variations Found
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {variations.attributes.map((attr) => (
                            <th
                              key={attr}
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {attr}
                            </th>
                          ))}
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {variations.variants.map((variant, idx) => (
                          <tr key={variant.id} className="hover:bg-gray-50">
                            {variations.attributes.map((attr) => (
                              <td key={attr} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {variant.combination[attr]}
                              </td>
                            ))}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={variant.price || ''}
                                onChange={(e) => {
                                  const newVariants = [...variations.variants];
                                  newVariants[idx] = {
                                    ...variant,
                                    price: e.target.value
                                  };
                                  setVariations(prev => ({
                                    ...prev,
                                    variants: newVariants
                                  }));
                                }}
                                className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={variant.stock || ''}
                                onChange={(e) => {
                                  const newVariants = [...variations.variants];
                                  newVariants[idx] = {
                                    ...variant,
                                    stock: e.target.value
                                  };
                                  setVariations(prev => ({
                                    ...prev,
                                    variants: newVariants
                                  }));
                                }}
                                className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  placeholder="Add tag"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-sm text-gray-500">No tags added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generation Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Product with AI</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                <input
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Wireless Noise-Cancelling Headphones"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={aiDesc}
                  onChange={(e) => setAiDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Key features, target audience, materials, etc."
                />
              </div>
              {aiError && <p className="text-sm text-red-600">{aiError}</p>}
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button 
                onClick={() => { 
                  if (!aiLoading) { 
                    setAiOpen(false); 
                    setAiError(null); 
                  } 
                }} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={aiLoading}
              >
                Cancel
              </button>
              <button
                disabled={aiLoading || !aiTitle.trim()}
                onClick={async () => {
                  try {
                    setAiLoading(true);
                    setAiError(null);
                    const resp = await fetch('/api/ai/generate-product', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: aiTitle, description: aiDesc })
                    });
                    const json = await resp.json();
                    if (!json?.success) {
                      throw new Error(json?.message || 'Failed to generate');
                    }
                    const d = json.data || {};
                    setFormData(prev => ({
                      ...prev,
                      name: d.name || prev.name,
                      shortDescription: d.shortDescription || prev.shortDescription,
                      price: d.price || prev.price,
                      comparePrice: d.comparePrice || prev.comparePrice,
                      sku: d.sku || prev.sku,
                      brand: d.brand || prev.brand,
                      tags: Array.isArray(d.tags) ? d.tags : prev.tags,
                      seo: {
                        title: d?.seo?.title || prev.seo.title,
                        description: d?.seo?.description || prev.seo.description,
                        slug: d?.seo?.slug || prev.seo.slug,
                      },
                      inventory: {
                        quantity: d?.inventory?.quantity || prev.inventory.quantity,
                        lowStockThreshold: d?.inventory?.lowStockThreshold || prev.inventory.lowStockThreshold,
                        trackQuantity: typeof d?.inventory?.trackQuantity === 'boolean' ? d.inventory.trackQuantity : prev.inventory.trackQuantity,
                      },
                      shipping: {
                        weight: d?.shipping?.weight || prev.shipping.weight,
                        dimensions: {
                          length: d?.shipping?.dimensions?.length || prev.shipping.dimensions.length,
                          width: d?.shipping?.dimensions?.width || prev.shipping.dimensions.width,
                          height: d?.shipping?.dimensions?.height || prev.shipping.dimensions.height,
                        },
                        requiresShipping: typeof d?.shipping?.requiresShipping === 'boolean' ? d.shipping.requiresShipping : prev.shipping.requiresShipping,
                      },
                      longDescription: Array.isArray(d.longDescription) ? d.longDescription : prev.longDescription,
                      specifications: Array.isArray(d.specifications) ? d.specifications : prev.specifications,
                    }));
                    if (Array.isArray(d.longDescription)) setLongBlocks(d.longDescription as any);
                    if (Array.isArray(d.specifications)) setSpecs(d.specifications as any);
                    try {
                      const ir = await fetch('/api/ai/generate-images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: `${aiTitle} ${aiDesc}` })
                      });
                      const ij = await ir.json();
                      if (ij?.success) {
                        const mainUrl = ij.data?.main as string | undefined;
                        const gallery: string[] = Array.isArray(ij.data?.gallery) ? ij.data.gallery : [];
                        if (mainUrl) setMainImage({ id: Date.now() + Math.random(), url: mainUrl, file: new File([], 'ai-main.jpg') });
                        if (gallery.length) setImages(gallery.map((u, i) => ({ id: Date.now() + i + Math.random(), url: u, file: new File([], `ai-${i+1}.jpg`) })));
                      }
                    } catch (imgErr) {
                      console.error('Image generation failed:', imgErr);
                    }
                    setAiOpen(false);
                  } catch (err: any) {
                    setAiError(err?.message || 'Generation failed');
                  } finally {
                    setAiLoading(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-white ${aiLoading || !aiTitle.trim() ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {aiLoading ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}