import { Component } from "react";
import classes from "../styles/Navbar.module.css";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";

import logo from "../images/svg 3.png";
import { BsCart } from "react-icons/bs";
import { Link } from "react-router-dom";

const getCurrencyQuery = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

class NavBar extends Component {
  render() {
    return (
      <nav className={classes.nav}>
        <div className={classes.links_list}>
          <a href="/category/all">ALL</a>

          <a href="/category/tech">TECH</a>

          <a href="/category/clothes">CLOTHES</a>
        </div>

        <div>
          <img src={logo} alt="" />
        </div>

        <div className={classes.cart}>
          <div>
            <Query query={getCurrencyQuery}>
              {({ loading, error, data }) => {
                if (loading) return <p>Loading…</p>;
                if (error) return <p>Error :(</p>;
                return (
                  <select>
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
          <BsCart size={"1.5rem"} />
        </div>
      </nav>
    );
  }
}

export default NavBar;
