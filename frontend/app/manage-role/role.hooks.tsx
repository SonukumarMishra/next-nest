import { useEffect, useState } from "react";
import { Role } from "./role.types";
import { getRoles } from "./role.api";

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const loadRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return { roles, loadRoles };
};
