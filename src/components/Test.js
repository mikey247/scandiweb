import { Component } from "react";
import { graphql } from "graphql";
import { gql } from "@apollo/client";

const getCurrencyQuery = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

class Test extends Component {
  render() {
    console.log(this.props);
    return <>Test</>;
  }
}

export default graphql(getCurrencyQuery)(Test);
