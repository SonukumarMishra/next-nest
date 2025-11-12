"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import Com from "./Header";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 👇 Check login status initially
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Run once on mount

    // 👇 Listen for login/logout changes in localStorage
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // 👇 Redirect if logged out
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      {/* ✅ Show Header only when logged in */}
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
