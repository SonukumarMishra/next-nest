"use client";

import { useEffect, useState } from "react";
import Com from "../Header";
import Bts from "../Bts";
import Footer from "../Footer";

interface Category {
  id?: number;
  name: string;
  description: string;
  category_image?: string;
  status?: number;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
    status: 1,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/categories");
    const data = await res.json();
    setCategories(data);
  };

  // Input text change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Status change in select dropdown
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: Number(e.target.value) });
  };

  // Add / Update Category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/categories/${editingId}`
      : "http://localhost:5000/categories";

    const method = editingId ? "PATCH" : "POST";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("status", String(form.status ?? 1));
    if (imageFile) {
      formData.append("category_image", imageFile);
    }

    await fetch(url, {
      method,
      body: formData,
    });

    // Reset form
    setForm({ name: "", description: "", status: 1 });
    setImageFile(null);
    setEditingId(null);
    fetchCategories();
  };

  // Edit Category
  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      description: category.description,
      category_image: category.category_image,
      status: category.status,
    });
    setImageFile(null);
    setEditingId(category.id || null);
  };

  // Change Active/Inactive status
  const handleChangeStatus = async (id: number, status: number) => {
    await fetch(`http://localhost:5000/categories/change-status`, {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    fetchCategories();
  };

  // Remove image
  const handleRemoveImage = async (id: number) => {
    await fetch(`http://localhost:5000/categories/remove-image`, {
      method: "PATCH",
      body: JSON.stringify({ id, category_image: null }),
      headers: { "Content-Type": "application/json" },
    });
    fetchCategories();
  };

  // Delete category
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await fetch(`http://localhost:5000/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <i className="bi bi-box-seam text-blue-600 text-3xl"></i>
        Product Category Management
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="font-medium mb-1">
            Category Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter Category Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="font-medium mb-1">
            Description
          </label>
          <input
            id="description"
            name="description"
            placeholder="Enter Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category_image" className="font-medium mb-1">
            Category Image
          </label>
          <input
            id="category_image"
            name="category_image"
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded"
            accept="image/*"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="status" className="font-medium mb-1">
            Category Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status ?? ""}
            onChange={handleStatusChange}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Status --</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </div>
      </form>

      {/* Table Section */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{category.name}</td>
              <td className="border p-2">{category.description}</td>
              <td className="border p-2 text-center">
                {category.category_image ? (
                  <>
                    <img
                      src={`http://localhost:5000/${category.category_image}`}
                      alt={category.name}
                      className="h-16 w-16 object-cover rounded mx-auto"
                    />
                    <button
                      onClick={() => handleRemoveImage(category.id!)}
                      className="bg-red-600 text-white px-2 py-1 rounded mt-2 text-sm"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() =>
                    handleChangeStatus(category.id!, category.status === 1 ? 0 : 1)
                  }
                  className={`text-white px-3 py-1 rounded ${category.status === 1 ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                  {category.status === 1 ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="border p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id!)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer />
    </div>
  );
}
