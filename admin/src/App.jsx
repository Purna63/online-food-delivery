import React from "react";
import Navbar from "./components/Navbar/Navbar";//This is correct
import Sidebar from "./components/Sidebar/Sidebar";//this is correct
import { Routes, Route } from "react-router-dom";//this is correct
import Add from "./pages/Add/Add";//this is correct
import List from "./pages/List/List";//this is correct
import Orders from "./pages/Orders/Orders";//this is correct
import { ToastContainer } from "react-toastify";//this is correct
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const url = "http://localhost:4000"

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
