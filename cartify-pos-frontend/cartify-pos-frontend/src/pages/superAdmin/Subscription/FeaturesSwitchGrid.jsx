import React from "react";

const FEATURES_FIELDS = [
  { key: "enableAdvancedReport", label: "Advanced Reports" },
  { key: "enableInventory", label: "Inventory System" },
  { key: "enableIntegrations", label: "Integrations" },
  { key: "enableEcommerce", label: "eCommerce" },
  { key: "enableInvoiceBranding", label: "Invoice Branding" },
  { key: "prioritySupport", label: "Priority Support" },
  { key: "enableMultiLocation", label: "Multi-Location" },
];

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
      checked ? "bg-green-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const FeaturesSwitchGrid = ({ values, handleFeatureSwitch }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-lg p-4">
      {FEATURES_FIELDS.map((f) => (
        <div key={f.key} className="flex items-center justify-between">
          <span className="text-sm">{f.label}</span>
          <ToggleSwitch
            checked={!!values[f.key]}
            onChange={(val) => handleFeatureSwitch(f.key, val)}
          />
        </div>
      ))}
    </div>
  );
};

export { FEATURES_FIELDS };
export default FeaturesSwitchGrid;