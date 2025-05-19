import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Orders.css";

// const socket = io("http://localhost:4000");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(BACKEND_URL);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const getDeletedOrderIds = () =>
    JSON.parse(localStorage.getItem("deletedOrderIds")) || [];

  const saveDeletedOrderIds = (ids) =>
    localStorage.setItem("deletedOrderIds", JSON.stringify(ids));

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      // const response = await fetch("http://localhost:4000/api/order", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      const response = await fetch(`${BACKEND_URL}/api/order`, {
  headers: { Authorization: `Bearer ${token}` },
});

      if (!response.ok) throw new Error("Server responded with error");

      const data = await response.json();
      const paidOrders = Array.isArray(data)
        ? data.filter((order) => order.payment === true)
        : [];

      const deletedIds = getDeletedOrderIds();
      const filteredOrders = paidOrders.filter(
        (order) => !deletedIds.includes(order._id)
      );

      setOrders(filteredOrders);
    } catch (err) {
      console.error("🔥 Error while fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("orderStatusUpdated", (updatedOrder) => {
      const deletedIds = getDeletedOrderIds();
      if (deletedIds.includes(updatedOrder._id)) return;

      setOrders((prevOrders) => {
        const index = prevOrders.findIndex((o) => o._id === updatedOrder._id);
        if (index !== -1) {
          const updatedList = [...prevOrders];
          updatedList[index] = updatedOrder;
          return updatedList;
        } else {
          return [...prevOrders, updatedOrder];
        }
      });
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, []);

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const proceedDelete = () => {
    if (!confirmDeleteId) return;

    const updatedOrders = orders.filter(
      (order) => order._id !== confirmDeleteId
    );
    setOrders(updatedOrders);

    const deletedIds = getDeletedOrderIds();
    if (!deletedIds.includes(confirmDeleteId)) {
      deletedIds.push(confirmDeleteId);
      saveDeletedOrderIds(deletedIds);
    }

    console.log("🗑️ Order removed (frontend only):", confirmDeleteId);
    setConfirmDeleteId(null);
  };

  if (loading) return <div className="orders">Loading orders...</div>;
  if (error) return <div className="orders">{error}</div>;

  return (
    <div className="orders">
      <h2>Your Orders</h2>

      {confirmDeleteId && (
        <div className="confirm-popup">
          <div className="confirm-box">
            <p>This will remove the order from your side only. Are you sure?</p>
            <div className="confirm-actions">
              <button className="yes-btn" onClick={proceedDelete}>
                Yes
              </button>
              <button className="no-btn" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="orders-empty">No paid orders found.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Items</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td data-label="S.No.">{index + 1}</td>
                <td data-label="Items">
                  {Array.isArray(order.items) &&
                    order.items.map((item, i) => (
                      <div key={i}>
                        {item.name} = {item.quantity}
                      </div>
                    ))}
                </td>
                <td data-label="Date">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td data-label="Amount">₹{order.amount}</td>
                <td data-label="Status">{order.status || "Pending"}</td>
                <td data-label="Action">
                  <button
                    className="remove-btn"
                    onClick={() => confirmDelete(order._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;

