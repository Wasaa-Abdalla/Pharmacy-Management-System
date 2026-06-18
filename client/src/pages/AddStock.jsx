import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StockContext } from "../context/StockContext";
import { ProductContext } from "../context/ProductContext";

export default function AddStock() {
  const { id : productId } = useParams();
  const { addStock } = useContext(StockContext);
  const { units, categories } = useContext(ProductContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productId,
    quantity: "",
    unitLevelId: "",
    batchNumber: "",
    expiryDate: "",
    supplierName: "",
    supplierPhone: "",
    requisitionReceipt: "",
    buyingPrice: "",
    sellingPrice: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStock(formData, productId);
      navigate(`/product-stocks/${productId}`);
    } catch {
      // error handled in context
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Stock</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="supplierName" value={formData.supplierName} onChange={handleChange} placeholder="Supplier Name" className="w-full border rounded px-3 py-2" required />
        <input name="supplierPhone" value={formData.supplierPhone} onChange={handleChange} placeholder="Supplier Phone" className="w-full border rounded px-3 py-2" required />
        <input name="batchNumber" value={formData.batchNumber} onChange={handleChange} placeholder="Batch Number" className="w-full border rounded px-3 py-2" required />
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border rounded px-3 py-2" required />
         <input name="requisitionReceipt" value={formData.requisitionReceipt} onChange={handleChange} placeholder="Requisition Receipt" className="w-full border rounded px-3 py-2" />
         <select
          name="unitLevelId"
          value={formData.unitLevelId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Base Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        {/* <input name="unitLevelId" value={formData.unitLevelId} onChange={handleChange} placeholder="Unit Level UUID" className="w-full border rounded px-3 py-2" required /> */}
        <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry Date" className="w-full border rounded px-3 py-2" required />
        <input name="buyingPrice" type="number" value={formData.buyingPrice} onChange={handleChange} placeholder="Buying Price" className="w-full border rounded px-3 py-2" required />
        <input name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} placeholder="Selling Price" className="w-full border rounded px-3 py-2" required />

        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Add Stock
        </button>
      </form>
    </div>
  );
}
