import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store"; // adjust path to your store
import './index.css'; // or './main.css' depending on what you named your file
import { AuthProvider} from "./AuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
    <App />
    </AuthProvider>
  </Provider>
);
