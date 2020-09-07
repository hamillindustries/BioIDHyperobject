import React, { Component } from "react";
import "./style.scss";

class Slides extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      selected: 0,
    };
  }

  select(mIndex) {
    this.setState({ selected: mIndex });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show && !this.props.show) {
      this.setState({ selected: 0 });

      if (this.ref.current.pause) {
        this.ref.current.currentTime = 0;
        this.ref.current.pause();
      }
    }
  }

  render() {
    const { id, show, close, files, onClose } = this.props;
    const { selected } = this.state;
    const path = files[selected];
    const ext = path.split(".")[1];

    let alt = path.split(".")[0];
    alt = alt.split("_")[1];

    const src = `${process.env.PUBLIC_URL}/images/projects/0${id}/${path}`;

    let className = show ? "project-slides show" : "project-slides";
    if (close) {
      className += " close";
    }
    return (
      <div className={className}>
        <div className="project-slides_wrapper">
          <div className="sildes-media_container">
            {ext === "jpg" ? (
              <img
                ref={this.ref}
                src={src}
                alt={alt}
                width="100%"
                className="slides-media"
              />
            ) : (
              <video
                ref={this.ref}
                src={src}
                width="100%"
                controls
                autoPlay
                muted
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
