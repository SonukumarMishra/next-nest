 
"use client";
import { useEffect,useState } from "react";
interface Role{
  id?:number;
  name?:string;
  status?:number
}

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<Role>({ name: "", status: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "form">("list");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 1;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRoles();
  }, [page, search]);

  const fetchRoles = async () => {
    const res = await fetch("http://localhost:5000/roles/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page,
        pageSize,
        search,
      }),
    });

    const data = await res.json();
    setRoles(data.data);
    setTotal(data.total);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `http://localhost:5000/roles/${editingId}`
      : "http://localhost:5000/roles";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", status: 1 });
    setEditingId(null);
    fetchRoles();
    setView("list");
  };


  const handleEdit = (role: Role) => {
    setForm(role);
    setEditingId(role.id || null);
    setView("form");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      await fetch(`http://localhost:5000/roles/${id}`, {
        method: "DELETE",
      });
      fetchRoles();
    }
  };

  const handleChangeStatus = async (id: number, status: number) => {
    await fetch("http://localhost:5000/roles/change-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchRoles();
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({ name: "", status: 1 });
    setView("form");
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>

      {view === "list" ? (
        <>
          {/* Search + Add Button */}
          <div className="flex justify-between mb-4">
            <input type="text" placeholder="Search roles..." value={search} onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset on search
            }}
              className="border p-2 rounded w-1/3"
            />

            <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > ➕ Add New Role</button>
          </div>

          {/* Roles Table */}
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((role, index) => (
                <tr key={role.id}>
                  <td className="border p-2">
                    {(page - 1) * pageSize + index + 1}
                  </td>

                  <td className="border p-2">{role.name}</td>
                  <td className="border p-2">
                    <button onClick={() => handleChangeStatus( role.id!, role.status === 1 ? 0 : 1 )}
                      className={`text-white px-2 py-1 rounded ${role.status === 1 ? "bg-green-500" : "bg-red-500"
                    }`}
                    >{role.status === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(role.id!)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {roles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded border ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
            > Previous </button>
            <span> Page {page} of {totalPages} </span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`px-3 py-1 rounded border ${page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}>  Next </button>
          </div>
        </>
      ) : (
        /* ---------------- FORM VIEW ---------------- */
        <>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow" >
            <h2 className="col-span-2 text-lg font-semibold mb-2"> {editingId ? "Edit Role" : "Add Role"}</h2>
            <input name="name" placeholder="Role Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded" required  >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            <div className="col-span-2 flex justify-between">
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" >
                {editingId ? "Update Role" : "Add Role"}
              </button>
              <button type="button" onClick={() => setView("list")} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500" >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
