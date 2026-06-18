import { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";

export default function AddProduct() {
  const { addProduct, units, categories } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    reorderLevel: "",
    categoryId: "",
    baseUnitId: "",
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
      await addProduct({
        ...formData,
        reorderLevel: parseInt(formData.reorderLevel, 10),
      });
      setFormData({
        name: "",
        sku: "",
        description: "",
        reorderLevel: "",
        categoryId: "",
        baseUnitId: "",
      });
    } catch (err) {
      // error already handled in context
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="reorderLevel"
          type="number"
          value={formData.reorderLevel}
          onChange={handleChange}
          placeholder="Reorder Level"
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* Category dropdown */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Base Unit dropdown */}
        <select
          name="baseUnitId"
          value={formData.baseUnitId}
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

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
