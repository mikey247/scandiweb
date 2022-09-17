import { Component } from "react";
import { gql } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import classes from "../styles/ProductDetail.module.css";

import { useParams } from "react-router-dom";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductDetail extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.getProduct();
  }

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
        console.log(result);
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
                {/*  */}
                <div className={classes.gallery}>
                  {data.product.gallery.map((image) => (
                    <img src={image} alt="" key={image} />
                  ))}
                </div>
                {/*  */}
                <div className={classes.main_image}>
                  <img src={data.product.gallery[0]} alt="" />
                </div>
                {/*  */}
              </div>

              <div className={classes.product_details}>
                <h1>{data.product.brand}</h1>
                <h1>{data.product.name}</h1>
                <div>
                  <h3>PRICE:</h3>
                  <h2>{data.product.prices[0].amount}</h2>
                </div>
                <button type="">Add to Cart</button>

                <p
                  dangerouslySetInnerHTML={{ __html: data.product.description }}
                ></p>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withParams(ProductDetail);
