import React, { Component } from "react";
import Scene from "./Scene";
import "./style.scss";

class WebGL extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentPage !== nextProps.currentPage) {
      this.scene.show(nextProps.currentPage);
    }
    return false;
  }

  componentDidMount() {
    const { ref } = this;
    const { currentPage } = this.props;
    this.scene = new Scene();
    ref.current.appendChild(this.scene.canvas);
    this.resize();

    if (currentPage > 0) {
      this.scene.show(currentPage);
    }

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const ratio = 1;
    this.scene.resize(window.innerWidth * ratio, window.innerHeight * ratio);
  }

  render() {
    return <div className="webgl-container" ref={this.ref}></div>;
  }
}

export default WebGL;
