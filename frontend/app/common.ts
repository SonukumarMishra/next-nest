// utils/common.ts

// ---------- Shared Interfaces ----------
export interface Role {
  id: number;
  name: string;
}

export interface EmployeeRole {
  id: number;
  name: string;
  totalEmployee?:number;
}

export interface Country {
  id: number;
  name: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}

export interface Employee {
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
  image?: string;
  password?: string;
  createdDate?: string;
  salary?: number;
  totalLogin?: number;
}

// ---------- API Helper ----------
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

  // if (!res.ok) {
  //   throw new Error(`HTTP error! Status: ${res.status}`);
  // }

  return res.json();
};

// ---------- Common Data Fetchers ----------
export const fetchCountries = () => apiFetch(`${API_BASE}/countries`);
export const fetchEmployeeRole = () => apiFetch(`${API_BASE}/roles/get-employee-count-by-role`);

export const fetchStates = (countryId: number) =>
  apiFetch(`${API_BASE}/states/state-list`, {
    method: "POST",
    body: { countryId },
  });

export const fetchCities = (stateId: number) =>
  apiFetch(`${API_BASE}/cities/city-list`, {
    method: "POST",
    body: { stateId },
  });

// ---------- Default Form ----------
export const defaultEmployeeForm: Employee = {
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
};
