import React, { Component } from "react";
import "./style.css";

class ProjectPage extends Component {
  render() {
    const { name, selected, desc } = this.props;
    const className = selected ? "ProjectWrapper show" : "ProjectWrapper";
    return (
      <div className={className}>
        <div className="LeftContainer TextContainer">
          <h2>{name}</h2>
        </div>
        <div className="RightContainer TextContainer">
          <p>{desc}</p>
        </div>
      </div>
    );
  }
}

export default ProjectPage;
