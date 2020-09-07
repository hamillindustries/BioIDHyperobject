import React, { Component } from "react";
import Member from "./Member";
import "./style.scss";

// data
import TeamData from "../../data/teamData";

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: -1,
      startAnimation: false,
    };
  }

  _onMember(mIndex) {
    if (this.state.selectedIndex === mIndex) {
      this.setState({ selectedIndex: -1 });
    } else {
      this.setState({ selectedIndex: mIndex });
    }
  }

  componentDidMount() {
    this._timeout = setTimeout(() => this.playAnim(), 100);
  }

  playAnim() {
    this.setState({
      startAnimation: true,
    });
  }

  render() {
    const { selectedIndex, startAnimation } = this.state;
    const { display, onClose } = this.props;
    const { title, intro, credits, members } = TeamData;
    const className = `TeamWrapper ${display ? "show" : ""}`;
    const oIntro = { __html: intro };
    const oCredit = { __html: credits };

    return (
      <div className={className}>
        <div className="team_container-header">
          <div className="team_close" onClick={onClose} />
        </div>
        <div
          className={`team_conatiner-top ${startAnimation ? "showMember" : ""}`}
        >
          <div className="team_text-left team_text">
            <p className="team_member-title">{title}</p>
            <p className="team_member-desc" dangerouslySetInnerHTML={oIntro} />
          </div>
          <div className="team_text-right team_text">
            {members.map((member, i) => {
              return (
                <Member
                  key={i}
                  name={member.name}
                  desc={member.desc}
                  expand={i === selectedIndex}
                  onClick={() => this._onMember(i)}
                />
              );
            })}
          </div>
        </div>
        <div className="team_conatiner-bottom">
          <p dangerouslySetInnerHTML={oCredit} />
        </div>
      </div>
    );
  }
}

export default Team;
