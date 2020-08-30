import React from "react";
import "./style.scss";

const Team = ({ display }) => {
  return (
    <div className={display ? "TeamWrapper show" : "TeamWrapper"}>
      <h1 className="team-title">Team Page</h1>
    </div>
  );
};

export default Team;
