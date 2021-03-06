import React, { Component } from "react";
import alfrid from "alfrid";
import "./style.scss";

// data
import Projects from "../../data/projectData.js";
import videoSrc from "../../video/intro.mp4";

class Landing extends Component {
  constructor(props) {
    super(props);

    const skipping = window.location.href.indexOf("skip") > -1;
    this.state = {
      firstTime: true,
      width: window.innerWidth,
      height: window.innerHeight,
      videoPlaying: true,
      showPlayButton: !skipping,
      showBackground: false,
    };

    this._refVideo = React.createRef();
    this._efIndex = alfrid.Scheduler.addEF(() => this._closeCheck());
  }

  _start() {
    this._refVideo.current.play();
    this.setState({ showPlayButton: false });
  }

  _closeCheck() {
    if (!this._refVideo.current) {
      return;
    }
    if (isNaN(this._refVideo.current.duration)) {
      return;
    }

    const threshold = 0.5;
    const { currentTime, duration } = this._refVideo.current;

    if (
      window.location.href.indexOf("skip") > -1 &&
      currentTime < duration - 1 &&
      process.env.NODE_ENV === "development" &&
      !this.state.showPlayButton
    ) {
      this._refVideo.current.currentTime = duration - 1;
    }

    if (duration - currentTime < threshold && !this.state.showBackground) {
      this.setState({ showBackground: true });

      alfrid.Scheduler.removeEF(this._efIndex);
    }
  }

  componentDidMount() {
    this._resizeBind = () => this.resize();
    window.addEventListener("resize", this._resizeBind);

    this._refVideo.current.addEventListener("ended", () => {
      this.setState({ videoPlaying: false, firstTime: false });
      this.props.onVideoEnd();
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resizeBind);
  }

  resize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const skipping = window.location.href.indexOf("skip") > -1;
    const { currentPage, onSelect } = this.props;
    const {
      width,
      height,
      firstTime,
      videoPlaying,
      showBackground,
      showPlayButton,
    } = this.state;
    let className = `landing ${currentPage === 0 ? "show" : ""}`;
    if (showBackground) {
      className += " link";
    }

    const sx = width / 1920;
    const sy = height / 1080;
    const scale = Math.min(sx, sy);

    const showVideo = firstTime && videoPlaying;

    return (
      <div className={className}>
        <div className={`landing-intro_video ${showVideo ? "" : "hide"}`}>
          <video
            autoPlay={skipping}
            muted={skipping}
            src={videoSrc}
            ref={this._refVideo}
          />
        </div>
        <div
          className={`landing_start-container ${showPlayButton ? "" : "hide"}`}
        >
          <div
            className={`landing_start-button ${showPlayButton ? "" : "hide"}`}
            onClick={() => this._start()}
          >
            <p>Start the visit</p>
          </div>
        </div>
        <div className={`landing-background ${showBackground ? "show" : ""}`} />
        <div
          className="landing_link-container"
          style={{
            transform: `scale( ${scale} , ${scale} )`,
            left: `${window.innerWidth / 2}px`,
            top: `${window.innerHeight / 2}px`,
          }}
        >
          {Projects.map((project, i) => {
            const t = project.position.split(",").map((v) => parseFloat(v));
            return (
              <div
                key={i}
                className="landing_project-link"
                style={{
                  left: `${t[0]}%`,
                  top: `${t[1]}%`,
                }}
                onClick={() => onSelect(i)}
              >
                <p>{project.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Landing;
