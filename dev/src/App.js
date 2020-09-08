import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

import "./main.scss";
import logoSrc from "./images/logo.png";

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
      showTeamPage: true,
      showFooter: false,
      pageToggle: 0,
      locked: false,
    };
  }

  prev() {
    const { currentPage, pageToggle, locked } = this.state;
    if (locked) {
      return;
    }
    this.setState({
      currentPage: currentPage === 0 ? 6 : currentPage - 1,
      previousPage: currentPage,
      pageToggle: 1 - pageToggle,
      locked: true,
    });
    // unlock
    setTimeout(() => {
      this.setState({
        locked: false,
      });
    }, 1000);
  }

  next() {
    const { currentPage, pageToggle, locked } = this.state;
    if (locked) {
      return;
    }
    this.setState({
      currentPage: currentPage === 6 ? 0 : currentPage + 1,
      previousPage: currentPage,
      pageToggle: 1 - pageToggle,
      locked: true,
    });
    // unlock
    setTimeout(() => {
      this.setState({
        locked: false,
      });
    }, 1000);
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

  lockArrows(mValue) {
    this.setState({ locked: mValue });
  }

  render() {
    const {
      currentPage,
      previousPage,
      pageToggle,
      showTeamPage,
      showFooter,
      locked,
    } = this.state;

    let classNameFooter = `footer ${showTeamPage ? "hide" : ""}`;
    if (!showFooter) {
      classNameFooter = "footer hide";
    }
    let classNameArrow = `arrow-button ${currentPage === 0 ? "hide" : ""}`;
    if (locked) {
      classNameArrow += " locked";
    }

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
          lockArrows={(mValue) => this.lockArrows(mValue)}
        />
      );
    });

    return (
      <div className="App">
        <img
          className={`logo ${showTeamPage || !showFooter ? "hide" : ""}`}
          src={logoSrc}
          alt="Bio-ID"
        ></img>
        <div
          data-tip
          data-for="arrowLeft"
          className={`arrow-left ${classNameArrow}`}
          onClick={() => this.prev()}
        />
        <ReactTooltip
          id="arrowLeft"
          place="bottom"
          type="light"
          effect="float"
          backgroundColor="#fff8e6"
        >
          <span>Previous Project</span>
        </ReactTooltip>
        <div
          data-tip
          data-for="arrowRight"
          className={`arrow-right ${classNameArrow}`}
          onClick={() => this.next()}
        />
        <ReactTooltip
          id="arrowRight"
          place="bottom"
          type="light"
          effect="float"
          backgroundColor="#fff8e6"
        >
          <span>Next Project</span>
        </ReactTooltip>

        <div className={classNameFooter}>
          <TextButton
            text={"Main"}
            visible={currentPage !== 0}
            onClick={() => {
              this.setState({ currentPage: 0, showTeamPage: false });
            }}
          />
          <TextButton
            text={"Team"}
            visible={!showTeamPage}
            onClick={() => this.toggleTeam()}
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
