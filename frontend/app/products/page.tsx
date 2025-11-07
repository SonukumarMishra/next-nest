"use client";

import { useEffect, useState } from "react";

interface Employee {
  id?: number;
  name: string;
  asin: string;
  sku: string;
  price?: number;
  stock_quantity?: number;
  cost_price?: number;
  selling_price?: number;
  discount?: number,
  upc?: string,
}

export default function EmployeePage() {
  const [products, setProducts] = useState<Employee[]>([]);
  const [form, setForm] = useState<Employee>({
    name: "",
    asin: "",
    sku: "",
    price: 0,
    discount: 0,
    stock_quantity: 0,
    cost_price: 0,
    selling_price: 0,
    upc: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `http://localhost:5000/products/${editingId}`
      : "http://localhost:5000/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      asin: "",
      sku: "",
      price: 0,
      upc: "",
      discount: 0,
      stock_quantity: 0,
      cost_price: 0,
      selling_price: 0,
    });
    setEditingId(null);
    fetchProducts();
  };
           
  const handleEdit = (emp: Employee) => {
    setForm(emp);
    setEditingId(emp.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        {/* Product Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="font-medium mb-1">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* ASIN */}
        <div className="flex flex-col">
          <label htmlFor="asin" className="font-medium mb-1">
            ASIN
          </label>
          <input
            id="asin"
            name="asin"
            placeholder="Enter ASIN"
            value={form.asin}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* SKU */}
        <div className="flex flex-col">
          <label htmlFor="sku" className="font-medium mb-1">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            placeholder="Enter SKU"
            value={form.sku}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* UPC */}
        <div className="flex flex-col">
          <label htmlFor="upc" className="font-medium mb-1">
            UPC
          </label>
          <input
            id="upc"
            name="upc"
            placeholder="Enter UPC"
            value={form.upc}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="font-medium mb-1">
            Price
          </label>
          <input
            id="price"
            name="price"
            placeholder="Enter price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Discount */}
        <div className="flex flex-col">
          <label htmlFor="discount" className="font-medium mb-1">
            Discount (%)
          </label>
          <input
            id="discount"
            name="discount"
            placeholder="Enter discount percentage"
            type="number"
            value={form.discount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="stock_quantity" className="font-medium mb-1">
            Stock Quantity
          </label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            placeholder="Enter Stock Quantity percentage"
            type="number"
            value={form.stock_quantity}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="discount" className="font-medium mb-1">
            Cost Price
          </label>
          <input
            id="cost_price"
            name="cost_price"
            placeholder="Enter Cost Price"
            type="number"
            value={form.cost_price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="selling_price" className="font-medium mb-1">
            Selling Price
          </label>
          <input
            id="selling_price"
            name="selling_price"
            placeholder="Enter Selling Price "
            type="number"
            value={form.selling_price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>


      {/* Product Table */}
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
            <th className="border p-2">Stock Quantity</th>
            <th className="border p-2">Cost Price</th>
            <th className="border p-2">Selling Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((emp, index) => (
            <tr key={emp.id} >
             
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.asin}</td>
              <td className="border p-2">{emp.sku}</td>
              <td className="border p-2">{emp.upc}</td>
              <td className="border p-2">{emp.price}</td>
              <td className="border p-2">{emp.discount}</td>
              <td className="border p-2">{emp.stock_quantity}</td>
              <td className="border p-2">{emp.cost_price}</td>
              <td className="border p-2">{emp.selling_price}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id!)}
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
