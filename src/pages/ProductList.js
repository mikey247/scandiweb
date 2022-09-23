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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.category !== this.props.params.category) {
      // Do something here
      this.render();
    }
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
