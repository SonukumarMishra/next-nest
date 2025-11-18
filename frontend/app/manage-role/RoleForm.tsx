"use client";

import { Role } from "./role.types";
import { createRole, updateRole } from "./role.api";

export default function RoleForm({
  editingId,
  form,
  setForm,
  onSuccess,
}: any) {
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingId) {
      await updateRole(editingId, form);
    } else {
      await createRole(form);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Role Name"
        className="border p-2 rounded w-full mb-3"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      >
        <option value={1}>Active</option>
        <option value={0}>Inactive</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? "Update Role" : "Add Role"}
      </button>
    </form>
  );
}
