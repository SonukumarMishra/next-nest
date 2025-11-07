"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../types";
import ProductForm from "../../ProductForm";
import Com from "@/app/Com";
 
export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  // Fetch product details
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleUpdate = async (updatedData: Product) => {
    await fetch(`http://localhost:5000/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    router.push("/products/list");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <Com/>
      <ProductForm initialData={product} onSubmit={handleUpdate} />
    </div>
  );
}
