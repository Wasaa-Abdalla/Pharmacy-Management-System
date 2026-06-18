import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Access Denied
        </h1>
        <p className="text-slate-600 mb-6">
          You do not have the required permissions to view this page.  
          Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          to="/dashboard"
          className="inline-block rounded-md bg-slate-900 px-6 py-2 text-white font-semibold hover:bg-slate-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
