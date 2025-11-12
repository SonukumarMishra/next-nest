"use client";

import { useEffect, useState } from "react";
import Com from "../Header";
import Footer from "../Footer";

// ---------------------- INTERFACES ----------------------

interface Role {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
  country_id: number;
}

interface City {
  id: number;
  name: string;
  state_id: number;
}

interface Employee {
  id?: number;
  name: string;
  role?: Role;
  role_id?: number;
  country?: Country;
  country_id?: number;
  state?: State;
  state_id?: number;
  city?: City;
  city_id?: number;
  email: string;
  phone?: string;
  address?: string;
  status?: number;
  password?: string;
  createdDate?: string;
  salary?: number;
  totalLogin?: number;
}

// ---------------------- COMPONENT ----------------------

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState<Employee>({
    name: "",
    role_id: 1,
    country_id: 101,
    state_id: undefined,
    city_id: undefined,
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

  // ---------------------- DATA FETCHING ----------------------

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
    fetchCountries();
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

  const fetchCountries = async () => {
    const res = await fetch("http://localhost:5000/countries");
    const data = await res.json();
    setCountries(data);
  };

  const fetchStates = async (countryId: number) => {
    if (!countryId) {
      setStates([]);
      return;
    }
    const res = await fetch(`http://localhost:5000/states/state-list`,{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({countryId}),

    });
    const data = await res.json();
    setStates(data);
  };

  const fetchCities = async (stateId: number) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    const res = await fetch(`http://localhost:5000/cities/city-list`,{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({stateId}),
    });
    const data = await res.json();
    setCities(data);
  };

  // ---------------------- FORM HANDLERS ----------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    if (name === "country_id") {
      setForm({ ...form, country_id: numValue, state_id: undefined, city_id: undefined });
      setCities([]);
      fetchStates(numValue);
    } else if (name === "state_id") {
      setForm({ ...form, state_id: numValue, city_id: undefined });
      fetchCities(numValue);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `http://localhost:5000/employees/${editingId}`
      : "http://localhost:5000/employees";

    const payload = { ...form };
    delete (payload as any).role;
    delete (payload as any).country;
    delete (payload as any).state;
    delete (payload as any).city;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchEmployees();
    setView("list");
  };

  const resetForm = () => {
    setForm({
      name: "",
      role_id: 1,
      country_id: 101,
      state_id: undefined,
      city_id: undefined,
      email: "",
      phone: "",
      address: "",
      status: 1,
      password: "",
      salary: 0,
      totalLogin: 0,
    });
    setEditingId(null);
    setStates([]);
    setCities([]);
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      ...emp,
      role_id: emp.role?.id || 1,
      country_id: emp.country?.id || 101,
      state_id: emp.state?.id,
      city_id: emp.city?.id,
    });

    if (emp.country?.id) fetchStates(emp.country.id);
    if (emp.state?.id) fetchCities(emp.state.id);

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
    resetForm();
    setView("form");
  };

  // ---------------------- RENDER ----------------------

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

      {view === "list" ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 font-bold text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <i className="bi bi-person-plus" style={{ fontSize: "20px" }}></i>
              Add New Employee
            </button>
          </div>

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
                  <td className="border p-2">{emp.country?.name}</td>
                  <td className="border p-2">{emp.state?.name}</td>
                  <td className="border p-2">{emp.city?.name}</td>
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
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id!)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800"
                    >
                      <i className="bi bi-trash3"></i>
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

          {/* Role Dropdown */}
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

          {/* Country Dropdown */}
          <select
            id="country_id"
            name="country_id"
            value={form.country_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Country --</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            id="state_id"
            name="state_id"
            value={form.state_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={!states.length}
          >
            <option value="">-- Select State --</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>

          {/* City Dropdown */}
          <select
            id="city_id"
            name="city_id"
            value={form.city_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={!cities.length}
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
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
