import { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login, current_user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // NEW state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 100);
    }
  }, [location.state, navigate, location.pathname]);

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false); // stop loading regardless of success/failure
    }
  };

  if (current_user && current_user.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Login</h1>

        <form
          onSubmit={formSubmit}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading} // disable while loading
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white 
              ${loading ? "bg-slate-700 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-700"}`}
          >
            {loading ? "Logging..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
