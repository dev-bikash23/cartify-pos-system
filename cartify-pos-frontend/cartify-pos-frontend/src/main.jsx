import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from '@/context/hook/SidebarProvider'; 
import { Provider } from "react-redux";
import globalState from "./Redux Toolkit/globalState.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <Provider store={globalState}>
        <App />
        </Provider>
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>
);