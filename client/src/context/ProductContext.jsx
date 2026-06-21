import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const api_url = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_url}/products`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${api_url}/base_units`);
      setUnits(res.data);
    } catch {
      toast.error("Failed to fetch units");
    }
  };

  const fetchProductCategories = async () => {
    try {
      const res = await axios.get(`${api_url}/product_categories`);
      setCategories(res.data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const addProduct = async (productData) => {
    try {
      const res = await axios.post(`${api_url}/products`, productData);
      toast.success("Product added successfully");
      fetchProducts();
      navigate("/inventory");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add product");
      throw err;
    }
  };

  const fetchProductById = async (id) => {
    try {
      const res = await axios.get(`${api_url}/products/${id}`);
      return res.data;
    } catch (err) {
      toast.error("Failed to fetch product");
      throw err;
    }
  };


  const updateProduct = async (id, productData) => {
    try {
      const res = await axios.put(`${api_url}/products/${id}`, productData);
      toast.success("Product updated successfully");
      fetchProducts();
      navigate("/inventory");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update product");
      throw err;
    }
  };

  // Delete product
const deleteProduct = async (id) => {
  try {
    await axios.delete(`${api_url}/products/${id}`);
    toast.success("Product deleted successfully");
    // Refresh product list
    fetchProducts();
  } catch (err) {
    console.error("Failed to delete product", err);
    toast.error(err.response?.data?.error || "Failed to delete product");
    throw err;
  }
};


  useEffect(() => {
    fetchProducts();
    fetchUnits();
    fetchProductCategories();
  }, []);

  const context_data = {
    products,
    units,
    categories,
    loading,
    fetchProducts,
    fetchUnits,
    fetchProductCategories,
    addProduct,
    fetchProductById,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={context_data}>
      {children}
    </ProductContext.Provider>
  );
};
