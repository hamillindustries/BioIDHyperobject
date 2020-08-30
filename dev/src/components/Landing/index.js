import React, { Component } from "react";
import "./style.scss";

class Landing extends Component {
  render() {
    const { currentPage } = this.props;
    const className = `landing ${currentPage === 0 ? "show" : ""}`;
    return <div className={className}></div>;
  }
}

export default Landing;
