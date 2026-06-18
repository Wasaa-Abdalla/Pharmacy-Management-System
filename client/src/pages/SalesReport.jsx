import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function SalesReport() {
  const api_url = config.api_url;
  const [salesData, setSalesData] = useState([]);
  const [filter, setFilter] = useState("daily");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`${api_url}/reports/sales/${filter}`);
        setSalesData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch sales report", err);
      }
    };
    fetchSales();
  }, [api_url, filter]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${filter} Sales Report`, 14, 16);
    autoTable(doc, {
      head: [["period", "total_sales"]],
      body: salesData.map((row) => [row.period, row.total_sales]),
    });
    doc.save(`${filter}-sales-report.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${filter} Sales`);
    XLSX.writeFile(workbook, `${filter}-sales-report.xlsx`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Report</h1>

      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Period</th>
            <th className="border px-4 py-2">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesData.length > 0 ? (
            salesData.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{row.period}</td>
                <td className="border px-4 py-2">{row.total_sales}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center py-4">
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
