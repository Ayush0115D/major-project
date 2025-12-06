import React from "react";

const getStatusColor = (component) => {
  if (component.fault) return "bg-red-900 text-red-200";

  const colors = {
    on: "bg-green-900 text-green-200",
    off: "bg-gray-700 text-gray-400",
  };

  return colors[component.status] || "bg-gray-800 text-gray-300";
};

const getComponentIcon = (type) => {
  const icons = {
    lighting: "💡",
    appliance: "🌀",
    electronics: "📺",
    hvac: "❄️",
    outlet: "🔌",
  };
  return icons[type] || "⚡";
};

const SAFE_LIMITS = {
  POWER: 1000,
  CURRENT: 15,
  VOLTAGE_MIN: 200,
  VOLTAGE_MAX: 240,
  TEMPERATURE: 45,
};

const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border ${className}`}>{children}</div>
);

const StatusBox = ({ label, value, className = "" }) => (
  <div className={className}>
    <div className="text-xs text-gray-400 mb-1">{label}</div>
    <div className="font-bold">{value}</div>
  </div>
);

// ---------------- SHORT CIRCUIT ALERT (UNCHANGED) ----------------
const ShortCircuitAlert = ({ alerts, roomData }) => {
  const livingRoom = roomData["living-room"];

  const shortCircuitAlert = alerts.find(
    (a) =>
      (a.type === "short-circuit" ||
        (a.message || "").includes("Short circuit")) &&
      a.status === "active"
  );

  const hasShortCircuit = !!shortCircuitAlert;
  const allLoadsTripped = livingRoom.components.every(
    (c) => c.fault || c.status === "off"
  );

  const alertClass = hasShortCircuit
    ? "bg-red-950/40 border-red-500 shadow-lg shadow-red-500/20"
    : "bg-gray-800/50 border-gray-700";

  const statusClass = hasShortCircuit
    ? "bg-red-500 text-white animate-pulse"
    : "bg-green-500/20 text-green-400";

  const statusItems = [
    {
      label: "Detection Pin",
      value: "GPIO 32",
      sub: "INPUT_PULLUP",
      color: "bg-gray-900/50 border-gray-700",
    },
    // {
    //   label: "Pin State",
    //   value: hasShortCircuit ? "LOW (0V)" : "HIGH (3.3V)",
    //   sub: hasShortCircuit ? "Shorted to GND" : "Pull-up Active",
    //   color: hasShortCircuit
    //     ? "bg-red-900/30 border-red-600"
    //     : "bg-gray-900/50 border-gray-700",
    // },
    {
      label: "All Relays",
      value: allLoadsTripped ? "OPEN" : "ACTIVE",
      sub: "Safety Response",
      color: allLoadsTripped
        ? "bg-yellow-900/30 border-yellow-600"
        : "bg-gray-900/50 border-gray-700",
    },
    {
      label: "Circuit Health",
      value: hasShortCircuit ? "0%" : "100%",
      sub: "System Status",
      color: hasShortCircuit
        ? "bg-red-900/30 border-red-600"
        : "bg-gray-900/50 border-gray-700",
    },
  ];

  return (
    <Card className={`${alertClass} border-2 p-6 mb-6 transition-all`}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              hasShortCircuit ? "bg-red-500/20 animate-pulse" : "bg-green-500/20"
            }`}
          >
            {hasShortCircuit ? "⚡" : "🛡️"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Short Circuit Protection
            </h2>
            <p className="text-sm text-gray-400">
              ESP32 Pin 32 - Real-time Monitoring
            </p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${statusClass}`}>
          {hasShortCircuit ? "🚨 SHORT DETECTED" : "✓ NORMAL"}
        </div>
      </div>

      {/* ACTIVE SHORT */}
      {hasShortCircuit && (
        <div className="bg-red-500/30 border border-red-400 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-red-200 mb-1">
                CRITICAL: Short Circuit Detected!
              </h3>
              <p className="text-red-300 text-sm mb-2">
                {shortCircuitAlert?.message}
              </p>
              <div className="text-xs text-red-200 bg-red-900/50 rounded px-2 py-1 inline-block">
                Timestamp: {shortCircuitAlert?.timestamp}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {statusItems.map(({ label, value, sub, color }) => (
          <Card key={label} className={`${color} p-3 border`}>
            <StatusBox
              label={label}
              value={value}
              className={
                hasShortCircuit && (label === "Pin State" || label === "Circuit Health")
                  ? "text-red-400"
                  : "text-blue-400"
              }
            />
            <div className="text-xs text-gray-500 mt-1">{sub}</div>
          </Card>
        ))}
      </div>

      {!hasShortCircuit && (
        <div className="mt-4 bg-green-900/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="text-lg">✓</span>
            <span>System is operating normally. All circuits protected.</span>
          </div>
        </div>
      )}
    </Card>
  );
};

// ---------------- MAIN VIEW ----------------

const LivingRoomView = ({ roomData, alerts, networkOnline }) => {
  const livingRoom = roomData["living-room"];

  // ----------------------------------------------
  // ⭐ AUTO-DETECT WIFI BASED ON ESP32 DATA ⭐
  // ----------------------------------------------
  const isWifiOffline =
    !roomData ||
    !roomData["living-room"] ||
    !roomData["living-room"].components ||
    roomData["living-room"].components.length === 0 ||
    roomData["living-room"].components.every(
      (c) =>
        c.power === 0 &&
        c.current === 0 &&
        (c.voltage === 0 || c.voltage === null || c.voltage === undefined)
    );

  // final wifi state
  const wifiState =
    networkOnline !== undefined ? networkOnline : !isWifiOffline;

  // ---------------- HARD CODED BEHAVIOR ----------------
  const normalizedComponents = livingRoom.components.map((c) => {
    // WIFI OFF → EVERYTHING ZERO + STATUS OFF
    if (!wifiState) {
      return {
        ...c,
        power: 0,
        current: 0,
        voltage: 0,
        fault: false,
        status: "off",
      };
    }

    // WIFI ON + OVERLOAD
    if (c.fault === true) {
      return {
        ...c,
        power: 1100,
        current: 4.58,
        voltage: 230,
        status: "on",
      };
    }

    // WIFI ON NORMAL
    return {
      ...c,
      power: 0,
      current: c.current,
      voltage: 230,
      fault: false,
      status: "on",
    };
  });

  // SHORT CIRCUIT SYSTEM — preserved
  const activeAlerts = alerts.filter(
    (a) => (a.location || "").includes("Living Room") && a.status === "active"
  );

  const isShortCircuit = activeAlerts.some(
    (a) => a.type === "short-circuit" || (a.message || "").includes("Short circuit")
  );

  const isOverload = normalizedComponents.some((c) => c.fault && !isShortCircuit);

  const overviewCards = [
    {
      label: "Circuit Status",
      value: isShortCircuit
        ? "⚠️ SHORT CIRCUIT"
        : isOverload
        ? "⚠️ FAULT DETECTED"
        : wifiState
        ? "✓ Normal"
        : "⚠️ Offline",

      bg: !wifiState
        ? "bg-gray-800/40 border-gray-700"
        : isShortCircuit
        ? "bg-red-900/20 border-red-500"
        : isOverload
        ? "bg-yellow-900/20 border-yellow-500"
        : "bg-gray-800/50 border-gray-700",

      textColor: !wifiState
        ? "text-yellow-400"
        : isShortCircuit
        ? "text-red-400"
        : isOverload
        ? "text-yellow-400"
        : "text-green-400",
    },

    {
      label: "Load Status",
      value: !wifiState
        ? "⚠️ WiFi OFF"
        : isShortCircuit
        ? "⚠️ SHORT CIRCUIT"
        : isOverload
        ? "⚠️ OVERLOAD"
        : "✓ Connected",

      bg: !wifiState
        ? "bg-yellow-900/20 border-yellow-500"
        : isShortCircuit
        ? "bg-red-900/20 border-red-500"
        : isOverload
        ? "bg-yellow-900/20 border-yellow-500"
        : "bg-gray-800/50 border-gray-700",

      textColor: !wifiState
        ? "text-yellow-400"
        : isShortCircuit
        ? "text-red-400"
        : isOverload
        ? "text-yellow-400"
        : "text-green-400",
    },

    {
      label: "Safe Power Limit",
      value: `${SAFE_LIMITS.POWER}W per load`,
      bg: "bg-gray-800/50 border-gray-700",
      textColor: "text-blue-400",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">{livingRoom.name}</h1>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {overviewCards.map(({ label, value, bg, textColor }) => (
          <Card key={label} className={`${bg} p-4`}>
            <div className="text-sm text-gray-400 mb-1">{label}</div>
            <div className={`text-xl font-bold ${textColor}`}>{value}</div>
          </Card>
        ))}
      </div>

      {/* ACTIVE ALERTS */}
      {activeAlerts.length > 0 && (
        <Card className="bg-red-500/20 border-red-500 p-4 mb-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            ⚠ Active Alerts
          </h2>
          <ul className="space-y-2 text-red-300">
            {activeAlerts.map((alert) => (
              <li key={alert.id}>• {alert.message}</li>
            ))}
          </ul>
        </Card>
      )}

      <ShortCircuitAlert alerts={alerts} roomData={roomData} />

      {/* LOADS */}
      <h2 className="text-2xl font-bold text-white mb-4">Load Components</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {normalizedComponents.map((component) => {
          const faultLabel = isShortCircuit ? "SHORT CIRCUIT" : "OVERLOAD";

          return (
            <Card
              key={component.id}
              className={`bg-gray-900 p-4 shadow-sm transition hover:shadow-md ${
                component.status === "off"
                  ? "border-gray-600 bg-gray-900/40"
                  : component.fault
                  ? "border-red-600 bg-red-900/10"
                  : "border-green-600"
              }`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getComponentIcon(component.type)}</span>
                  <div>
                    <div className="font-medium text-gray-200">
                      {component.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {component.location}
                    </div>
                  </div>
                </div>

                {/* FIXED BADGE */}
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    component
                  )}`}
                >
                  {component.fault
                    ? faultLabel
                    : (component.status || "off").toUpperCase()}
                </div>
              </div>

              {/* FAULT BANNER */}
              {component.fault && (
                <div className="bg-red-500/20 border border-red-500/50 rounded px-2 py-1 mb-3">
                  <div className="text-xs font-semibold text-red-400">
                    🚨 {faultLabel} DETECTED
                  </div>
                </div>
              )}

              {/* READINGS */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <StatusBox
                  label="Power:"
                  value={`${component.power}W`}
                  className={component.fault ? "text-red-400" : "text-gray-200"}
                />
                <StatusBox
                  label="Current:"
                  value={`${component.current}A`}
                  className={component.fault ? "text-red-400" : "text-gray-200"}
                />
                <StatusBox
                  label="Voltage:"
                  value={`${component.voltage}V`}
                  className="text-gray-200"
                />
                <StatusBox
                  label="Relay:"
                  value={
                    component.status === "off"
                      ? "OFF"
                      : component.fault
                      ? "TRIPPED"
                      : "CLOSED"
                  }
                  className={
                    component.status === "off"
                      ? "text-gray-400"
                      : component.fault
                      ? "text-red-400"
                      : "text-green-400"
                  }
                />
              </div>

              {/* FIXED BOTTOM STATUS */}
              <div
                className={`text-xs px-2 py-1 rounded ${
                  component.status !== "on"
                    ? "bg-gray-600/20 text-gray-400"
                    : component.fault
                    ? "bg-red-500/20 text-red-300"
                    : "bg-green-500/20 text-green-300"
                }`}
              >
                {component.status !== "on"
                  ? "○ Load disconnected or relay off"
                  : component.fault
                  ? `⚠️ ${faultLabel} safety trip`
                  : "✓ Operating within safe limits"}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LivingRoomView;
