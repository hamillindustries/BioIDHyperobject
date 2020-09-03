import React, { Component } from "react";
import "./style.scss";

// data
import Projects from "../../data/projectData.json";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTime: true,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  componentDidMount() {
    this._resizeBind = () => this.resize();
    window.addEventListener("resize", this._resizeBind);
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
    const { width, height } = this.state;
    const sx = width / 1920;
    const sy = height / 1080;
    const scale = Math.min(sx, sy);

    return (
      <div className={className}>
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
