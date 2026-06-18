import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StockContext } from "../context/StockContext";

export default function UpdateStock() {
  const { id: stockId } = useParams();
  const { fetchStockById, updateStock } = useContext(StockContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quantity: "",
    supplierName: "",
    supplierPhone: "",
  });

  useEffect(() => {
    const loadStock = async () => {
      try {
        const stock = await fetchStockById(stockId);
        setFormData({
          quantity: stock.quantity,
          supplierName: stock.supplierName,
          supplierPhone: stock.supplierPhone,
        });
      } catch {
        // error handled in context
      }
    };
    loadStock();
  }, [stockId, fetchStockById]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStock(stockId, {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
      });
      navigate(-1); // go back to ProductStocks page
    } catch {
      // error handled in context
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Stock</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border rounded px-3 py-2" required />
        <input name="supplierName" value={formData.supplierName} onChange={handleChange} placeholder="Supplier Name" className="w-full border rounded px-3 py-2" required />
        <input name="supplierPhone" value={formData.supplierPhone} onChange={handleChange} placeholder="Supplier Phone" className="w-full border rounded px-3 py-2" required />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Stock
        </button>
      </form>
    </div>
  );
}
