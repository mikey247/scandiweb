//

import { Component } from "react";
import classes from "../styles/Cart.module.css";

import { connect } from "react-redux";
import { cartActions } from "../redux/cartRedux";

class Cart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
  }

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

              <h4>SIZE:</h4>

              <h4>COLOR:</h4>
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
              ? "$"
              : this.props.cart[0].prices.find(
                  (item) =>
                    item.currency.label === (this.props.currency || "USD")
                ).currency.symbol}
            {this.props.total || 0}
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
