import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { current_user } = useContext(AuthContext);
  const [reportsOpen, setReportsOpen] = useState(false);

  const hasRole = (roleName) => {
    return current_user?.roles?.some((r) => r.name === roleName);
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Pharmacy PMS
      </div>
      <nav className="flex-1 p-2">
        {current_user && current_user.id ? (
          <>
            <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Dashboard
            </Link>

            {hasRole("Manage Stock") && (
              <Link to="/inventory" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Inventory
              </Link>
            )}

            {hasRole("Manage Sales") && (
              <Link to="/sales" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Sales
              </Link>
            )}

            {hasRole("Manage Users") && (
              <Link to="/users" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Users
              </Link>
            )}

            {/* Reports Dropdown */}
            {hasRole("View Reports") && (
              <div>
                <button
                  onClick={() => setReportsOpen(!reportsOpen)}
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded flex justify-between items-center"
                >
                  Reports
                  <span>{reportsOpen ? "▲" : "▼"}</span>
                </button>
                {reportsOpen && (
                  <div className="ml-4">
                    <Link to="/sales-report" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Sales Report
                    </Link>
                    <Link to="/stock-report" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Stock Usage
                    </Link>
                    <Link to="/profitloss-report" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Profit & Loss
                    </Link>
                  </div>
                )}
              </div>
            )}

            {hasRole("Manage Settings") && (
              <Link to="/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Settings
              </Link>
            )}
          </>
        ) : (
          <Link to="/home" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Home
          </Link>
        )}
      </nav>
    </div>
  );
}
