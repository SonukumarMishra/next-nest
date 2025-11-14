"use client";

interface LoaderOverlayProps {
  loading: boolean;
  message?: string;
}

export default function LoaderOverlay({ loading, message }: LoaderOverlayProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

      {/* Optional message */}
      <p className="text-white mt-4 text-lg font-medium">
        {message || "Loading..."}
      </p>
    </div>
  );
}
