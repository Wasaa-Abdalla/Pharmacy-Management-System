import { createContext, useState } from "react";
import { api_url } from "../config.json";
import { toast } from "react-hot-toast";
import axios from "axios";

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

   // Fetch all stocks for a given product
  const fetchProductStocks = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_url}/product_stocks/product/${productId}`);
      setStocks(res.data);
    } catch (err) {
      console.error("Failed to fetch product stocks", err);
      toast.error("Failed to fetch product stocks");
    } finally {
      setLoading(false);
    }
  };

  // Delete stock
  const deleteStock = async (stockId, productId) => {
    try {
      await axios.delete(`${api_url}/product_stocks/${stockId}`);
      toast.success("Stock deleted successfully");
      fetchProductStocks(productId); // refresh after delete
    } catch (err) {
      console.error("Failed to delete stock", err);
      toast.error(err.response?.data?.error || "Failed to delete stock");
    }
  };

  // Add new stock
  const addStock = async (stockData, productId) => {
    try {
      const res = await axios.post(`${api_url}/product_stocks`, stockData);
      toast.success("Stock added successfully");
      return res.data;
    } catch (err) {
      console.error("Failed to add stock", err);
      toast.error(err.response?.data?.error || "Failed to add stock");
      throw err;
    }
  };

  // Update stock
  const updateStock = async (stockId, stockData) => {
    try {
      const res = await axios.put(`${api_url}/product_stocks/${stockId}`, stockData);
      toast.success("Stock updated successfully");
      return res.data;
    } catch (err) {
      console.error("Failed to update stock", err);
      toast.error(err.response?.data?.error || "Failed to update stock");
      throw err;
    }
  };

  // Fetch stock by ID
  const fetchStockById = async (stockId) => {
    try {
      const res = await axios.get(`${api_url}/product_stocks/${stockId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch stock", err);
      toast.error("Failed to fetch stock");
      throw err;
    }
  };

  const context_data = {
    stocks,
    loading,
    addStock,
    updateStock,
    fetchStockById,
    fetchProductStocks,
    deleteStock
  };

  return (
    <StockContext.Provider value={context_data}>
      {children}
    </StockContext.Provider>
  );
};
