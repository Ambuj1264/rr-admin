import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "nprogress/nprogress.css";

import App from "../src/App";
import { SidebarProvider } from "../src/contexts/SidebarContext";
import * as serviceWorker from "../src/serviceWorker";
import "react-toastify/dist/ReactToastify.css";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import { GRAPH_QL_URI } from "./envirement";
const client = new ApolloClient({
  uri: GRAPH_QL_URI,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <HelmetProvider>
    <ApolloProvider client={client}>
      <SidebarProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <App />
        </BrowserRouter>
      </SidebarProvider>
    </ApolloProvider>
  </HelmetProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
