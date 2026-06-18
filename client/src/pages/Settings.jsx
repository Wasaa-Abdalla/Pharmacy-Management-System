import { useState } from "react";

export default function Settings() {
  const [envVars, setEnvVars] = useState({
    apiUrl: "https://api.example.com",
    dbConnection: "postgres://user:pass@localhost:5432/pharmacy",
  });

  const [mailConfig, setMailConfig] = useState({
    smtpServer: "smtp.example.com",
    port: 587,
    username: "admin@example.com",
    password: "",
  });

  const [jwtKeys, setJwtKeys] = useState({
    secret: "supersecretkey",
    expiry: "1h",
  });

  const handleSave = (section) => {
    alert(`${section} settings saved!`);
    // integrate with backend API to persist securely
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="mb-6">Manage system configuration here.</p>

      {/* Environment Variables */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={envVars.apiUrl}
            onChange={(e) => setEnvVars({ ...envVars, apiUrl: e.target.value })}
            placeholder="API URL"
          />
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={envVars.dbConnection}
            onChange={(e) =>
              setEnvVars({ ...envVars, dbConnection: e.target.value })
            }
            placeholder="Database Connection String"
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleSave("Environment Variables")}
        >
          Save Environment Variables
        </button>
      </div>

      {/* Mail Configuration */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Mail Configuration</h2>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={mailConfig.smtpServer}
            onChange={(e) =>
              setMailConfig({ ...mailConfig, smtpServer: e.target.value })
            }
            placeholder="SMTP Server"
          />
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={mailConfig.port}
            onChange={(e) =>
              setMailConfig({ ...mailConfig, port: e.target.value })
            }
            placeholder="Port"
          />
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={mailConfig.username}
            onChange={(e) =>
              setMailConfig({ ...mailConfig, username: e.target.value })
            }
            placeholder="Username"
          />
          <input
            type="password"
            className="border rounded px-2 py-1"
            value={mailConfig.password}
            onChange={(e) =>
              setMailConfig({ ...mailConfig, password: e.target.value })
            }
            placeholder="Password"
          />
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => handleSave("Mail Configuration")}
        >
          Save Mail Config
        </button>
      </div>

      {/* JWT Keys */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">JWT Keys</h2>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={jwtKeys.secret}
            onChange={(e) =>
              setJwtKeys({ ...jwtKeys, secret: e.target.value })
            }
            placeholder="JWT Secret"
          />
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={jwtKeys.expiry}
            onChange={(e) =>
              setJwtKeys({ ...jwtKeys, expiry: e.target.value })
            }
            placeholder="Expiry (e.g., 1h, 7d)"
          />
        </div>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => handleSave("JWT Keys")}
        >
          Save JWT Keys
        </button>
      </div>
    </div>
  );
}
