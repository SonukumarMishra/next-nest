"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Role,
  Country,
  State,
  City,
  Employee,
  defaultEmployeeForm,
  apiFetch,
  API_BASE,
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../common";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState<Employee>(defaultEmployeeForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [countryFilter, setCountryFilter] = useState<number | undefined>(undefined);


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
    fetchEmployees();
  }, [page, pageSize, search, countryFilter]);

  const loadInitialData = async () => {
    const [roleRes, countryRes] = await Promise.all([
      apiFetch(`${API_BASE}/roles`,),
      fetchCountries(),
    ]);

    setRoles(roleRes);
    setCountries(countryRes);

    fetchEmployees();
  };

  const fetchEmployees = async () => {
    const res = await apiFetch(`${API_BASE}/employees/list`, {
      method: "POST",
      body: {
        page, pageSize, search, countryId: countryFilter, // <-- send filter to server
      },
    });
    setEmployees(res.data);
    setTotal(res.total);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await apiFetch(`${API_BASE}/employees/${id}`, { method: "DELETE" });
      fetchEmployees();
      toast.success("Employee deleted");
    }
  };

  // ---------------------- FORM HANDLERS ----------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    if (name === "country_id") {
      setForm({ ...form, country_id: numValue, state_id: undefined, city_id: undefined });
      setCities([]);
      fetchStates(numValue).then(setStates);
    } else if (name === "state_id") {
      setForm({ ...form, state_id: numValue, city_id: undefined });
      fetchCities(numValue).then(setCities);
    } else {
      setForm({
        ...form,
        [name]:
          name === "salary" ||
            name === "role_id" ||
            name === "country_id" ||
            name === "state_id" ||
            name === "city_id"
            ? numValue
            : value,
      });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: Number(e.target.value) });
  };

  const resetForm = () => {
    setForm(defaultEmployeeForm);
    setEditingId(null);
    setStates([]);
    setCities([]);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${API_BASE}/employees/${editingId}`
      : `${API_BASE}/employees`;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });
    if (imageFile) formData.append("image", imageFile);

    await apiFetch(url, { method, body: formData });
    toast.success(editingId ? "Employee updated" : "Employee added");

    resetForm();
    fetchEmployees();
    setView("list");
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      ...emp,
      role_id: emp.role?.id || 1,
      country_id: emp.country?.id || 101,
      state_id: emp.state?.id,
      city_id: emp.city?.id,
    });

    if (emp.country?.id) fetchStates(emp.country.id).then(setStates);
    if (emp.state?.id) fetchCities(emp.state.id).then(setCities);

    setEditingId(emp.id || null);
    setView("form");
  };

  const handleAddNew = () => {
    resetForm();
    setView("form");
  };

  const handleChangeStatus = async (id: number, status: number) => {
    try {
      const res = await fetch(`${API_BASE}/employees/change-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.status) toast.success(data.message || "Status updated");
      else toast.error(data.message || "Failed to update status");
      fetchEmployees();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleRemoveImage = async (id: number) => {
    await fetch(`${API_BASE}/employees/remove-image`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, image: null }),
    });
    fetchEmployees();
    toast.success("Image removed");
  };

  // ---------------------- RENDER ----------------------
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

      {view === "list" ? (
        <>
          {/* Search + Add */}
          <div className="flex justify-between mb-4">
            

            {/* Country Filter */}
            <select
              value={countryFilter || ""}
              onChange={(e) => {
                setPage(1);
                setCountryFilter(Number(e.target.value) || undefined);
              }}
              className="border p-2 rounded w-1/4"
            >
              <option value="">-- All Countries --</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="border p-2 rounded w-1/3"
            />
            <button
              onClick={handleAddNew}
              className="bg-blue-600 font-bold text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              Add New Employee
            </button>
          </div>

          {/* Employee Table */}
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Country</th>
                <th className="border p-2">State</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Salary</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id}>
                  <td className="border p-2">{(page - 1) * pageSize + index + 1}</td>
                  <td className="border p-2">{emp.name}</td>
                  <td className="border p-2">{emp.role?.name}</td>
                  <td className="border p-2">{emp.country?.name}</td>
                  <td className="border p-2">{emp.state?.name}</td>
                  <td className="border p-2">{emp.city?.name}</td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2">{emp.phone}</td>
                  <td className="border p-2">{emp.salary?.toFixed(2)}</td>
                  <td className="border p-2 text-center">
                    {emp.image ? (
                      <>
                        <img
                          src={`http://localhost:5000/${emp.image}`}
                          alt={emp.name}
                          className="h-16 w-16 object-cover rounded mx-auto"
                        />
                        <button
                          onClick={() => handleRemoveImage(emp.id!)}
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
                      onClick={() => handleChangeStatus(emp.id!, emp.status === 1 ? 0 : 1)}
                      className={`text-white px-2 py-1 rounded ${emp.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {emp.status === 1 ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleEdit(emp)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(emp.id!)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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
        /* FORM VIEW */
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
          <h2 className="col-span-2 text-lg font-semibold mb-2">{editingId ? "Edit Employee" : "Add Employee"}</h2>

          {/* Role */}
          <select name="role_id" value={form.role_id || ""} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- Select Role --</option>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>

          {/* Country */}
          <select name="country_id" value={form.country_id || ""} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- Select Country --</option>
            {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
          </select>

          {/* State */}
          <select name="state_id" value={form.state_id || ""} onChange={handleChange} className="border p-2 rounded" required disabled={!states.length}>
            <option value="">-- Select State --</option>
            {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
          </select>

          {/* City */}
          <select name="city_id" value={form.city_id || ""} onChange={handleChange} className="border p-2 rounded" required disabled={!cities.length}>
            <option value="">-- Select City --</option>
            {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>

          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
          <input name="phone" placeholder="Phone" value={form.phone || ""} onChange={handleChange} className="border p-2 rounded" />
          <input name="address" placeholder="Address" value={form.address || ""} onChange={handleChange} className="border p-2 rounded" />
          <input name="salary" placeholder="Salary" type="number" value={form.salary ?? 0} onChange={handleChange} className="border p-2 rounded" />

          {/* Image */}
          <div className="flex flex-col">
            <label htmlFor="image" className="font-medium mb-1">Employee Image</label>
            <input id="image" name="image" type="file" onChange={handleImageChange} className="border p-2 rounded" accept="image/*" />
          </div>

          {!editingId && (
            <input name="password" placeholder="Password" type="password" onChange={handleChange} className="border p-2 rounded" required />
          )}

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="font-medium mb-1">Status</label>
            <select id="status" name="status" value={form.status ?? ""} onChange={handleStatusChange} className="border p-2 rounded" required>
              <option value="">-- Select Status --</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-between">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">{editingId ? "Update Employee" : "Add Employee"}</button>
            <button type="button" onClick={() => setView("list")} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
