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
    };
  }

  _onMember(mIndex) {
    this.setState({ selectedIndex: mIndex });
  }

  render() {
    const { selectedIndex } = this.state;
    const { display } = this.props;
    const { title, intro, credits, members } = TeamData;
    const className = `TeamWrapper ${display ? "show" : ""}`;
    const oCredit = { __html: credits };
    const oTitle = {
      __html: selectedIndex === -1 ? title : members[selectedIndex].name,
    };
    const oDesc = {
      __html: selectedIndex === -1 ? intro : members[selectedIndex].desc,
    };

    return (
      <div className={className}>
        <div className="team_conatiner-top">
          <div className="team_text-left team_text">
            <p className="team_member-title" dangerouslySetInnerHTML={oTitle} />
            <p className="team_member-desc" dangerouslySetInnerHTML={oDesc} />
          </div>
          <div className="team_text-right team_text">
            {members.map((member, i) => {
              return (
                <Member
                  key={i}
                  name={member.name}
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
