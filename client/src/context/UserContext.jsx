import { createContext, useState } from "react";
import { api_url } from "../config.json";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_url}/users`);
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (formData, resetForm) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${api_url}/usersByAdmin`, formData);
      resetForm();
      fetchUsers();
      navigate("/users", { state: { successMessage: res.data.success } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (id, formData) => {
    setIsSubmitting(true);
    try {
      const res = await axios.put(`${api_url}/users/${id}`, formData);
      fetchUsers();
      navigate("/users", { state: { successMessage: res.data.success } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

const deleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) {
    return; // stop if user cancels
  }

  try {
    const res = await axios.delete(`${api_url}/users/${id}`);
    toast.success(res.data.success);
    setUsers(users.filter((u) => u.id !== id));
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to delete user");
  }
};


  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`${api_url}/users/${id}`);
      return res.data; // return the user object
    } catch (err) {
      toast.error("Failed to fetch user");
      throw err;
    }
  };

const fetchUserTypes = async () => {
try {
    const res = await axios.get(`${api_url}/user_types`);
    setUserTypes(res.data);
} catch (err) {
    toast.error("Failed to fetch user types");
}
};

  const addRoleToUser = async (id, roleName) => {
    try {
      const res = await axios.post(`${api_url}/users/${id}/roles`, {
        roleName,
      });
      toast.success(res.data.success);
      return res.data.roles;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add role");
      throw err;
    }
  };

  const removeRoleFromUser = async (id, roleName) => {
    try {
      const res = await axios.delete(`${api_url}/users/${id}/roles/${roleName}`);
      toast.success(res.data.success);
      return res.data.roles;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove role");
      throw err;
    }
  };



const fetchRoles = async () => {
try {
    const res = await axios.get(`${api_url}/roles`);
    setRoles(res.data); // [{id, name}, ...]
} catch (err) {
    toast.error("Failed to fetch roles");
}
};


  const context_data = {
    users,
    userTypes,
    loading,
    isSubmitting,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    fetchUserById,
    fetchUserTypes,
    addRoleToUser,
    removeRoleFromUser,
    fetchRoles,
    roles

  };

  return (
    <UserContext.Provider value={context_data}>
      {children}
    </UserContext.Provider>
  );
};
