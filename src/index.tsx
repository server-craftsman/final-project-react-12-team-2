import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Provider } from "react-redux";
import { store } from "./app/store"; // Ensure this is the correct path to your store

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement); // Create a root

root.render(
  <Provider store={store}>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </Provider>
);
