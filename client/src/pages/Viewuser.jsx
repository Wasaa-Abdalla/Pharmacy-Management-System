import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ViewUser() {
  const { id } = useParams();
  const {
    fetchUserById,
    addRoleToUser,
    removeRoleFromUser,
    fetchRoles,
    roles,
  } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    loadUser();
    fetchRoles(); // load available roles
  }, [id, fetchUserById, fetchRoles]);

  const handleAddRole = async () => {
    if (!newRole) return;
    try {
      const updatedRoles = await addRoleToUser(id, newRole);
      setUser({ ...user, roles: updatedRoles });
      setNewRole("");
    } catch (err) {}
  };

  const handleRemoveRole = async (roleName) => {
    try {
      const updatedRoles = await removeRoleFromUser(id, roleName);
      setUser({ ...user, roles: updatedRoles });
    } catch (err) {}
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">User Details</h1>
      <div className="space-y-2 mb-6">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Name:</strong> {user.fname} {user.lname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User Type:</strong> {user.userType}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Roles</h2>
      <ul className="mb-4">
        {user.roles.length > 0 ? (
          user.roles.map((role) => (
            <li key={role} className="flex justify-between items-center border-b py-1">
              <span>{role}</span>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                onClick={() => handleRemoveRole(role)}
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <p>No roles assigned</p>
        )}
      </ul>

      <div className="flex gap-2 items-center">
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddRole}
        >
          Add Role
        </button>
      </div>
    </div>
  );
}
