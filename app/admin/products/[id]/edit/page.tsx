"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Plus, Trash2, Save, Upload, CheckCircle, Loader2, Star } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { CategoryService, type Category } from "@/services/category.service";
import { UploadService } from "@/services/upload.service";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  isRefurbished: z.boolean().default(false),
  images: z.array(z.string()).min(1, "At least one image is required"),
  basePrice: z.coerce.number().default(0),
  originalBasePrice: z.coerce.number().default(0),
  inStock: z.boolean().default(true),
  attributes: z.array(z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().optional()
  })),
  enableVariants: z.boolean().default(false),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    ram: z.string().optional(),
    storage: z.string().optional(),
    price: z.coerce.number().min(0),
    originalPrice: z.coerce.number().min(0),
    inStock: z.boolean().default(true)
  })).min(1, "At least one pricing option is required.")
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAllCategories();
        setCategories((response.data as Category[]) || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema as any),
    defaultValues: {
      title: "",
      brand: "",
      category: "",
      subcategory: "",
      isRefurbished: false,
      images: [],
      basePrice: 0,
      originalBasePrice: 0,
      inStock: true,
      attributes: [],
      enableVariants: true,
      variants: [{ name: "Standard", price: 0, originalPrice: 0, inStock: true }]
    },
  });

  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getProductById(productId);
        const product = response.data as ProductFormValues & { attributes: { key: string; value: string }[] | Record<string, unknown> };
        
        // Transform attributes from { key, value } format
        const formattedAttributes = Array.isArray(product.attributes) 
          ? product.attributes 
          : Object.entries(product.attributes || {}).map(([key, value]) => ({ key, value: String(value) }));

        form.reset({
          title: product.title,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory,
          isRefurbished: product.isRefurbished,
          images: product.images || [],
          basePrice: product.basePrice || 0,
          originalBasePrice: product.originalBasePrice || 0,
          inStock: product.inStock,
          attributes: formattedAttributes,
          enableVariants: true,
          variants: (product.variants && product.variants.length > 0) ? product.variants : [{ name: "Standard", price: 0, originalPrice: 0, inStock: true }]
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId, form]);

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const watchCategory = form.watch("category");
  const REQUIRED_LAPTOP_KEYS = ["Processor", "Screen Size", "Operating System"];
  
  const LAPTOP_ATTRIBUTE_OPTIONS: Record<string, string[]> = {
    "Processor": ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "Apple M3 Pro", "Apple M3 Max", "Snapdragon X Elite"],
    "RAM": ["4 GB", "8 GB", "12 GB", "16 GB", "24 GB", "32 GB", "64 GB", "128 GB"],
    "Storage": ["128 GB SSD", "256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD", "4 TB SSD", "8 TB SSD", "1 TB HDD", "1 TB HDD + 256 GB SSD"],
    "Screen Size": ["11.6 inch", "13.3 inch", "13.6 inch", "14 inch", "14.2 inch", "15.3 inch", "15.6 inch", "16 inch", "16.2 inch", "17.3 inch", "18 inch"],
    "Operating System": ["Windows 11 Home", "Windows 11 Pro", "Windows 10 Home", "Windows 10 Pro", "macOS", "Chrome OS", "Ubuntu Linux", "DOS", "No OS"]
  };

  // Pre-fill attributes based on category selection
  const handleCategoryChange = (value: string | null) => {
    if (!value) return;
    form.setValue("category", value);
    if (value === "Laptops") {
      form.setValue("attributes", [
        { key: "Processor", value: "" },
        { key: "Screen Size", value: "" },
        { key: "Operating System", value: "" },
      ]);
    } else {
      form.setValue("attributes", [
        { key: "material", value: "" }
      ]);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (data.images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }
    setIsSubmitting(true);
    try {
      const basePrice = Math.min(...data.variants.map(v => v.price));
      const originalBasePrice = Math.max(...data.variants.map(v => v.originalPrice));
      const inStock = data.variants.some(v => v.inStock);

      const cleanedData = {
        ...data,
        basePrice,
        originalBasePrice,
        inStock,
        enableVariants: true,
        attributes: data.attributes.filter(attr => attr.value && attr.value.trim() !== "") as {key: string; value: string;}[]
      };
      await ProductService.updateProduct(productId, cleanedData);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await UploadService.uploadImage(file);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, result.data.url]);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" render={<Link href="/admin/products" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: General & Taxonomy */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Basic details about the product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MacBook Pro 16-inch" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Apple, Adnet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isRefurbished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-full">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Refurbished Product</FormLabel>
                            <FormDescription>
                              Shows the refurbished badge on the shop.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Ultrabook, Casing, Mouse Pad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic JSONB Attributes Builder */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Dynamic Attributes (JSONB)</CardTitle>
                      <CardDescription>Add custom key-value specifications for this product.</CardDescription>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => appendAttribute({ key: "", value: "" })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Spec
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attributeFields.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground">
                      No attributes added. Select a category to auto-fill or add custom specs.
                    </div>
                  ) : (
                    attributeFields.map((field, index) => {
                      const currentKey = form.getValues(`attributes.${index}.key`);
                      const isRequired = watchCategory === "Laptops" && REQUIRED_LAPTOP_KEYS.includes(currentKey);
                      const predefinedOptions = isRequired ? LAPTOP_ATTRIBUTE_OPTIONS[currentKey] : null;

                      return (
                        <div key={field.id} className="flex gap-4 items-end">
                          <FormField
                            control={form.control}
                            name={`attributes.${index}.key`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Key</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. Refresh Rate" 
                                    {...field} 
                                    readOnly={isRequired}
                                    className={isRequired ? "bg-muted text-muted-foreground font-medium" : ""} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`attributes.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Value</FormLabel>
                                <FormControl>
                                  {predefinedOptions ? (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger>
                                        <SelectValue placeholder={`Select ${currentKey}`} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {predefinedOptions.map(opt => (
                                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input placeholder="e.g. 144Hz" {...field} />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAttribute(index)}
                            disabled={isRequired}
                            className={isRequired ? "opacity-0 pointer-events-none" : "text-destructive hover:bg-destructive/10"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Right Column: Pricing, Variants, Image */}
            <div className="space-y-8">
              
              {/* Image Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Upload product photos (max 5 MB each, JPEG/PNG/WebP). First image will be the primary thumbnail.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Images Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {(form.watch("images") || []).map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl border overflow-hidden group">
                        <Image src={img} alt={`Product ${idx}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium shadow-sm">Primary</div>
                        )}
                        {idx !== 0 && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="icon" 
                            className="absolute top-2 left-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-primary hover:text-primary-foreground"
                            onClick={() => {
                              const current = form.getValues("images");
                              const newImages = [...current];
                              const temp = newImages[0];
                              newImages[0] = newImages[idx];
                              newImages[idx] = temp;
                              form.setValue("images", newImages);
                            }}
                            title="Set as primary"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const current = form.getValues("images");
                            form.setValue("images", current.filter((_, i) => i !== idx));
                          }}
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Drop Zone */}
                  <label
                    htmlFor="image-upload-input"
                    className={`relative flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all border-muted-foreground/30 bg-muted/40 hover:border-primary/50 hover:bg-muted/60`}
                  >
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center rounded-xl z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <span className="text-sm font-medium">Uploading to Cloudinary...</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center justify-center text-muted-foreground p-6">
                      <Upload className="h-10 w-10 mb-3" />
                      <span className="text-sm font-medium">Click or drag & drop to upload</span>
                      <span className="text-xs mt-1">JPEG, PNG, WebP — up to 5 MB</span>
                    </div>
                    <input
                      id="image-upload-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </CardContent>
              </Card>

              {/* Pricing & Options Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Options</CardTitle>
                  <CardDescription>Add at least one product option to set the price and inventory.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Variant Builder */}
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Product Variants</h4>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="sm"
                          onClick={() => appendVariant({ name: "", price: 0, originalPrice: 0, inStock: true })}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Variant
                        </Button>
                      </div>

                      {variantFields.length === 0 ? (
                        <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground text-sm">
                          Click &quot;Add Variant&quot; to create options like &quot;Adnet&quot; vs &quot;Normal&quot;.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {variantFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg bg-card space-y-4 relative group">
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="absolute -top-3 -right-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                onClick={() => removeVariant(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>

                              {watchCategory === "Laptops" ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`variants.${index}.ram`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>RAM</FormLabel>
                                        <Select onValueChange={(val) => {
                                          field.onChange(val || undefined);
                                          const currentStorage = form.getValues(`variants.${index}.storage`) || "";
                                          const newName = val && currentStorage ? `${val} / ${currentStorage}` : val || currentStorage || "";
                                          form.setValue(`variants.${index}.name`, newName);
                                        }} value={field.value}>
                                          <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select RAM" /></SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {["4 GB", "8 GB", "16 GB", "32 GB", "64 GB"].map(v => (
                                              <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`variants.${index}.storage`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Storage</FormLabel>
                                        <Select onValueChange={(val) => {
                                          field.onChange(val || undefined);
                                          const currentRam = form.getValues(`variants.${index}.ram`) || "";
                                          const newName = currentRam && val ? `${currentRam} / ${val}` : currentRam || val || "";
                                          form.setValue(`variants.${index}.name`, newName);
                                        }} value={field.value}>
                                          <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Storage" /></SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"].map(v => (
                                              <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {/* Hidden input to register the combined name string */}
                                  <input type="hidden" {...form.register(`variants.${index}.name`)} />
                                </div>
                              ) : (
                                <FormField
                                  control={form.control}
                                  name={`variants.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Variant Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Adnet 2.0" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`variants.${index}.price`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Price</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`variants.${index}.originalPrice`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>MRP</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-6">
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      )}
    </div>
  );
}
