import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux./store";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
