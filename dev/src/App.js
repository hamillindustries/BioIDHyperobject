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
      previousPage: 0,
      currentPage: 0,
      showTeamPage: false,
      showFooter: false,
      pageToggle: 0,
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
    const { currentPage, pageToggle } = this.state;
    this.setState({
      currentPage: currentPage === 0 ? 6 : currentPage - 1,
      previousPage: currentPage,
      pageToggle: 1 - pageToggle,
    });
  }

  next() {
    const { currentPage, pageToggle } = this.state;
    this.setState({
      currentPage: currentPage === 6 ? 0 : currentPage + 1,
      previousPage: currentPage,
      pageToggle: 1 - pageToggle,
    });
  }

  toggleTeam() {
    this.setState({ showTeamPage: !this.state.showTeamPage });
  }

  selectProject(mIndex) {
    const { pageToggle } = this.state;
    this.setState({
      currentPage: mIndex + 1,
      previousPage: 0,
      pageToggle: 1 - pageToggle,
    });
  }

  onVideEnd() {
    this.setState({ showFooter: true });
  }

  render() {
    const {
      currentPage,
      previousPage,
      pageToggle,
      showTeamPage,
      showFooter,
    } = this.state;

    let classNameFooter = `footer ${showTeamPage ? "hide" : ""}`;
    if (!showFooter) {
      classNameFooter = "footer hide";
    }
    const classNameArrow = `arrow-button ${currentPage === 0 ? "hide" : ""}`;

    const ary = [];

    let idCurr, nameCurr, descCurr, showCurr;
    let idPrev, namePrev, descPrev, showPrev;
    if (currentPage > 0) {
      const o = ProjectPagesData[currentPage - 1];
      idCurr = o.id;
      nameCurr = o.name;
      descCurr = o.desc;
      showCurr = true;
    } else {
      showCurr = false;
    }
    ary[pageToggle] = {
      id: idCurr,
      name: nameCurr,
      desc: descCurr,
      show: showCurr,
    };

    if (previousPage > 0) {
      const o = ProjectPagesData[previousPage - 1];
      idPrev = o.id;
      namePrev = o.name;
      descPrev = o.desc;
      showPrev = true;
    } else {
      showPrev = false;
    }
    ary[1 - pageToggle] = {
      id: idPrev,
      name: namePrev,
      desc: descPrev,
      show: showPrev,
    };

    const projectPages = ary.map(({ id, name, desc, show }, i) => {
      return (
        <ProjectPage
          key={i}
          id={id === undefined ? -1 : id}
          name={name || ""}
          desc={desc || ""}
          selected={id === undefined ? false : id === currentPage}
        />
      );
    });

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

        <div className="projects-container">{projectPages}</div>
        <Landing
          currentPage={currentPage}
          onVideoEnd={() => this.onVideEnd()}
          onSelect={(i) => this.selectProject(i)}
        />
        <WebGL currentPage={currentPage} />
      </div>
    );
  }
}

export default App;
