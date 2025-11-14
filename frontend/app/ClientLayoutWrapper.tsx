"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import Com from "./Header";
import { Toaster } from "react-hot-toast";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      {/* 👇 GLOBAL TOASTER (now it will work everywhere) */}
      <Toaster position="top-right" />

      {isLoggedIn && (
        <div className="row bg-cyan-700 py-4">
          <div className="container" style={{ width: "80%" }}>
            <Com />
          </div>
        </div>
      )}

      {children}

      <div className="row bg-cyan-700 py-4 fixed-bottom">
        <div className="container" style={{ width: "80%" }}>
          <Footer />
        </div>
      </div>
    </>
  );
}
