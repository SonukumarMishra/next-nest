"use client";

import { deleteRole, changeRoleStatus } from "./role.api";

export default function RoleList({ roles, onEdit, reload }: any) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">#</th>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {roles.map((role: any, index: number) => (
          <tr key={role.id}>
            <td className="border p-2">{index + 1}</td>
            <td className="border p-2">{role.name}</td>

            <td className="border p-2">
              <button
                onClick={() =>
                  changeRoleStatus(role.id, role.status === 1 ? 0 : 1).then(
                    reload
                  )
                }
                className={`text-white px-3 py-1 rounded ${
                  role.status === 1 ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {role.status === 1 ? "Active" : "Inactive"}
              </button>
            </td>

            <td className="border p-2 flex gap-2">
              <button
                onClick={() => onEdit(role)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteRole(role.id).then(reload)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
