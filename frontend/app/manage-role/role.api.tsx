import { Role } from "./role.types";

const BASE_URL = "http://localhost:5000/roles";

export const getRoles = async (): Promise<Role[]> => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const createRole = async (data: Role) => {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateRole = async (id: number, data: Role) => {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteRole = async (id: number) => {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};

export const changeRoleStatus = async (id: number, status: number) => {
  return fetch(`${BASE_URL}/change-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
};
