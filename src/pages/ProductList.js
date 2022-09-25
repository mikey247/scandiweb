import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import classes from "../styles/ProductList.module.css";

import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { cartActions } from "../redux/cartRedux";
import { BsCart } from "react-icons/bs";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductList extends Component {
  constructor() {
    super();
    this.state = {
      selectedCategory: "",
      quickShop: -1,
    };
  }

  handleQuickShop = () => {
    this.setState((currentState) => {
      return { quickShop: !currentState.quickShop };
    });
  };

  showQuickShop = (i) => {
    this.setState({ quickShop: i });
  };

  hideQuickShop = () => {
    this.setState({ quickShop: -1 });
  };

  componentDidMount = () => {
    console.log(this.props);
    // this.getCategory();
    let { category } = this.props.params;
    this.setState({ selectedCategory: category });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      console.log(this.state);
    }
  }

  getCategoryQuery = gql`
    query categories($name: String!) {
      category(input: { title: $name }) {
        name
        products {
          name
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            name
            type
            items {
              displayValue
              value
              id
            }
            id
          }
          prices {
            currency {
              symbol
              label
            }
            amount
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
                  {data.category.products.map((product, index) => (
                    <div
                      onMouseEnter={() => {
                        this.showQuickShop(index);
                      }}
                      onMouseLeave={this.hideQuickShop}
                      className={`${classes.product} 
                      ${this.state.quickShop === index ? classes.border : ""}
                      `}
                      key={product.name}
                    >
                      <div>
                        <a href={`/product/${product.id}`}>
                          <img src={product.gallery[0]} alt="" />
                        </a>
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
                      <div
                        className={`
                        ${
                          this.state.quickShop === index
                            ? classes.visible
                            : classes.none
                        }
                        `}
                        onClick={() => {
                          console.log(this.props);
                          console.log(product);
                          this.props.add({
                            ...product,
                            quantity: 1,
                            price: product.prices.find(
                              (item) =>
                                item.currency.label === this.props.currency
                            ).amount,
                          });
                        }}
                      >
                        <BsCart size={"2rem"} color={"white"} />
                      </div>
                    </div>
                  ))}
                </div>
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
