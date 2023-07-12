import React from "react";
import { Routes, Route } from "react-router-dom";
import Map from "./pages/Map";
import FlowPop from "./pages/FlowPop";

const Router = () => {
  return (
    <Routes>
      <Route index path="/" element={<Map />} />
      <Route index path="/flow" element={<FlowPop />} />
    </Routes>
  );
};

export default Router;
