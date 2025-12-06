"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
 
export interface Role {
  id: number;
  name: string;
}

export interface Customer {
  id?: number;
  name: string;
  role?: Role;
  role_id?: number;
  email: string;
  phone?: string;
  status?: number;
  image?: string;
  password?: string;
  createdDate?: string;
}

export interface FetchOptions {
  method?: string;
  body?: any;
}

export const API_BASE = "http://localhost:5000";

export const apiFetch = async (url: string, options: FetchOptions = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: isFormData
      ? undefined
      : { "Content-Type": "application/json" },
    body: isFormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

 

  return res.json();
};

 

// ---------- Default Form ----------
export const defaultCustomerForm: Customer = {
  name: "",
  role_id: 1,
  email: "",
  phone: "",
  status: 1,
  password: "",
};

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [form, setForm] = useState<Customer>(defaultCustomerForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [view, setView] = useState<"customerList" | "form" | "addressList">("customerList");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // FILTER STATES
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  // ---------------------- DATA FETCHING ----------------------
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, search,roleFilter]);

  const loadInitialData = async () => {
    const [roleRes] = await Promise.all([
      apiFetch(`${API_BASE}/roles`),
    ]);
    setRoles(roleRes);
    fetchCustomers();
  };

  const fetchCustomers = async () => {
    const res = await apiFetch(`${API_BASE}/customers/list`, {
      method: "POST",
      body: {
        page,
        pageSize,
        search,
        roleId: roleFilter
      },
    });

    setCustomers(res.data);
    setTotal(res.total);
  };

  // ---------------------- EVENT HANDLERS ----------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this Customer?")) {
      await apiFetch(`${API_BASE}/customers/${id}`, { method: "DELETE" });
      fetchCustomers();
      toast.success("Customer deleted");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value);

     setForm({
        ...form,
        [name]:
          ["role_id"].includes(name)
            ? numValue
            : value,
      });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: Number(e.target.value) });
  };

  const resetForm = () => {
    setForm(defaultCustomerForm);
    setEditingId(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${API_BASE}/customers/${editingId}`
      : `${API_BASE}/customers`;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });
    if (imageFile) formData.append("image", imageFile);

    await apiFetch(url, { method, body: formData });

    toast.success(editingId ? "Customer updated" : "Customer added");

    resetForm();
    fetchCustomers();
    setView("customerList");
  };

  const handleEdit = (customer: Customer) => {
    setForm({
      ...customer,
      role_id: customer.role?.id || 1,
    });
    setEditingId(customer.id || null);
    setView("form");
  };

  const handleChangeStatus = async (id: number, status: number) => {
    try {
      const res = await apiFetch(`${API_BASE}/customers/change-status`, {
        method: "PATCH",
        body: { id, status },
      });

      toast.success("Status updated");
      fetchCustomers();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const manageAddress=(customers:Customer)=>{
    
  }

  const handleRemoveImage = async (id: number) => {
    await apiFetch(`${API_BASE}/customers/remove-image`, {
      method: "PATCH",
      body: { id },
    });

    fetchCustomers();
    toast.success("Image removed");
  };

  // ---------------------- RENDER ----------------------
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
 
      {view === "customerList" ? (
        <>
          <div className="flex gap-4 mb-4">
            <select value={roleFilter || ""} onChange={(e) => { setRoleFilter(Number(e.target.value) || undefined); setPage(1); }} className="border p-2 rounded w-1/4" >
              <option value="">-- Select Role --</option>
              {roles.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <input type="text" placeholder="Search Customer" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="border p-2 rounded w-1/3" />
          </div>

          <button
            onClick={() => {
              resetForm();
              setView("form");
            }}
            className="bg-blue-600 font-bold text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Add New Customer
          </button>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total Address</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id}>
                  <td className="border p-2">{(page - 1) * pageSize + index + 1}</td>
                  <td className="border p-2">{customer.name}</td>
                  <td className="border p-2">{customer.role?.name}</td>
                  <td className="border p-2">{customer.email}</td>
                  <td className="border p-2">{customer.phone}</td>

                  <td className="border p-2 text-center">
                    {customer.image ? (
                      <>
                        <img
                          src={`http://localhost:5000/${customer.image}`}
                          alt={customer.name}
                          className="h-16 w-16 object-cover rounded mx-auto"
                        />
                        <button
                          onClick={() => handleRemoveImage(customer.id!)}
                          className="bg-red-600 text-white px-2 py-1 rounded mt-2 text-sm"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => handleChangeStatus(customer.id!, customer.status === 1 ? 0 : 1)}
                      className={`text-white px-2 py-1 rounded ${customer.status === 1 ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {customer.status === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="border p-2">10</td>

                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => manageAddress(customer)}
                      className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center"
                    >
                      Manage Address
                    </button>

                     <button
                      onClick={() => handleEdit(customer)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() => handleDelete(customer.id!)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-bold">
              Page {page} of {Math.ceil(total / pageSize)}
            </span>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow"
        >
          <h2 className="col-span-2 text-lg font-semibold mb-2">
            {editingId ? "Edit Customer" : "Add Customer"}
          </h2>

          <select
            name="role_id"
            value={form.role_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>

           
  

          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
          <input name="phone" placeholder="Phone" value={form.phone || ""} onChange={handleChange} className="border p-2 rounded" />

          <div className="flex flex-col">
            <label className="font-medium mb-1">Customer Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" className="border p-2 rounded" />
          </div>

          {!editingId && (
            <input name="password" placeholder="Password" type="password" onChange={handleChange} className="border p-2 rounded" required />
          )}

          <div className="flex flex-col">
            <label className="font-medium mb-1">Status</label>
            <select name="status" value={form.status ?? ""} onChange={handleStatusChange} className="border p-2 rounded" required>
              <option value="">-- Select Status --</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-between">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              {editingId ? "Update Customer" : "Add Customer"}
            </button>
            <button onClick={() => setView("customerList")} type="button" className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
