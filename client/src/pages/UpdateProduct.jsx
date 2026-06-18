import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

export default function UpdateProduct() {
  const { id } = useParams(); // productId from route
  const { fetchProductById, updateProduct, categories, units } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    reorderLevel: "",
    categoryId: "",
    baseUnitId: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(id);
        setFormData({
          name: product.name,
          sku: product.sku,
          description: product.description,
          reorderLevel: product.reorderLevel,
          categoryId: categories.find(c => c.name === product.category)?.id || "",
          baseUnitId: units.find(u => u.name === product.baseUnit)?.id || "",
        });
      } catch {
        // error handled in context
      }
    };
    loadProduct();
  }, [id, fetchProductById, categories, units]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, {
        ...formData,
        reorderLevel: parseInt(formData.reorderLevel, 10),
      });
    } catch {
      // error handled in context
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Product</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
