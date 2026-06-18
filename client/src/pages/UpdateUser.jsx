import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function UpdateUser() {
  const { id } = useParams();
  const { fetchUserById, fetchUserTypes, userTypes, updateUser, isSubmitting } = useContext(UserContext);

const [formData, setFormData] = useState({
  username: "",
  fname: "",
  lname: "",
  email: "",
  userType: "",
});

useEffect(() => {
  const loadUser = async () => {
    try {
      const user = await fetchUserById(id);
      setFormData((prev) => ({
        ...prev, // keep any edits
        username: user.username,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        userType: user.userType || "",
      }));
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };
  loadUser();
  fetchUserTypes();
  // run only once on mount
}, [id]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(id, formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <section className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Update User</h1>

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

          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select User Type</option>
            {userTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded bg-slate-900 text-white py-2 font-semibold ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700"
            }`}
          >
            {isSubmitting ? "Updating User..." : "Update User"}
          </button>
        </form>
      </section>
    </div>
  );
}
