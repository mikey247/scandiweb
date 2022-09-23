import { Component } from "react";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import classes from "../styles/ProductDetail.module.css";
import styled from "styled-components";

import { useParams } from "react-router-dom";

import { connect } from "react-redux";
import { cartActions } from "../redux/cartRedux";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}
const AttributeColor = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

class ProductDetail extends Component {
  constructor() {
    super();
    this.state = {
      color: "",
      size: "",
      capacity: "",
    };
  }

  componentDidMount() {
    this.getProduct();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      // Do something here
      console.log(this.state);
    }
  }

  attributeHandler = (attribute) => {
    // console.log(attribute);
    if (attribute.name === "Color") {
      this.setState({ color: attribute.value });
    }

    if (attribute.name === "Capacity") {
      this.setState({ capacity: attribute.value });
    }
    if (attribute.name === "Size") {
      this.setState({ size: attribute.value });
    }

    // console.log(this.state);
  };

  getProductQuery = gql`
    query product($id: String!) {
      product(id: $id) {
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
  `;

  getProduct = () => {
    this.props.client
      .query({
        query: gql`
          {
            product(id: "ps-5") {
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
        `,
      })
      .then((result) => {
        console.log(result.data.product);
        // console.log(this.props.params.id);
      });
  };

  render() {
    return (
      <Query
        query={this.getProductQuery}
        variables={{ id: this.props.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading…</p>;
          if (error) return <p>Error :(</p>;

          return (
            <div className={classes.product}>
              <div className={classes.images}>
                <div className={classes.gallery}>
                  {data.product.gallery.map((image) => (
                    <img src={image} alt="" key={image} />
                  ))}
                </div>
                <div className={classes.main_image}>
                  <img src={data.product.gallery[0]} alt="" />
                </div>
              </div>

              <div className={classes.product_details}>
                <h1>{data.product.brand}</h1>
                <h1>{data.product.name}</h1>

                <div>
                  <div>
                    {/* {data.product.attributes.map((item) => {
                      console.log(item);
                    })} */}
                    {data.product.attributes.map((attribute) => (
                      <div key={attribute.id}>
                        <h2>{attribute.name}:</h2>

                        <div className={classes.attribute_values}>
                          {attribute.items.map((item) => (
                            <div key={item.id}>
                              {attribute.type === "swatch" ? (
                                <div
                                  className={
                                    Object.values(this.state).includes(
                                      `${item.displayValue}`
                                    )
                                      ? `${classes.selectedColor}`
                                      : ""
                                  }
                                >
                                  <AttributeColor
                                    color={item.value}
                                    onClick={() => {
                                      this.attributeHandler({
                                        name: attribute.name,
                                        value: item.displayValue,
                                      });
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`${classes.attribute_text} ${
                                    Object.values(this.state).includes(
                                      item.displayValue
                                    )
                                      ? `${classes.selectedAttribute}`
                                      : ""
                                  }`}
                                  onClick={() => {
                                    this.attributeHandler({
                                      name: attribute.name,
                                      value: item.value,
                                    });
                                  }}
                                >
                                  {item.value}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3>PRICE:</h3>

                  <h2>
                    {
                      data.product.prices.find(
                        (item) =>
                          item.currency.label === (this.props.currency || "USD")
                      ).currency.symbol
                    }
                    {
                      data.product.prices.find(
                        (item) =>
                          item.currency.label === (this.props.currency || "USD")
                      ).amount
                    }{" "}
                  </h2>
                </div>
                <button
                  type=""
                  onClick={() => {
                    console.log(this.props);
                    this.props.add({
                      ...data.product,
                      ...this.state,
                      quantity: 1,
                      price: data.product.prices.find(
                        (item) => item.currency.label === this.props.currency
                      ).amount,
                    });
                  }}
                >
                  Add to Cart
                </button>

                <div
                  dangerouslySetInnerHTML={{ __html: data.product.description }}
                ></div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart.products,
  total: state.cart.totalAmount,
  quantity: state.cart.quantity,
  currency: state.currency.value,
});

const mapDispatchToProps = {
  add: cartActions.addToCart,
  remove: cartActions.removeFromCart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withParams(ProductDetail));
