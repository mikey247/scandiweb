import { Component } from "react";
import classes from "../styles/Navbar.module.css";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";

import logo from "../images/svg 3.png";
import { BsCart } from "react-icons/bs";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { currencyActions } from "../redux/currencyRedux";

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
    };
  }

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
          <Link to="/cart" className={classes.cartIcon}>
            <BsCart size={"1.5rem"} /> <p>{this.props.quantity}</p>
          </Link>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.value,
  quantity: state.cart.quantity,
});

const mapDispatchToProps = {
  changeCurrency: currencyActions.addCurrency,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
