import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ProfitLossReport() {
  const api_url = config.api_url;
  const [profitLoss, setProfitLoss] = useState([]);

  useEffect(() => {
    const fetchProfitLoss = async () => {
      try {
        const res = await axios.get(`${api_url}/reports/profit-loss`);
        setProfitLoss(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch profit & loss report", err);
      }
    };
    fetchProfitLoss();
  }, [api_url]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Profit & Loss Report", 14, 16);
    autoTable(doc, {
      head: [["product", "revenue", "cost", "profit"]],
      body: profitLoss.map((row) => [row.product, row.revenue, row.cost, row.profit]),
    });
    doc.save("profit-loss-report.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(profitLoss);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profit & Loss");
    XLSX.writeFile(workbook, "profit-loss-report.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profit & Loss Report</h1>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Revenue</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Profit</th>
          </tr>
        </thead>
        <tbody>
          {profitLoss.length > 0 ? (
            profitLoss.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{row.product}</td>
                <td className="border px-4 py-2">{row.revenue}</td>
                <td className="border px-4 py-2">{row.cost}</td>
                <td className="border px-4 py-2">{row.profit}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">
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
