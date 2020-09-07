import React, { Component } from "react";
import Slides from "./Slides";

import SlidesData from "../../data/files.json";

import "./style.scss";

class ProjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetail: false,
      closeDetail: false,
    };
  }

  closeDetails() {
    this.setState({ closeDetail: true });
    setTimeout(() => {
      this.setState({ showDetail: false, closeDetail: false });
      this.props.lockArrows(false);
    }, 500);
  }

  render() {
    const { id, name, selected, desc, lockArrows } = this.props;
    const { showDetail, closeDetail } = this.state;

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
              lockArrows(true);
            }}
          />
        </div>
        {id > -1 && (
          <Slides
            id={id}
            files={SlidesData[id - 1]}
            show={showDetail}
            close={closeDetail}
            onClose={() => this.closeDetails()}
          />
        )}
      </div>
    );
  }
}

export default ProjectPage;
