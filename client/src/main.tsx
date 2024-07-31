import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          publicImages: {
            keyArgs: [],
            merge(existing = { images: [] }, incoming) {
              return {
                ...incoming,
                images: [...existing.images, ...incoming.images],
              };
            },
          },
          userImages: {
            keyArgs: [],
            merge(existing = { images: [] }, incoming) {
              return {
                ...incoming,
                images: [...existing.images, ...incoming.images],
              };
            },
          },
        },
      },
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);
