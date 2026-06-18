import { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  const navigate = useNavigate();

  const { products, loading, deleteProduct } = useContext(ProductContext);

  // Compute total stock per product
  const productRows = products.map((p) => {
    const totalStock = p.stocks.reduce((sum, s) => sum + s.quantity, 0);
    const suppliers = [...new Set(p.stocks.map((s) => s.supplierName))];

    return {
      ...p,
      totalStock,
      suppliers,
    };
  });

  const filteredProducts = productRows.filter((p) => {
    return (
      (categoryFilter ? p.category === categoryFilter : true) &&
      (supplierFilter ? p.suppliers.includes(supplierFilter) : true)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <p className="mb-6">Manage your pharmacy inventory here.</p>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border rounded px-2 py-1"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Filter by Category</option>
          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        >
          <option value="">Filter by Supplier</option>
          {[...new Set(productRows.flatMap((p) => p.suppliers))].map((sup) => (
            <option key={sup} value={sup}>{sup}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">SKU</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Total Stock</th>
              <th className="border px-4 py-2">Suppliers</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="border px-4 py-2">{p.name}</td>
                <td className="border px-4 py-2">{p.sku}</td>
                <td className="border px-4 py-2">{p.category}</td>
                <td className="border px-4 py-2">{p.totalStock}</td>
                <td className="border px-4 py-2">
                  {p.suppliers.length > 0 ? p.suppliers.join(", ") : "-"}
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <button 
                  onClick={() => navigate(`/update-product/${p.id}`)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button 
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                    Delete
                  </button>
                  <button 
                  onClick={() => navigate(`/product-stocks/${p.id}`)}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                    Manage Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Product */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/add-product")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}
