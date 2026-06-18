import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StockContext } from "../context/StockContext";
import { ProductContext } from "../context/ProductContext";

export default function ProductStocks() {
  const { id } = useParams(); // id from route
  const { stocks, loading, fetchProductStocks, deleteStock } = useContext(StockContext);
  const { fetchProductById } = useContext(ProductContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductStocks(id);
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data); // store product in state
      } catch (err) {
        navigate("/inventory"); // optional: redirect if product not found
      }
    };
    loadProduct();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Stocks</h1>
      <p className="mb-6">Manage stock batches for {product ? product.name : "Loading..."}.</p>

      {/* Add Stock */}
      <div className="mb-4">
        <button
          onClick={() => navigate(`/add-stock/${id}`)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Stock
        </button>
      </div>

      {loading ? (
        <p>Loading stocks...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Batch Number</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Expiry Date</th>
              <th className="border px-4 py-2">Supplier</th>
              <th className="border px-4 py-2">Buying Price</th>
              <th className="border px-4 py-2">Selling Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.batchNumber}</td>
                <td className="border px-4 py-2">{s.quantity}</td>
                <td className="border px-4 py-2">{s.expiryDate}</td>
                <td className="border px-4 py-2">
                  {s.supplierName} ({s.supplierPhone})
                </td>
                <td className="border px-4 py-2">{s.buyingPrice}</td>
                <td className="border px-4 py-2">{s.sellingPrice}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/update-stock/${s.id}`)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStock(s.id, id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
