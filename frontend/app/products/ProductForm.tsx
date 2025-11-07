"use client";
import { useEffect, useState } from "react";
import { Product } from "./types";

interface Props {
  initialData?: Product;
  onSubmit: (data: Product) => Promise<void>;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductForm({ initialData, onSubmit }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Product>(
    initialData || {
      name: "",
      asin: "",
      sku: "",
      upc: "",
      price: 0,
      discount: 0,
      stock_quantity: 0,
      cost_price: 0,
      selling_price: 0,
      category_id: 0,
    }
  );

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Update form when editing
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "category_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 mb-8">
      {/* Category Dropdown */}
      <div className="flex flex-col">
        <label htmlFor="category_id" className="font-medium mb-1">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={form.category_id || ""}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reuse dynamic inputs */}
      {[
        "name",
        "asin",
        "sku",
        "upc",
        "price",
        "discount",
        "stock_quantity",
        "cost_price",
        "selling_price",
      ].map((field) => (
        <div key={field} className="flex flex-col">
          <label htmlFor={field} className="font-medium mb-1 capitalize">
            {field.replace("_", " ")}
          </label>
          <input
            id={field}
            name={field}
            type={
              ["price", "discount", "stock_quantity", "cost_price", "selling_price"].includes(
                field
              )
                ? "number"
                : "text"
            }
            value={(form as any)[field] ?? ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required={["name", "asin", "sku"].includes(field)}
          />
        </div>
      ))}

      {/* Submit button full width */}
      <div className="col-span-3 mt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {initialData ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
