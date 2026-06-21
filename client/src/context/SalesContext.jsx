import { createContext, useState, useRef , useEffect } from "react";
import axios from "axios";

export const SalesContext = createContext();

export function SalesProvider({ children }) {
  const api_url = import.meta.env.VITE_API_URL;
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null)

  // Fetch all sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api_url}/sales`);
      setSales(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new sale
const addSale = async (saleData) => {
  try {
    setError(null);
    setLoading(true);
    const res = await axios.post(`${api_url}/sales`, saleData);
    await fetchSales();
    return res.data;
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



  // Update sale
  const updateSale = async (id, saleData) => {
    try {
      await axios.put(`${api_url}/sales/${id}`, saleData);
      await fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete sale
  const deleteSale = async (id) => {
    try {
      await axios.delete(`${api_url}/sales/${id}`);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch a single receipt by ID
const fetchReceipt = async (id) => {
  try {
    const res = await axios.get(`${api_url}/sales/${id}`);
    return res.data;
  } catch (err) {
    setError(err.message);
    return null;
  }
};


  // Print Receipt
    const handlePrint = () => {
    if (receiptRef.current) {
      // open print dialog for the receipt section only
      const printContents = receiptRef.current.innerHTML;
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { color: teal; }
              .receipt { max-width: 500px; margin: auto; }
              .items { border-top: 1px solid #ccc; margin-top: 10px; padding-top: 10px; }
              .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="receipt">${printContents}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

    const context_data = {
        sales, 
        loading, 
        error,
        receiptRef, 
        fetchSales, 
        addSale, 
        updateSale, 
        deleteSale,
        handlePrint,
        fetchReceipt

  };

  return (
    <SalesContext.Provider
      value={context_data}
    >
      {children}
    </SalesContext.Provider>
  );
}
