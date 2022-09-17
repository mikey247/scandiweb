//
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Component } from "react";
import NavBar from "./components/NavBar";
import ProductList from "./pages/ProductList";
import { Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <NavBar client={client} />
        <Routes>
          <Route
            path="/category/:category"
            element={<ProductList client={client} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail client={client} />}
          />
        </Routes>
      </ApolloProvider>
    );
  }
}

export default App;
