import React from "react";
const getStatusColor = (status) => {
  switch (status) {
    case "on":
      return "bg-green-900 text-green-200";
    case "off":
      return "bg-gray-800 text-gray-300";
    case "in-use":
      return "bg-blue-900 text-blue-200";
    case "short-circuit":
      return "bg-red-900 text-red-200";
    default:
      return "bg-gray-800 text-gray-300";
  }
};

const getComponentIcon = (type) => {
  switch (type) {
    case "lighting":
      return "💡";
    case "appliance":
      return "🌀";
    case "electronics":
      return "📺";
    case "hvac":
      return "❄️";
    case "outlet":
      return "🔌";
    default:
      return "⚡";
  }
};

const LivingRoomView = ({ roomData, alerts }) => {
  const livingRoom = roomData["living-room"];
  const activeAlerts = alerts.filter(
    (a) => a.location.includes("Living Room") && a.status === "active"
  );

  // Set safe limit (you can change this number globally if needed)
  const SAFE_LIMIT = 1500;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">{livingRoom.name}</h1>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            ⚠ Active Alerts
          </h2>
          <ul className="space-y-2 text-red-300">
            {activeAlerts.map((alert) => (
              <li key={alert.id}>
                • {alert.message}
                {/* If alert is about power limit, also show safe limit */}
                {alert.message.includes("Power consumption exceeds safe limits") && (
                  <p className="text-sm text-gray-400 mt-1">
                    [  ⚠️ SAFE LIMIT: {SAFE_LIMIT}W  ]
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {livingRoom.components.map((component) => (
          <div
        key={component.id}
       className={`bg-gray-900 p-4 rounded-lg border shadow-sm transition hover:shadow-md ${
        component.status === "short-circuit"
      ? "border-red-600"
      : component.status === "on"
      ? "border-green-600"
      : "border-gray-700"
      }`}
      >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getComponentIcon(component.type)}</span>
                <div className="font-medium text-gray-200">{component.name}</div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  component.status
                )}`}
              >
                {component.status.toUpperCase()}
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-2">
              Type: {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Power:</span>
                <div className="font-medium text-gray-200">
                  {component.power}W
                </div>
              </div>
              <div>
                <span className="text-gray-500">Current:</span>
                <div
                  className={`font-medium ${
                    component.status === "short-circuit"
                      ? "text-red-400"
                      : "text-gray-200"
                  }`}
                >
                  {component.current}A
                </div>
              </div>
            </div>

            {component.location && (
              <div className="text-xs text-gray-500 mt-2">
                Location: {component.location}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivingRoomView;
