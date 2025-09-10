import React from "react";
import { FaBolt, FaTools, FaExclamationTriangle, FaPhoneAlt } from "react-icons/fa";

const safetyProtocols = [
  {
    text: "In case of a short circuit, immediately switch off the main power supply to the affected room.",
    icon: <FaBolt />
  },
  {
    text: "For overloads, unplug high-power devices and wait before restarting them.",
    icon: <FaBolt />
  },
  {
    text: "Always identify the faulty component through the monitoring system before taking any action.",
    icon: <FaTools />
  },
  {
    text: "Avoid touching any electrical equipment during a fault until it's marked as resolved.",
    icon: <FaExclamationTriangle />
  },
  {
    text: "Notify all occupants when a fault is detected to prevent accidental contact.",
    icon: <FaExclamationTriangle />
  },
  {
    text: "Call a certified electrician for any repairs — do not attempt DIY fixes.",
    icon: <FaPhoneAlt />
  },
  {
    text: "Ensure your smart monitor is connected to a backup power source for uninterrupted fault alerts.",
    icon: <FaBolt />
  },
  {
    text: "Label all circuit breakers with corresponding rooms and components.",
    icon: <FaTools />
  },
  {
    text: "Keep emergency contact numbers (electrician, fire services) easily accessible.",
    icon: <FaPhoneAlt />
  },
  {
    text: "Regularly inspect system status via the dashboard to detect early warning signs.",
    icon: <FaTools />
  }
];

const SafetyProtocols = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-300">
        ⚡ Smart Monitoring Safety Protocols ⚠️
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {safetyProtocols.map((protocol, index) => (
          <li
            key={index}
            className="flex items-start space-x-4 p-5 bg-gray-700/40 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-700/70"
          >
            <span className="text-red-400 text-2xl">{protocol.icon}</span>
            <p className="text-gray-200 leading-relaxed">{protocol.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SafetyProtocols;
