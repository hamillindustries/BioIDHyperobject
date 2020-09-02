import React, { Component } from "react";
import "./App.css";
import "./main.scss";

// data
import ProjectPagesData from "./data/projectData.json";

// components
import Landing from "./components/Landing";
import ProjectPage from "./components/ProjectPage";
import TextButton from "./components/TextButton";
import Team from "./components/Team";
import WebGL from "./components/WebGL";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: 0,
      showTeamPage: true,
    };

    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 32) {
        const { currentPage } = this.state;
        const nextPage = currentPage === 6 ? 0 : currentPage + 1;
        this.setState({ currentPage: nextPage });
      }
    });
  }

  prev() {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage === 0 ? 6 : currentPage - 1 });
  }

  next() {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage === 6 ? 0 : currentPage + 1 });
  }

  toggleTeam() {
    this.setState({ showTeamPage: !this.state.showTeamPage });
  }

  render() {
    const { currentPage, showTeamPage } = this.state;
    console.log("currentPage", currentPage);

    return (
      <div className="App">
        <div className="arrow-left arrow-button" onClick={() => this.prev()} />
        <div className="arrow-right arrow-button" onClick={() => this.next()} />

        <div className="footer">
          <TextButton
            text={"Team"}
            visible={!showTeamPage}
            onClick={() => this.toggleTeam()}
          />
          <TextButton
            text={"Main"}
            visible={currentPage !== 0}
            onClick={() => {
              this.setState({ currentPage: 0, showTeamPage: false });
            }}
          />
        </div>

        <Team display={showTeamPage} />
        <Landing currentPage={currentPage} />

        <div className="ProjectsWrapper">
          {ProjectPagesData.map(({ id, name, desc }, i) => (
            <ProjectPage
              key={i}
              id={id}
              name={name}
              desc={desc}
              selected={currentPage === i + 1}
            />
          ))}
        </div>
        <WebGL currentPage={currentPage} />
      </div>
    );
  }
}

export default App;
