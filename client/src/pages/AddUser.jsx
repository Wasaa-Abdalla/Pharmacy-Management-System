import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function AddUser() {
  const { addUser, fetchUserTypes, userTypes, isSubmitting } = useContext(UserContext);

  useEffect(() => {
  fetchUserTypes();
}, []);


  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    userType: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      username: "",
      fname: "",
      lname: "",
      email: "",
      password: "",
      userType: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData, resetForm);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <section className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Add New User</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select User Type</option>
            {userTypes.length === 0 ? (
                <option>Loading...</option>
              ) : (
                userTypes.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))
              )}

          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded bg-slate-900 text-white py-2 font-semibold ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700"
            }`}
          >
            {isSubmitting ? "Adding User..." : "Add User"}
          </button>
        </form>
      </section>
    </div>
  );
}
