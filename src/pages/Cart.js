//

import { Component } from "react";
import classes from "../styles/Cart.module.css";

import { connect } from "react-redux";
import { cartActions } from "../redux/cartRedux";
import styled from "styled-components";

const AttributeColor = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

class Cart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
  }

  attributeHandler = (attribute) => {
    // console.log(attribute);
    // if (attribute.name === "Color") {
    //   this.setState({ color: attribute.value });
    // }
    // if (attribute.name === "Capacity") {
    //   this.setState({ capacity: attribute.value });
    // }
    // if (attribute.name === "Size") {
    //   this.setState({ size: attribute.value });
    // }
    // console.log(this.state);
  };

  render() {
    return (
      <>
        <h1 className={classes.cart_heading}>CART</h1>
        <hr />
        {this.props.cart.map((product) => (
          <div className={classes.cart_top_section} key={product.id}>
            <div>
              <h1 className={classes.brand}>{product.brand}</h1>
              <h1 className={classes.name}>{product.name}</h1>
              <h2>
                {" "}
                {
                  product.prices.find(
                    (item) =>
                      item.currency.label === (this.props.currency || "USD")
                  ).currency.symbol
                }
                {
                  product.prices.find(
                    (item) =>
                      item.currency.label === (this.props.currency || "USD")
                  ).amount
                }
              </h2>

              {product.attributes.map((attribute) => (
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

            <div className={classes.cart_top_section_right}>
              <div className={classes.item_amount}>
                <button
                  type=""
                  className={classes.add}
                  onClick={() => this.props.add({ ...product, quantity: 1 })}
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

        <div className={classes.cart_bottom_section}>
          <h3>Tax 21%:</h3>
          <h3>Quantity:{this.props.quantity}</h3>
          <h3>
            Total:
            {this.props.cart.length < 1
              ? ""
              : this.props.cart[0].prices.find(
                  (item) =>
                    item.currency.label === (this.props.currency || "USD")
                ).currency.symbol}
            {this.props.total}
          </h3>
          <button type="">Order</button>
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
