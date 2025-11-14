"use client";

import { useEffect, useState } from "react";
import Com from "../Header";
import Footer from "../Footer";
 
import {
  Role,
  Country,
  State,
  City,
  Employee,
  fetchCountries,
  fetchStates,
  fetchCities,
  defaultEmployeeForm,
  apiFetch,
  API_BASE,
} from "../common";
import toast from "react-hot-toast";

// ---------------------- COMPONENT ----------------------
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


  // ---------------------- DATA FETCHING ----------------------
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [empRes, roleRes, countryRes] = await Promise.all([
      apiFetch(`${API_BASE}/employees`),
      apiFetch(`${API_BASE}/roles`),
      fetchCountries(),
    ]);
    setEmployees(empRes);
    setRoles(roleRes);
    setCountries(countryRes);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await apiFetch(`${API_BASE}/employees/${id}`, { method: "DELETE" });
      setEmployees(await apiFetch(`${API_BASE}/employees`));
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

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const method = editingId ? "PATCH" : "POST";
  //     const url = editingId
  //       ? `${API_BASE}/employees/${editingId}`
  //       : `${API_BASE}/employees`;

  //     const payload = { ...form };


  //     delete (payload as any).role;
  //     delete (payload as any).country;
  //     delete (payload as any).state;
  //     delete (payload as any).city;

  //     await apiFetch(url, { method, body: payload });

  //     resetForm();
  //     setEmployees(await apiFetch(`${API_BASE}/employees`));
  //     setView("list");
  //   };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${API_BASE}/employees/${editingId}`
      : `${API_BASE}/employees`;

    const formData = new FormData();

    // Append all normal fields
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Remove non-API fields
    formData.delete("role");
    formData.delete("country");
    formData.delete("state");
    formData.delete("city");

    await apiFetch(url, { method, body: formData });

    resetForm();
    setEmployees(await apiFetch(`${API_BASE}/employees`));
    setView("list");
  };

  const resetForm = () => {
    setForm(defaultEmployeeForm);
    setEditingId(null);
    setStates([]);
    setCities([]);
  };
  // const handleChangeStatus = async (id: number, status: number) => {
  //   await fetch(`http://localhost:5000/employees/change-status`, {
  //     method: "PATCH",
  //     headers: { "content-Type": "application/json" },
  //     body: JSON.stringify({ id, status }),
  //   });
  //   setEmployees(await apiFetch(`${API_BASE}/employees`));
  // }


  const handleChangeStatus = async (id: number, status: number) => {
  try {
    const res = await fetch(`http://localhost:5000/employees/change-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();

    if (data.status) {
      toast.success(data.message || "Status updated");
    } else {
      toast.error(data.message || "Failed to update status");
    }

    setEmployees(await apiFetch(`${API_BASE}/employees`));
  } catch (error) {
    toast.error("Something went wrong");
  }
};



  // Status change in select dropdown
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: Number(e.target.value) });
  };
  const handleRemoveImage = async (id: number) => {
    await fetch(`http://localhost:5000/employees/remove-image`, {
      method: "PATCH",
      body: JSON.stringify({ id, image: null }),
      headers: { "Content-Type": "application/json" },
    });
    setEmployees(await apiFetch(`${API_BASE}/employees`));
  };
  const handleEdit = (emp: Employee) => {
    setForm({
      ...emp,
      role_id: emp.role?.id || 1,
      country_id: emp.country?.id || 101,
      state_id: emp.state?.id,
      city_id: emp.city?.id,
    });

    if (emp.country?.id) {
      fetchStates(emp.country.id).then(setStates);

    };
    if (emp.state?.id) fetchCities(emp.state.id).then(setCities);

    setEditingId(emp.id || null);
    setView("form");
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
                <th className="border p-2">Image</th>
                <th className="border p-2">Status</th>
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
                  <td className="border p-2"> <button title="Change Status"
                    onClick={() => handleChangeStatus(emp.id!, emp.status === 1 ? 0 : 1)}
                    className={`text-white px-2 py-1 rounded ${emp.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >{emp.status === 1 ? 'Active' : 'Inactive'}</button></td>
                  <td className="border p-2 flex gap-2">
                    <button title="Edit"
                      onClick={() => handleEdit(emp)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button title="Delete"
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

          <div className="flex flex-col">
            <label htmlFor="image" className="font-medium mb-1">
              Category Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={handleImageChange}
              className="border p-2 rounded"
              accept="image/*"
            />
          </div>

          {!editingId && (
            < input name="password" placeholder="Password" type="password" onChange={handleChange}
              className="border p-2 rounded"
              required={!editingId}
            />
          )}

          <div className="flex flex-col">
            <label htmlFor="status" className="font-medium mb-1">
              Status
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
