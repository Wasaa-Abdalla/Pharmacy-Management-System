import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { StockProvider } from "./context/StockContext";
import { UserProvider } from "./context/UserContext";
import { SalesProvider } from "./context/SalesContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import RegisterAdmin from "./pages/RegisterAdmin";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import StockReport from "./pages/StockReport";
import SalesReport from "./pages/SalesReport";
import ProfitLossReport from "./pages/ProfitLossReport";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ProductStocks from "./pages/ProductStocks";
import AddStock from "./pages/AddStock";
import UpdateStock from "./pages/UpdateStock";
import AddUser from "./pages/AddUser";
import UpdateUser from "./pages/UpdateUser";
import ViewUser from "./pages/Viewuser";
import SalesHistory from "./pages/SalesHistory";
import ViewReceipt from "./pages/ViewReceipt";


function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <StockProvider>
            <UserProvider>
              <SalesProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registerAdmin" element={<RegisterAdmin />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <RoleProtectedRoute>
                    <Dashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <RoleProtectedRoute requiredRole="Manage Stock">
                    <Inventory />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/add-product"
                element={
                  <RoleProtectedRoute requiredRole="Manage Stock">
                    <AddProduct />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/update-product/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Stock">
                    <UpdateProduct />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/product-stocks/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Stock">
                    <ProductStocks />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/add-stock/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Stock">
                    <AddStock />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/update-stock/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Stock">
                    <UpdateStock />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <RoleProtectedRoute requiredRole="Manage Sales">
                    <Sales />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/sales-History"
                element={
                  <RoleProtectedRoute requiredRole="Manage Sales">
                    <SalesHistory/>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/receipt/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Sales">
                    <ViewReceipt/>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/stock-report"
                element={
                  <RoleProtectedRoute requiredRole="View Reports">
                    <StockReport />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/sales-report"
                element={
                  <RoleProtectedRoute requiredRole="View Reports">
                    <SalesReport />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/profitloss-report"
                element={
                  <RoleProtectedRoute requiredRole="View Reports">
                    <ProfitLossReport />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <RoleProtectedRoute requiredRole="Manage Settings">
                    <Settings />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <RoleProtectedRoute requiredRole="Manage Users">
                    <Users />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/add-user"
                element={
                  <RoleProtectedRoute requiredRole="Manage Users">
                    <AddUser />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/view-user/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Users">
                    <ViewUser />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/update-user/:id"
                element={
                  <RoleProtectedRoute requiredRole="Manage Users">
                    <UpdateUser />
                  </RoleProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />

            </Routes>
          </main>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
        </SalesProvider>
        </UserProvider>
        </StockProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
