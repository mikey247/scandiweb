import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import classes from "../styles/ProductList.module.css";

import { useParams } from "react-router-dom";

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

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.params !== this.props.params) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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
                    <div key={product.name} className={classes.product}>
                      <img src={product.gallery[0]} alt="" />
                      <p>{product.name}</p>
                      <h5>${product.prices[0].amount}</h5>
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

export default withParams(ProductList);
