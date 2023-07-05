import React from "react";
import { Routes, Route } from "react-router-dom";
import Map from "./pages/Map";

const Router = () => {
  return (
    <Routes>
      <Route index path="/" element={<Map />} />
    </Routes>
  );
};

export default Router;
