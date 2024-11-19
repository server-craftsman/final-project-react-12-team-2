import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
} else {
  console.error("Root element not found. Ensure there is a div with id 'root' in your HTML.");
}
