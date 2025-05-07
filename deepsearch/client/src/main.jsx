import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppDS from "./AppDS.jsx";
import { Provider } from "react-redux";
import { store } from "./store/globalStore.js";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     {/* <App /> */}
//     {/* <AppDS /> */}
//     <Provider store={store}>
//       <AppDS />
//     </Provider>
//   </StrictMode>
// );

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppDS />
  </Provider>
);
