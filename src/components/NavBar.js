import { Component } from "react";
import classes from "../styles/Navbar.module.css";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";

import logo from "../images/svg 3.png";
import { BsCart } from "react-icons/bs";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { currencyActions } from "../redux/currencyRedux";
import { cartActions } from "../redux/cartRedux";

const getCurrencyQuery = gql`
  {
    currencies {
      label
      symbol
    }
  }
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
  };

  currencyHandler = (e) => {
    console.log(this.props);
    // this.setState({
    //   currency: e.target.value.split(" ")[0],
    //   symbol: e.target.value.split(" ")[1],
    // });
    this.props.changeCurrency({
      value: e.target.value, //this.state.currency,
      // symbol: this.state.symbol,
    });
  };

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
          <Link
            to=""
            className={classes.cartIcon}
            onClick={this.overlayHandler.bind(this)}
          >
            <BsCart size={"1.5rem"} /> <p>{this.props.quantity}</p>
          </Link>

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
                <div>
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
                {this.props.total < 1 ? "0" : this.props.total}
              </h4>
            </div>

            <div className={classes.buttons}>
              <button className={classes.view_button}>
                <a href="/cart">VIEW BAG</a>
              </button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
