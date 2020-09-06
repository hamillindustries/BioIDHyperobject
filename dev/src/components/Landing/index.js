import React, { Component } from "react";
import "./style.scss";

// data
import Projects from "../../data/projectData.js";
import videoSrc from "../../video/intro.mp4";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTime: true,
      width: window.innerWidth,
      height: window.innerHeight,
      videoPlaying: false,
    };

    this._refVideo = React.createRef();
  }

  componentDidMount() {
    this._resizeBind = () => this.resize();
    window.addEventListener("resize", this._resizeBind);

    this._refVideo.current.addEventListener("ended", () => {
      this.setState({ videoPlaying: false, firstTime: false });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resizeBind);
  }

  resize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const { currentPage, onSelect } = this.props;
    const className = `landing ${currentPage === 0 ? "show" : ""}`;
    const { width, height, firstTime, videoPlaying } = this.state;
    const sx = width / 1920;
    const sy = height / 1080;
    const scale = Math.min(sx, sy);

    const showVideo = firstTime && videoPlaying;

    return (
      <div className={className}>
        <div className={`landing-intro_video ${showVideo ? "" : "hide"}`}>
          <video autoPlay muted src={videoSrc} ref={this._refVideo} />
        </div>
        {Projects.map((project, i) => {
          const t = project.position.split(",").map((v) => parseFloat(v));
          return (
            <div
              key={i}
              className="landing_project-link"
              style={{
                left: `${t[0] * scale + 50}vw`,
                top: `${t[1] * scale + 50}vh`,
              }}
              onClick={() => onSelect(i)}
            >
              <p>{project.name}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Landing;
