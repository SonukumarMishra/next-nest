"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Com() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedName = localStorage.getItem("userName");

    if (!loggedIn) {
      router.push("/");
    } else {
      setUserName(storedName);
    }
  }, [router]);

  return (
    <div className="row">
      <div className="col-lg-12 d-flex justify-content-between mb-3 mt-5">
        <button
          onClick={() => router.push("/manage-category")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Manage Category
        </button>
        <button
          onClick={() => router.push("/manage-role")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
        Manage Role
        </button>
        <button
          onClick={() => router.push("/manage-employee")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
        Manage Employee
        </button>
        <button
          onClick={() => router.push("/products/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
        <button
          onClick={() => router.push("/products/list")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Manage Products
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Logout
        </button>
        {userName && (
          <span className="ms-3 text-lg font-semibold">
            Welcome, {userName} 
          </span>
        )}
      </div>
    </div>
  );
}
