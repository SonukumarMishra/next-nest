"use client";

import { useEffect, useState } from "react";
import Com from "../Com";

interface Role {
  id: number;
  name: string;
}

interface Employee {
  id?: number;
  name: string;
  role?: Role;
  role_id?: number; // 👈 added for easier form binding
  email: string;
  phone?: string;
  address?: string;
  status?: number;
  password?: string;
  createdDate?: string;
  salary?: number;
  totalLogin?: number;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // 👈 added
  // const [form, setForm] = useState<Employee>({
  //   name: "",
  //   role_id: 1,
  //   email: "",
  //   phone: "",
  //   address: "",
  //   status: 1,
  //   password: "",
  //   salary: 0,
  //   totalLogin: 0,
  // });

  const [form, setForm] = useState<Employee>({
  name: "",
  role: { id: 1, name: "Employee" }, // default
  email: "",
  phone: "",
  address: "",
  status: 1,
  password: "",
  salary: 0,
  totalLogin: 0,
});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "form">("list");

  // Fetch employees & roles
  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:5000/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const fetchRoles = async () => {
    const res = await fetch("http://localhost:5000/roles");
    const data = await res.json();
    setRoles(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "salary" ? Number(value) : // ensure numeric
        name === "role_id" ? Number(value) :
        value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `http://localhost:5000/employees/${editingId}`
      : "http://localhost:5000/employees";

    // Attach selected role_id before sending
    const payload = { ...form, role_id: form.role_id };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({
      name: "",
      role_id: 0,
      email: "",
      phone: "",
      address: "",
      status: 1,
      password: "",
      salary: 0,
      totalLogin: 0,
    });
    setEditingId(null);
    fetchEmployees();
    setView("list");
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      ...emp,
      role_id: emp.role?.id, // map nested role object to role_id for form
    });
    setEditingId(emp.id || null);
    setView("form");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
      fetchEmployees();
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({
      name: "",
      role_id: 1,
      email: "",
      phone: "",
      address: "",
      status: 1,
      password: "",
      salary: 0,
      totalLogin: 0,
    });
    setView("form");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      <Com />

      {view === "list" ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ Add New Employee
            </button>
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Salary</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Total Login</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{emp.name}</td>
                  <td className="border p-2">{emp.role?.name}</td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2">{emp.phone}</td>
                  <td className="border p-2">{emp.salary?.toFixed(2)}</td>
                  <td className="border p-2">{emp.address}</td>
                  <td className="border p-2">{emp.totalLogin}</td>
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
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow"
        >
          <h2 className="col-span-2 text-lg font-semibold mb-2">
            {editingId ? "Edit Employee" : "Add Employee"}
          </h2>

          {/* Role dropdown */}
          <select
            id="role_id"
            name="role_id"
            value={form.role_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="salary"
            placeholder="Salary"
            type="number"
            value={form.salary ?? 0}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required={!editingId}
          />

          <div className="col-span-2 flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingId ? "Update Employee" : "Add Employee"}
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
