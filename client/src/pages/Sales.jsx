import { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { AuthContext } from "../context/AuthContext";
import { SalesContext } from "../context/SalesContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Sales() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [saleId, setSaleId] = useState(null);

  const { current_user } = useContext(AuthContext);
  const { products } = useContext(ProductContext);
  const { addSale, handlePrint, receiptRef } = useContext(SalesContext);
  const navigate = useNavigate();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add product to cart or increase quantity
  const addToCart = (product) => {
    const price = product.stocks.length > 0 ? product.stocks[0].sellingPrice : 0;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, price, quantity: 1 }];
    });
  };

  // Increase quantity
  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Checkout
  const checkout = async () => {
    const total_amount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const res = await addSale({ total_amount, items });
      setSaleId(res.id);
      toast.success("Sale recorded successfully!");
      setShowInvoice(true);
    } catch (err) {
      toast.error("Failed to record sale");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      <p className="mb-6">Point of Sale interface for recording sales.</p>

      {/* POS Interface */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">POS Interface</h2>
        <input
          type="text"
          placeholder="Search product..."
          className="border rounded px-2 py-1 mb-4 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="border rounded p-2 flex justify-between items-center"
            >
              <span>
                {p.name} - KES{" "}
                {p.stocks.length > 0 ? p.stocks[0].sellingPrice : "N/A"}
              </span>
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                onClick={() => addToCart(p)}
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Cart */}
        <h3 className="text-md font-semibold mb-2">Cart</h3>
        <ul className="mb-4">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {item.name} - KES {item.price} × {item.quantity}
              </span>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => decreaseQty(item.id)}
                >
                  -
                </button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => increaseQty(item.id)}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="font-bold mb-2">Total: KES {totalAmount}</p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>

  {/* Invoice / Receipt */}
      {showInvoice && (
        <div
          ref={receiptRef}
          className="bg-white shadow-lg rounded p-6 mb-6 max-w-md mx-auto border"
        >
          {/* Company Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-teal-700">LATE NIGHT CHEMIST</h2>
            <p className="text-gray-500 text-sm">Professional Health & Pharmacy Services</p>
          </div>

          {/* Receipt Info */}
          <div className="mb-4 border-b pb-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Receipt ID:</span> {saleId}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date:</span>{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })}{" "}
              {new Date().toLocaleTimeString("en-GB", {
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
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-2 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>KES {item.price * item.quantity}</span>
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

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
              onClick={() => {
                setCart([]);
                setShowInvoice(false);
                setSaleId(null);
              }}
            >
              Close Receipt
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={handlePrint}
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}


      {/* History Button */}
      <div className="bg-white shadow rounded p-4">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => navigate("/sales-history")}
        >
          View Sales History
        </button>
      </div>
    </div>
  );
}
