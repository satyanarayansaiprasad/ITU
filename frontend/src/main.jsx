import { patchGlobalFetch, setupAxiosInterceptors } from "./utils/backendManager";
import axios from "axios";
import React from "react";  
import ReactDOM from "react-dom/client";  
import App from "./App";  
import { BrowserRouter } from "react-router-dom";

// Initialize backend failover/retry interceptors
patchGlobalFetch();
setupAxiosInterceptors(axios);

ReactDOM.createRoot(document.getElementById("root")).render(  
  <React.StrictMode> 
    <BrowserRouter>
    <App />  
    </BrowserRouter> 
  </React.StrictMode>  
);  
