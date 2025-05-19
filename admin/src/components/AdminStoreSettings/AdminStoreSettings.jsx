import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminStoreSettings.css";

const AdminStoreSettings = ({ url }) => {
  const [storeStatus, setStoreStatus] = useState({
    openHour: 8,
    closeHour: 21,
    isManuallyClosed: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchStoreStatus = async () => {
    try {
      const res = await axios.get(`${url}/api/store-status`);
      setStoreStatus(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load store settings", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isManuallyClosed" && checked) {
      setShowConfirm(true);
      return; // wait for confirmation
    }

    setStoreStatus((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const confirmCloseStore = () => {
    setStoreStatus((prev) => ({
      ...prev,
      isManuallyClosed: true,
    }));
    setShowConfirm(false);
  };

  const cancelCloseStore = () => {
    setShowConfirm(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${url}/api/store-status`, storeStatus, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStoreStatus(res.data);
      setMessage("✅ Settings updated successfully!");
    } catch (err) {
      console.error("Failed to save settings", err);
      setMessage("❌ Failed to update settings");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    fetchStoreStatus();
  }, []);

  if (loading) return <div>Loading store settings...</div>;

  return (
    <div className="admin-store-settings">
      <h2>🛠️ Set Time Open/Closed</h2>

      <label>
        Open Hour:
        <input
          type="number"
          name="openHour"
          min="0"
          max="23"
          value={storeStatus.openHour}
          onChange={handleChange}
        />
      </label>

      <label>
        Close Hour:
        <input
          type="number"
          name="closeHour"
          min="0"
          max="23"
          value={storeStatus.closeHour}
          onChange={handleChange}
        />
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          name="isManuallyClosed"
          checked={storeStatus.isManuallyClosed}
          onChange={handleChange}
        />
        Manually Close Store
      </label>

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {message && <p className="status-message">{message}</p>}

      {/* Custom confirmation modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Confirm Manual Closure</h3>
            <p>Are you sure you want to manually close the store?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmCloseStore}>Yes, Close Store</button>
              <button className="cancel-btn" onClick={cancelCloseStore}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoreSettings;
