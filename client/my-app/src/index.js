import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/redux";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // Importing ReactDOM for compatibility

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
