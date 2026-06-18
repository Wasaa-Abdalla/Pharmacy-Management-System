import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function Users() {
  const { id } = useParams();
  const { users, loading, deleteUser, fetchUsers } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUsers(); // fetch users on mount
  }, []);

  // show toast if successMessage exists
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      // clear state so toast doesn't repeat on refresh
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 100);
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <p className="mb-6">Manage system users and their roles.</p>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border-collapse border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Roles</th>
              <th className="border px-4 py-2">User Type</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-4 py-2">{u.username}</td>
                <td className="border px-4 py-2">{u.roles.join(", ")}</td>
                <td className="border px-4 py-2">{u.userType}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => navigate(`/view-user/${u.id}`)}
                  >
                    View-user
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => navigate(`/update-user/${u.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add User */}
      <div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate('/add-user')}
        >
          Add User
        </button>
      </div>
    </div>
  );
}
