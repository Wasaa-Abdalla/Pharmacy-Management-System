import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { api_url } from "../config.json";
import { useNavigate } from "react-router-dom";

function RegisterAdmin() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await axios.post(`${api_url}/users/admin`, formData);
    nav("/login", { state: { successMessage: "Admin registered successfully!" } });

    setFormData({
      username: "",
      fname: "",
      lname: "",
      email: "",
      password: "",
    });
  } catch (err) {
    console.error("Failed to register admin", err);
    toast.error(err.response?.data?.error || "Failed to register admin");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="mx-auto max-w-md w-full">
        <h1 className="text-3xl font-bold text-slate-900">Register Admin</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label htmlFor="fname" className="block text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              id="fname"
              name="fname"
              type="text"
              value={formData.fname}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <label htmlFor="lname" className="block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              id="lname"
              name="lname"
              type="text"
              value={formData.lname}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Enter last name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default RegisterAdmin;
