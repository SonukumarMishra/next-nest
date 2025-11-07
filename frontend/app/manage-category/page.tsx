"use client";

import { useEffect, useState } from "react";
import Com from "../Com";

interface Category {
  id?: number;
  name: string;
  description: string;
  category_image?: string;
  status?: number; // optional, for existing image
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // for new image
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/categories/${editingId}`
      : "http://localhost:5000/categories";

    const method = editingId ? "PATCH" : "POST";

    // Use FormData to send text + file
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (imageFile) {
      formData.append("category_image", imageFile);
    }

    await fetch(url, {
      method,
      body: formData,
    });

    setForm({ name: "", description: "" });
    setImageFile(null);
    setEditingId(null);
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      description: category.description,
      category_image: category.category_image,
    });
    setEditingId(category.id || null);
  };
  const handleChangeStatus = async (id: number, status: number) => {
    await fetch(`http://localhost:5000/categories/change-status`, {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchCategories();
  };

  const handleRemoveImage = async (id: number) => {
    await fetch(`http://localhost:5000/categories/remove-image`, {
      method: "PATCH",
      body: JSON.stringify({ id,category_image: null }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchCategories();
  };  

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await fetch(`http://localhost:5000/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      <Com />

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="font-medium mb-1">Category Name</label>
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
          <label htmlFor="description" className="font-medium mb-1">Description</label>
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
          <label htmlFor="category_image" className="font-medium mb-1">Category Image</label>
          <input
            id="category_image"
            name="category_image"
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded"
            accept="image/*"
          />
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

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
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
            <tr key={category.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{category.name}</td>
              <td className="border p-2">{category.description}</td>
              <td className="border p-2">
                {category.category_image && (
                  <img
                    src={`http://localhost:5000/${category.category_image}`}
                    alt={category.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                {category.category_image && (
                  <button onClick={() => handleRemoveImage(category.id!)} className="bg-red-600 text-white px-1 py-1 rounded">
                    Remove Image
                  </button>
                )}
              </td>
              <td className="border p-2"> <button
                  onClick={() => handleChangeStatus(category.id! , category.status === 1 ? 0 : 1 )}
                  className={`text-white px-2 py-1 rounded ${category.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                >{category.status === 1 ? 'Active' : 'Inactive'}</button></td>

              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id!)} className="bg-red-600 text-white px-2 py-1 rounded">
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
