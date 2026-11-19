import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">🔒</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>

        <p className="text-gray-600 mb-6">
          Sorry! You are not authorized to access this page. Please login with
          an authorized account.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
