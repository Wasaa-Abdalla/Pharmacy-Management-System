import { useContext, useState } from "react";
import { SalesContext } from "../context/SalesContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SalesHistory() {
  const { current_user } = useContext(AuthContext);
  const { sales, loading } = useContext(SalesContext);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  // Filter sales by receiptId, cashier name, or product name
  const filteredSales = Array.isArray(sales)
    ? sales.filter((sale) => {
        const search = filter.toLowerCase();
        return (
          sale.id.toLowerCase().includes(search) ||
          (current_user &&
            `${current_user.fname} ${current_user.lname}`
              .toLowerCase()
              .includes(search)) ||
          sale.items.some((i) =>
            i.product.toLowerCase().includes(search)
          )
        );
      })
    : [];

  const handleViewReceipt = (saleId) => {
    // Navigate to a dedicated receipt page
    navigate(`/receipt/${saleId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales History</h1>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by Receipt ID, Cashier, or Product..."
        className="border rounded px-2 py-1 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading ? (
        <p>Loading sales...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Receipt ID</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Cashier</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="border px-4 py-2">{sale.id}</td>
                  <td className="border px-4 py-2">
                    {new Date(sale.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}{" "}
                    {new Date(sale.date).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    {current_user
                      ? `${current_user.fname} ${current_user.lname}`
                      : "Cashier"}
                  </td>
                  <td className="border px-4 py-2">
                    {sale.items
                      .map((i) => `${i.product} (${i.quantity})`)
                      .join(", ")}
                  </td>
                  <td className="border px-4 py-2">KES {sale.total_amount}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleViewReceipt(sale.id)}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
