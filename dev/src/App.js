import React, { Component } from "react";
import "./main.scss";

// data
import ProjectPagesData from "./data/projectData.js";

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
      currentPage: 2,
      showTeamPage: false,
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

  selectProject(mIndex) {
    this.setState({ currentPage: mIndex + 1 });
  }

  render() {
    const { currentPage, showTeamPage } = this.state;

    const classNameFooter = `footer ${showTeamPage ? "hide" : ""}`;
    const classNameArrow = `arrow-button ${currentPage === 0 ? "hide" : ""}`;

    const { id, name, desc } = ProjectPagesData[currentPage - 1];

    return (
      <div className="App">
        <div
          className={`arrow-left ${classNameArrow}`}
          onClick={() => this.prev()}
        />
        <div
          className={`arrow-right ${classNameArrow}`}
          onClick={() => this.next()}
        />

        <div className={classNameFooter}>
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

        <Team display={showTeamPage} onClose={() => this.toggleTeam()} />

        <div>
          <ProjectPage id={id} name={name} desc={desc} selected={true} />
        </div>
        <Landing
          currentPage={currentPage}
          onSelect={(i) => this.selectProject(i)}
        />
        <WebGL currentPage={currentPage} />
      </div>
    );
  }
}

export default App;
