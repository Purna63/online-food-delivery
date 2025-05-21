import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Orders.css";

const socket = io("https://online-food-delivery-backend-l3oq.onrender.com");

const STATUS_OPTIONS = [
  "Pending",
  "Accepted",
  "Cooking",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/api/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, [url]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${url}/api/order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated.order : o))
      );

      socket.emit("orderStatusUpdated", updated.order);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = (id) => {
    setDeletingOrderId(id);
    setConfirmationMessage("Are you sure you want to remove this order?");
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/api/order/${deletingOrderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.filter((order) => order._id !== deletingOrderId)
        );
        setConfirmationMessage("");
        setDeletingOrderId(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setConfirmationMessage("Failed to delete the order.");
    }
  };

  const cancelDelete = () => {
    setConfirmationMessage("");
    setDeletingOrderId(null);
  };

  const handleTrack = (address) => {
    const origin = "RahamaMarket";
    const destination = `${address.street}, ${address.city}, ${address.landmark}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="orders">
      <h2>User Orders</h2>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="orders empty">
          <p>No orders found.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date/Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>
                  {order.address.firstName} {order.address.lastName}
                </td>
                <td>{order.address.phone}</td>
                <td>
                  {order.address.street}, {order.address.city}, {order.address.landmark}
                </td>
                <td>{order.items.map((i) => i.name).join(", ")}</td>
                <td>₹{order.amount}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td className="action-buttons">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    Remove
                  </button>
                  <button
                    className="track-btn"
                    onClick={() => handleTrack(order.address)}
                  >
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirmationMessage && (
        <div className="confirmation-message">
          <p>{confirmationMessage}</p>
          <button onClick={confirmDelete}>Yes</button>
          <button className="cancel" onClick={cancelDelete}>
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
