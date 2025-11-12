 
"use client";
import { useEffect, useState } from "react";
import { Product } from "../types";
import { useRouter } from "next/navigation";
import Com from "@/app/Header";
 
export default function ProductListPage(){

 const [products,setProducts]=useState<Product[]>([]);
 const router=useRouter();

 const fetchProducts=async ()=>{
  const res= await fetch("http://localhost:5000/products");
  const data=await res.json();
  setProducts(data);
 };
 useEffect(()=>{
  fetchProducts();
 },[]);

 const handleDelete=async (id:number)=>{
  if(confirm("Are you sure want to delete this product?")){
    await fetch(`http://localhost:5000/products/${id}`,{method:"DELETE"});
    fetchProducts();
  }
 }

  return (
    <div className="p-8 max-w-6xl mx-auto">
       
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
         
        
      </div>
      

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">ASIN</th>
            <th className="border p-2">SKU</th>
            <th className="border p-2">UPC</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.asin}</td>
              <td className="border p-2">{p.sku}</td>
              <td className="border p-2">{p.upc}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.discount}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => router.push(`/products/${p.id}/edit`)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id!)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
