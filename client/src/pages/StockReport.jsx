import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function StockReport() {
  const api_url = config.api_url;
  const [stockUsage, setStockUsage] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`${api_url}/reports/stock`);
        setStockUsage(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch stock report", err);
      }
    };
    fetchStock();
  }, [api_url]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Usage Report", 14, 16);
    autoTable(doc, {
      head: [["product", "stock_quantity", "sold_quantity"]],
      body: stockUsage.map((row) => [row.product, row.stock_quantity, row.sold_quantity]),
    });
    doc.save("stock-usage-report.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(stockUsage);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Usage");
    XLSX.writeFile(workbook, "stock-usage-report.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Usage Report</h1>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Stock Quantity</th>
            <th className="border px-4 py-2">Sold Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stockUsage.length > 0 ? (
            stockUsage.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{row.product}</td>
                <td className="border px-4 py-2">{row.stock_quantity}</td>
                <td className="border px-4 py-2">{row.sold_quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 space-x-2">
        <button onClick={exportPDF} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
          Export PDF
        </button>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
          Export Excel
        </button>
      </div>
    </div>
  );
}
