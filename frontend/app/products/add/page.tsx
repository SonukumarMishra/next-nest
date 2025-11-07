"use client";
import Com from "@/app/Com";
// import Header from "@/app/Header";
import ProductForm from "../ProductForm";
import { Product } from "../types";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const handleAdd = async (data: Product) => {
    await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.push("/products/list");
  };

return (
  <div className="p-8 max-w-6xl mx-auto">
    
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Add New Product</h1>
      
    </div>
  <Com/>

    <ProductForm onSubmit={handleAdd} />
  </div>
);
}
