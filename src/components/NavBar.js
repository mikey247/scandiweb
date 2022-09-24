import { Component } from "react";
import classes from "../styles/Navbar.module.css";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";

import logo from "../images/svg 3.png";
import { BsCart } from "react-icons/bs";

import { connect } from "react-redux";
import { currencyActions } from "../redux/currencyRedux";
import { cartActions } from "../redux/cartRedux";
import styled from "styled-components";

const getCurrencyQuery = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

const AttributeColor = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      currency: "",
      symbol: "",
      overlay: false,
    };
  }

  overlayHandler = () => {
    this.setState((currentState) => {
      return { overlay: !currentState.overlay };
    });
    // this.props.reset();
  };

  currencyHandler = (e) => {
    console.log(this.props);

    this.props.changeCurrency({
      value: e.target.value,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currency !== this.props.currency) {
      // Do something here
      this.props.adjust({ currency: this.props.currency });
    }
  }

  render() {
    return (
      <nav className={classes.nav}>
        <div className={classes.links_list}>
          <a href="/category/all">ALL</a>

          <a href="/category/tech">TECH</a>

          <a href="/category/clothes">CLOTHES</a>
        </div>

        <div>
          <a href="/category/all">
            <img src={logo} alt="" />
          </a>
        </div>

        <div className={classes.cart}>
          <div>
            <Query query={getCurrencyQuery}>
              {({ loading, error, data }) => {
                if (loading) return <p>Loading…</p>;
                if (error) return <p>Error :(</p>;
                return (
                  <select
                    value={this.props.currency || "USD"}
                    onChange={this.currencyHandler.bind(this)}
                  >
                    {data.currencies.map(({ label, symbol }) => (
                      <option value={label} key={symbol}>
                        {symbol} {label}
                      </option>
                    ))}
                  </select>
                );
              }}
            </Query>
          </div>
          <span
            className={classes.cartIcon}
            onClick={this.overlayHandler.bind(this)}
          >
            <BsCart size={"1.5rem"} /> <p>{this.props.quantity}</p>
          </span>

          <div
            className={
              this.state.overlay ? `${classes.overlay}` : `${classes.none}`
            }
          >
            <h3>
              My Bag, {this.props.quantity}-
              {this.props.quantity < 2 ? "item" : "items"}
            </h3>
            {this.props.cart.map((product) => (
              <div key={product.id} className={classes.product_section}>
                <div className={classes.product_left_section}>
                  <h3>{product.brand}</h3>
                  <h3> {product.name}</h3>
                  <h3>
                    {
                      product.prices.find(
                        (item) =>
                          item.currency.label === (this.props.currency || "USD")
                      ).currency.symbol
                    }
                    {product.price}
                  </h3>

                  {product.attributes.map((attribute) => (
                    <div key={attribute.id}>
                      <h5>{attribute.name}:</h5>

                      <div className={classes.attribute_values}>
                        {attribute.items.map((item) => (
                          <div key={item.id}>
                            {attribute.type === "swatch" ? (
                              <div
                                className={
                                  product.color === item.displayValue
                                    ? `${classes.selectedColor}`
                                    : ""
                                }
                              >
                                <AttributeColor
                                  color={item.value}
                                  onClick={() => {
                                    this.props.adjustAttributes({
                                      name: attribute.name,
                                      value: item.displayValue,
                                      id: product.id,
                                    });
                                  }}
                                />
                              </div>
                            ) : (
                              <div
                                className={`${classes.attribute_text}
                              ${
                                product.size === item.value ||
                                product.capacity === item.value
                                  ? `${classes.selectedAttribute}`
                                  : ""
                              }
                            }`}
                                onClick={() => {
                                  this.props.adjustAttributes({
                                    name: attribute.name,
                                    value: item.value,
                                    id: product.id,
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

            <div className={classes.total}>
              <h4> Total: </h4>
              <h4>
                {" "}
                {this.props.cart[0] &&
                  this.props.cart[0].prices.find(
                    (item) =>
                      item.currency.label === (this.props.currency || "USD")
                  ).currency.symbol}
                {this.props.total}
              </h4>
            </div>

            <div className={classes.buttons}>
              <a href="/cart" className={classes.view_button}>
                <button>VIEW BAG</button>
              </a>
              <button className={classes.checkout_button}>CHECKOUT</button>
            </div>
          </div>

          <div
            className={
              this.state.overlay
                ? `${classes.overlay_background}`
                : `${classes.none}`
            }
            onClick={this.overlayHandler.bind(this)}
          ></div>
        </div>
      </nav>
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
  changeCurrency: currencyActions.addCurrency,
  add: cartActions.addToCart,
  remove: cartActions.removeFromCart,
  adjustAttributes: cartActions.adjustAttributes,
  adjust: cartActions.adjustTotal,
  reset: cartActions.resetTotal,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
