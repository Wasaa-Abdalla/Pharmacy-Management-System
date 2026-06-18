import { useContext, useEffect, useState } from "react";
import { SalesContext } from "../context/SalesContext";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewReceipt() {
  const { fetchReceipt } = useContext(SalesContext);
  const { current_user } = useContext(AuthContext);
  const { id } = useParams(); // receipt ID from URL
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const loadReceipt = async () => {
      const data = await fetchReceipt(id);
      setReceipt(data);
    };
    loadReceipt();
  }, [id]);

  if (!receipt) {
    return <p className="p-6">Loading receipt...</p>;
  }

  const totalAmount = receipt.total_amount;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded border">
      {/* Company Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-teal-700">LATE NIGHT CHEMIST</h2>
        <p className="text-gray-500 text-sm">Professional Health & Pharmacy Services</p>
      </div>

      {/* Receipt Info */}
      <div className="mb-4 border-b pb-2">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Receipt ID:</span> {receipt.id}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Date:</span>{" "}
          {new Date(receipt.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })}{" "}
          {new Date(receipt.date).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Served by:</span>{" "}
          {current_user ? `${current_user.fname} ${current_user.lname}` : "Cashier"}
        </p>
      </div>

      {/* Items */}
      <ul className="mb-4 divide-y">
        {receipt.items.map((item) => (
          <li key={item.product_id} className="flex justify-between py-2 text-sm">
            <span>
              {item.product} × {item.quantity}
            </span>
            <span>KES {item.quantity * 1 /* add price if available */}</span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="text-right mb-4">
        <p className="text-lg font-bold text-gray-800">
          Receipt Amount: KES {totalAmount}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t pt-2">
        <p>Thank you for shopping with us!</p>
        <p>Visit again for your health needs.</p>
      </div>

      {/* Back Button */}
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4 w-full"
        onClick={() => navigate("/sales-history")}
      >
        Back to Sales History
      </button>
    </div>
  );
}
