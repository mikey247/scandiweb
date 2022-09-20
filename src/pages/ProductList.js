import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import classes from "../styles/ProductList.module.css";

import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { cartActions } from "../redux/cartRedux";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductList extends Component {
  constructor() {
    super();
    this.state = {
      selectedCategory: "",
    };
  }

  componentDidMount = () => {
    console.log(this.props);
    // this.getCategory();
    let { category } = this.props.params;
    this.setState({ selectedCategory: category });
  };

  componentDidUpdate() {
    // console.log(this.state.selectedCategory);
    this.render();
  }

  getCategoryQuery = gql`
    query categories($name: String!) {
      category(input: { title: $name }) {
        name
        products {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            name
          }
          prices {
            amount
            currency {
              symbol
              label
            }
          }
          brand
        }
      }
    }
  `;

  render() {
    return (
      <div>
        <Query
          query={this.getCategoryQuery}
          variables={{ name: this.state.selectedCategory }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading…</p>;
            if (error) return <p>Error :(</p>;

            return (
              <>
                <h1>
                  {data.category.name[0].toUpperCase() +
                    data.category.name.substring(1)}
                </h1>
                <div className={classes.product_div}>
                  {data.category.products.map((product) => (
                    <a href={`/product/${product.id}`} key={product.name}>
                      <div className={classes.product}>
                        <img src={product.gallery[0]} alt="" />
                        <p>{product.name}</p>
                        <h5>
                          {" "}
                          {
                            product.prices.find(
                              (item) =>
                                item.currency.label ===
                                (this.props.currency || "USD")
                            ).currency.symbol
                          }
                          {
                            product.prices.find(
                              (item) =>
                                item.currency.label ===
                                (this.props.currency || "USD")
                            ).amount
                          }
                        </h5>
                      </div>
                    </a>
                  ))}
                </div>

                <>
                  <div className={classes.overlay}>
                    <h3>
                      My Bag, {this.props.quantity}-
                      {this.props.quantity < 2 ? "item" : "items"}
                    </h3>
                    {this.props.cart.map((product) => (
                      <div key={product.id} className={classes.product_section}>
                        <div>
                          <h3>{product.brand}</h3>
                          <h3> {product.name}</h3>
                          <h3>
                            {
                              product.prices.find(
                                (item) =>
                                  item.currency.label ===
                                  (this.props.currency || "USD")
                              ).currency.symbol
                            }
                            {product.price}
                          </h3>
                        </div>

                        <div className={classes.product_right_section}>
                          <div className={classes.item_amount}>
                            <button
                              type=""
                              className={classes.add}
                              onClick={() =>
                                this.props.add({ ...product, quantity: 1 })
                              }
                            >
                              +
                            </button>
                            <p>{product.quantity}</p>
                            <button
                              type=""
                              className={classes.subtract}
                              onClick={() =>
                                this.props.remove({
                                  id: product.id,
                                })
                              }
                            >
                              -
                            </button>
                          </div>

                          <img src={product.gallery[0]} alt="" />
                        </div>
                      </div>
                    ))}

                    <h2>
                      {" "}
                      Total:{" "}
                      {this.props.cart[0] &&
                        this.props.cart[0].prices.find(
                          (item) =>
                            item.currency.label ===
                            (this.props.currency || "USD")
                        ).currency.symbol}
                      {this.props.total}
                    </h2>
                  </div>
                </>
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.value,
  cart: state.cart.products,
  total: state.cart.totalAmount,
  quantity: state.cart.quantity,
});

const mapDispatchToProps = {
  add: cartActions.addToCart,
  remove: cartActions.removeFromCart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withParams(ProductList));
