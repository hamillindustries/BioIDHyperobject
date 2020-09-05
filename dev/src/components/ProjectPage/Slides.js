import React, { Component } from "react";
import "./style.scss";

class Slides extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
    };
  }

  select(mIndex) {
    this.setState({ selected: mIndex });
  }

  render() {
    const { id, show, files, onClose } = this.props;
    const { selected } = this.state;
    const path = files[selected];
    const ext = path.split(".")[1];

    const src = `${process.env.PUBLIC_URL}/images/projects/0${id}/${path}`;

    const className = show ? "project-slides show" : "project-slides";
    console.log("class name :", className);
    return (
      <div className={className}>
        <div className="project-slides_wrapper">
          <div className="sildes-media_container">
            {ext === "jpg" ? (
              <img src={src} width="100%" className="slides-media" />
            ) : (
              <video
                src={src}
                width="100%"
                // autoPlay
                // muted
                controls
                className="slides-media"
              />
            )}
          </div>
          <div className="sildes-list_container">
            {files.map((f, i) => (
              <div
                key={i}
                className={`slides-list_dots ${
                  i === selected ? "selected" : ""
                }`}
                onClick={() => {
                  this.select(i);
                }}
              />
            ))}
          </div>
          <div className="project-slides_close" onClick={() => onClose()} />
        </div>
      </div>
    );
  }
}

export default Slides;
