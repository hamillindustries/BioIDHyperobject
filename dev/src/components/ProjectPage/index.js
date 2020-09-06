import React, { Component } from "react";
import Slides from "./Slides";

import SlidesData from "../../data/files.json";

import "./style.scss";

class ProjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetail: false,
    };
  }

  render() {
    const { id, name, selected, desc } = this.props;
    const { showDetail } = this.state;
    const className = selected ? "ProjectWrapper show" : "ProjectWrapper";
    return (
      <div className={className}>
        <div className="LeftContainer TextContainer">
          <h2>{name}</h2>
        </div>
        <div className="RightContainer TextContainer">
          <p>{desc}</p>
          <div
            className="project_play-button"
            onClick={() => {
              this.setState({ showDetail: true });
            }}
          />
        </div>
        <Slides
          id={id}
          files={SlidesData[id - 1]}
          show={showDetail}
          onClose={() => {
            this.setState({ showDetail: false });
          }}
        />
      </div>
    );
  }
}

export default ProjectPage;
