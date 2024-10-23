import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { Provider } from "react-redux";
import { store } from "./app/store"; // Ensure this is the correct path to your store

console.log("Store initialized:", store);

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root

  root.render(
    <Provider store={store}>
      <CartProvider>
        <App />
      </CartProvider>
    </Provider>
  );
} else {
  console.error("Root element not found. Ensure there is a div with id 'root' in your HTML.");
}
