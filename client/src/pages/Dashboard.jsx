import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const api_url = config.api_url;
  const navigate = useNavigate();

  // State for KPIs
  const [todaySales, setTodaySales] = useState(0);
  const [stockAlerts, setStockAlerts] = useState(0);
  const [expiringDrugs, setExpiringDrugs] = useState(0);

  // State for charts
  const [salesTrend, setSalesTrend] = useState([]);
  const [inventoryLevels, setInventoryLevels] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch KPI data
        const [dailySalesRes, stockAlertsRes, expiringRes] = await Promise.all([
          axios.get(`${api_url}/reports/sales/daily`),
          axios.get(`${api_url}/reports/stock-alerts`),
          axios.get(`${api_url}/reports/expiring`),
        ]);

        // Today’s Sales → last entry in daily sales
        const dailySales = dailySalesRes.data;
        if (Array.isArray(dailySales) && dailySales.length > 0) {
          setTodaySales(dailySales[dailySales.length - 1].total_sales);
        }

        // Stock Alerts → count of low stock items
        setStockAlerts(Array.isArray(stockAlertsRes.data) ? stockAlertsRes.data.length : 0);

        // Expiring Drugs → count of expiring batches
        setExpiringDrugs(Array.isArray(expiringRes.data) ? expiringRes.data.length : 0);

        // Fetch charts
        const [weeklySalesRes, inventoryRes] = await Promise.all([
          axios.get(`${api_url}/reports/sales/weekly`),
          axios.get(`${api_url}/reports/stock`),
        ]);

        setSalesTrend(weeklySalesRes.data); // [{period, total_sales}, ...]
        setInventoryLevels(inventoryRes.data); // [{product, stock_quantity}, ...]
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboardData();
  }, [api_url]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome to the Pharmacy Management System dashboard.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Today’s Sales</h2>
          <p className="text-2xl font-bold text-green-600">KES {todaySales}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Stock Alerts</h2>
          <p className="text-2xl font-bold text-red-600">{stockAlerts} Items</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Expiring Drugs</h2>
          <p className="text-2xl font-bold text-yellow-600">{expiringDrugs} Items</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Sales Trends</h2>
          <Line
            data={{
              labels: salesTrend.map((d) => d.period),
              datasets: [
                {
                  label: "Sales (KES)",
                  data: salesTrend.map((d) => d.total_sales),
                  borderColor: "rgba(75,192,192,1)",
                  fill: false,
                },
              ],
            }}
          />
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Inventory Levels</h2>
          <Bar
            data={{
              labels: inventoryLevels.map((i) => i.product),
              datasets: [
                {
                  label: "Stock",
                  data: inventoryLevels.map((i) => i.stock_quantity),
                  backgroundColor: "rgba(153,102,255,0.6)",
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/add-product")}
          >
            Add Product
          </button>
          <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate("/sales")}
          >
            Record Sale
          </button>
        </div>
      </div>
    </div>
  );
}
