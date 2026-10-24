import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import App from "./App.jsx";
import Watch from "./pages/Watch.jsx";
import Studio from "./pages/Studio.jsx";
import SignUp from "./pages/SignUp.jsx";
import "./styles.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="watch/:id" element={<Watch />} />
      <Route path="studio" element={<Studio />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);